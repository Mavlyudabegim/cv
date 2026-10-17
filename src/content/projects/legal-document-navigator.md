---
title: Legal Document Navigator
summary: A RAG app that answers plain-language questions about contracts and cites the exact clause. Evaluated on ContractNLI (NDAs labelled by lawyers) with no task-specific training.
order: 0
color: blue
metric: "98.4%"
metricLabel: answers cite the right clause
tags: [Python, RAG, LLMs, Hybrid search, Streamlit, Supabase]
repo: https://github.com/Mavlyudabegim/legal_document_navigator
---

## Overview

Upload a contract (PDF), ask a question in plain language, and get a short answer that **cites the exact clause**. The PDF opens next to the chat with the supporting sentences highlighted, so every answer can be checked in seconds.

*The tool explains documents; it is not legal advice.*

## How it works

- **Layout-aware PDF parsing** with PyMuPDF: headings are detected from font size and bold text, headers and footers are removed, and clause numbering is kept.
- **Clause-based chunking**: chunks follow the contract's sections, and each chunk carries its heading path (e.g. "MUTUAL NDA > 4. Term and Termination").
- **Hybrid search**: embeddings (bge-small) for meaning plus BM25 for exact legal terms, merged with Reciprocal Rank Fusion.
- **Grounded answers with verified citations**: the model may only use the retrieved clauses. Citations to clauses it was never given are removed, and if nothing relevant is found it says so instead of guessing.
- **Storage and UI**: Supabase (Postgres + pgvector + Storage) with a local Chroma fallback, and a Streamlit interface where each browser gets its own private document list.

## Highlights

| Metric | Result |
|---|---|
| Yes/no answers whose citation contains the lawyers' evidence | **98.4%** |
| Evidence found in the top-5 retrieved clauses (Hit@5) | **96.1%** |
| Evidence sentences that the answer cited (citation recall) | **95.2%** |
| Evidence covered by retrieval (evidence recall) | **94.0%** |

## Evaluation on ContractNLI

ContractNLI contains real NDAs in which lawyers labelled 17 statements per contract as true, false or not mentioned. Each statement is asked as a question and graded automatically, on a **fixed sample of 300 questions** from all 61 dev-split NDAs, with paired McNemar tests between setups.

| | gpt-oss-20b (local, 300 questions) | gpt-oss-120b (100 questions) |
|---|---|---|
| Accuracy | 75.3% | **85.0%** |
| Yes/no answers citing the clause that proves them | 93.5% | **98.4%** |
| Strict accuracy (right label **and** right citation) | 71.0% | **83.0%** |

For comparison, a BERT-large model fine-tuned on ContractNLI reports 87.5% accuracy in the original paper. This project uses off-the-shelf models with **no training**. The 120b figure is on 100 of the 300 questions; the full run is in progress.

## Key finding

Search was not the bottleneck: for 96% of the questions that have evidence, the evidence was already in the top-5 retrieved clauses. Most remaining errors came from **reading** the clause, e.g. statements with "only", prohibitions with carve-outs ("without prior written consent"), and alternatives in definitions. That is why a stronger answer model helped, while better embeddings, larger chunks, more output tokens and few-shot prompting did not give a significant gain.
