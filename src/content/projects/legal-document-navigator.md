---
title: Legal Document Navigator
summary: A RAG app that answers plain-language questions about contracts and cites the exact clause. Evaluated on ContractNLI (NDAs labelled by lawyers) with no task-specific training.
order: 0
color: blue
metric: "98.4%"
metricLabel: answers cite the right clause
tags: [Python, RAG, LLMs, Hybrid search, Streamlit, Supabase]
repo: https://github.com/Mavlyudabegim/legal_document_navigator
demo: https://legaldocumentnavigator.streamlit.app/
---

## Overview

Upload a contract or another legal document (PDF), ask a question in plain language, and get a short answer that **cites the exact clause**. The PDF opens next to the chat with the supporting sentences highlighted, so every answer can be checked in seconds.

![Legal Document Navigator: chat on the left, the cited PDF page with highlighted sentences on the right](https://github.com/user-attachments/assets/e35dabd0-a994-4661-995a-4ac4bdea9a61)

*The tool explains documents; it is not legal advice.*

## Highlights

| Metric | Result |
|---|---|
| Yes/no answers whose citation contains the lawyers' evidence | **98.4%** |
| Evidence found in the top-5 retrieved clauses (Hit@5) | **96.1%** |
| Evidence sentences that the answer cited (citation recall) | **95.2%** |
| Evidence covered by retrieval (evidence recall) | **94.0%** |

## Features

- **Layout-aware PDF parsing.** Headings are found from font size and bold text, headers and footers are removed, and clause numbering (1., 2.3, (a)) is kept.
- **Clause-based chunking.** Chunks follow the contract's sections instead of fixed-size windows, and each chunk carries its heading path, e.g. "MUTUAL NDA > 4. Term and Termination".
- **Hybrid search.** Embeddings (meaning) and BM25 (exact legal terms) are merged with Reciprocal Rank Fusion.
- **Grounded answers with verified citations.** The model may only use the retrieved clauses. Citations to clauses it was never given are removed, and if nothing relevant is found it says so instead of guessing.
- **Source viewer.** The cited page opens with the 1–2 most relevant sentences highlighted.
- **Private by default.** Each browser gets its own document list, no login needed.
- **Cloud storage.** PDFs, vectors and chats are stored in Supabase (Postgres + pgvector + Storage), with a local Chroma fallback.

## How it works

![Architecture: ingestion pipeline and question-answering pipeline](https://github.com/user-attachments/assets/22bd2692-1ac9-4b2e-bf2e-fc635fc35a6b)

**Ingestion (once per PDF):** PDF → parser (PyMuPDF) → clause chunker (sections, ≤350 tokens) → embeddings (bge-small) → Supabase or Chroma.

**Question:** hybrid search (embeddings + BM25, RRF) → top-5 clauses → LLM (gpt-oss) with a strict "cite or say not found" prompt → citation check → answer with [1] [2] → highlighted PDF page.

| Step | Code |
|---|---|
| PDF → structured elements | `app/ingestion/parser.py` |
| Elements → clause chunks | `app/ingestion/chunker.py` |
| Embeddings | `app/ingestion/embedder.py` |
| Hybrid retrieval (+ optional reranker) | `app/retrieval/` |
| Prompt, LLM call, citation check | `app/generation/` |
| Storage: Supabase or local | `app/storage/` |
| Web interface | `streamlit_app.py`, `app/ui/` |
| Evaluation | `eval/` |

## Evaluation on ContractNLI

**ContractNLI** (Koreeda & Manning, 2021) contains real NDAs in which lawyers labelled 17 statements per contract as *Entailment*, *Contradiction* or *NotMentioned* and marked the evidence sentences. Each statement is asked as a question ("Does the agreement say …?"), and the answer is graded automatically.

- **Fixed sample:** 300 questions from all 61 dev-split NDAs, so every setup answers exactly the same questions. It includes all 95 Contradiction questions (only 9% of the dataset), and headline figures are re-weighted to the real label mix.
- **Paired comparisons:** setups are compared question by question with McNemar tests, with 95% intervals that resample whole contracts.
- **Citation checks:** a citation counts only if the cited clause contains the evidence sentence the lawyers marked.

The pipeline is the same in every column; only the language model changes.

| Metric | gpt-oss-20b (local, 300 q) | gpt-oss-120b (Groq, 100 q) |
|---|---|---|
| Yes/no answers citing the clause that proves them | 93.5% | **98.4%** |
| Citation recall | 89.2% | **95.2%** |
| "Right answer, wrong reason" (unsupported citation) | 8.3% | **3.4%** |
| Accuracy | 75.3% | **85.0%** |
| Macro-F1 | 0.752 | **0.848** |
| Strict accuracy (right label **and** right citation) | 71.0% | **83.0%** |
| Seconds per question | ~28 | **~15** |

**Compared with a fine-tuned model.** A BERT-large model trained on ContractNLI reports 87.5% accuracy in the original paper. This project uses off-the-shelf models with **no training** and reaches 85.8% (re-weighted to the real label mix), with a much higher **Contradiction F1 (0.694 vs 0.357)** and Entailment F1 (0.893 vs 0.834). The 120b result is on 100 of the 300 fixed questions; the full run is in progress.

### Retrieval

On 614 questions with evidence across 61 NDAs:

| Hit@1 | Hit@3 | Hit@5 | MRR | Evidence recall |
|---|---|---|---|---|
| 59.0% | 88.4% | **96.1%** | 0.74 | **94.0%** |

## Key finding: reading, not search

Search was not the bottleneck. With gpt-oss-20b, **23 of 26** missed contradictions already had the evidence in the retrieved clauses; with gpt-oss-120b, **4 of 5**. That is why a stronger answer model helped, while larger embeddings, bigger chunks, whole-document context, few-shot prompting and more reasoning tokens gave no significant gain in paired tests.

## Error analysis

The same patterns cause most errors with both models:

| Pattern | Example | Typical wrong answer |
|---|---|---|
| "Only" statements | "…includes *only* technical information?" vs "including … financial, marketing and operational information" | "Doesn't say", while the answer itself explains the contradiction |
| Prohibition with a carve-out | "shall not copy … *without the prior written consent*" | "Yes, allowed with consent"; lawyers read it as a prohibition |
| Alternatives in a definition | "marked 'Confidential' *or* clearly intended to be disclosed in confidence" | "Yes, marking is required"; marking is only one option |
| Prohibition inferred from a duty | "must return or destroy all information" | "No, copies can't be kept"; lawyers say the contract is silent |

Evidence containing an exception ("except", "unless", "notwithstanding") lowers Contradiction recall for both models. Several remaining "errors" follow annotator conventions that a fine-tuned model learns from thousands of labels and prompting alone does not.

## Tech stack

Python · Streamlit · PyMuPDF · sentence-transformers (BAAI/bge-small-en-v1.5) · rank-bm25 · gpt-oss-120b / gpt-oss-20b (Groq, Ollama) · Supabase (Postgres + pgvector + Storage) · ChromaDB
