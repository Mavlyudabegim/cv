---
title: Uzbek & English Video Subtitler
summary: Automatic, word-timed Reels-style subtitles for short videos in Uzbek and English, plus fine-tuning and benchmarking of Whisper models for Uzbek, a low-resource language with dialects and Uzbek–Russian code-switching.
order: 1
color: violet
metric: "5×"
metricLabel: fewer character errors after fine-tuning
tags: [Python, Speech recognition, Whisper, Fine-tuning, ffmpeg, Streamlit]
repo: https://github.com/Mavlyudabegim/video_subtitle
demo: https://videosubtitle.streamlit.app/
video: https://github.com/user-attachments/assets/7d3f9e90-1028-4406-bd4f-6901c129e76a
imageAlt: Demo video of automatic Uzbek subtitles on a short video
---

## Overview

Upload a short video (Reels, Shorts, TikTok), and the app transcribes the speech with Whisper-based models, burns styled, word-timed captions into the video and returns the result together with an `.srt` subtitle file. It works for **English** and **Uzbek**.

The project also asks a harder question: **how well does speech recognition work for Uzbek**, a low-resource language, on real social-media videos with regional dialects and Russian words mixed into Uzbek sentences? To answer it, the project includes fine-tuning experiments, a benchmark of open Uzbek models, a labeling tool for building a dialect test set and Uzbek-specific text normalization.

## Highlights

| Result | Value |
|---|---|
| Character error rate of Whisper-base on Uzbek (FLEURS test, 200 clips): original → my fine-tune | 97.6% → **20.1%** |
| Word error rate on the same test set: original → my fine-tune | 145.2% → **62.9%** |
| Training time for the fine-tune, on a laptop GPU | **~36 min** |
| Open Uzbek models benchmarked on real videos | **6** |

A word error rate above 100% means the original model produced more wrong words than the reference contains: it mostly hallucinated instead of transcribing Uzbek.

## Features

- **Two languages:** English with OpenAI Whisper, Uzbek with fine-tuned Whisper models.
- **Reels-style captions:** short chunks of 1–8 words in big bold text with an outline, placed above the app's interface area, with a size that scales with the video resolution.
- **Word-level timing:** captions follow the speech closely, using word timestamps and voice activity detection to skip silence and music.
- **Uzbek-aware text handling:**
  - all apostrophe variants are unified, so *oʻ*, *gʻ* and the glottal stop are written consistently;
  - words that the tokenizer split at an apostrophe are merged back together;
  - Cyrillic (Uzbek Cyrillic or Russian words) is transliterated to Uzbek Latin, e.g. *просто → prosto*.
- **Outputs:** a video with burned-in subtitles (`.mp4`) and a subtitle file (`.srt`).
- **Three interfaces:** command line, Gradio web app and Streamlit web app.
- **Runs on CPU:** models are converted to CTranslate2 (faster-whisper) with int8 inference.
- **Tested:** pytest unit tests for caption grouping, subtitle formats, Uzbek normalization and audio loading.

## How it works

1. **Read:** ffprobe reads the size, rotation, duration and audio track; phone-video rotation is handled.
2. **Audio:** ffmpeg extracts mono 16 kHz audio.
3. **Transcribe:** faster-whisper with word timestamps and voice activity detection; the model is chosen per language (Whisper for English, a fine-tuned Whisper for Uzbek).
4. **Captions:** words are grouped into short captions. A new caption starts at a word or character limit, a pause longer than 0.6 s or a sentence end. The result is written as `.srt` and as a styled `.ass` file (font, outline, position).
5. **Render:** ffmpeg with libass burns the subtitles into the frames and produces the final `.mp4`.

| Step | Module |
|---|---|
| Read video and extract audio | `subtitler/media.py` |
| Speech recognition and Uzbek word fixes | `subtitler/transcribe.py` |
| Words → captions → `.srt` / `.ass` | `subtitler/captions.py` |
| Full pipeline: `add_subtitles(...)` | `subtitler/pipeline.py` |

## Fine-tuning Whisper for Uzbek

Whisper-base was fine-tuned on **FLEURS Uzbek** (about 10 hours of read speech) for 1,000 steps, in about 36 minutes on an Apple-Silicon MacBook GPU.

| Model | Test set | WER ↓ | CER ↓ |
|---|---|---|---|
| openai/whisper-base (original) | FLEURS uz test, 200 clips | 145.2% | 97.6% |
| **whisper-base + my fine-tune** | FLEURS uz test, 200 clips | **62.9%** | **20.1%** |
| openai/whisper-base (original) | my reels, 11 clips\* | 175.7% | 130.2% |
| **whisper-base + my fine-tune** | my reels, 11 clips\* | **42.2%** | **12.0%** |

\* Preliminary: a very small test set whose reference transcripts were corrected from model drafts, which favours the fine-tuned model.

**Training setup:** full fine-tuning with the Hugging Face `Seq2SeqTrainer`, log-mel features computed on the fly (no large feature cache), light augmentation (random gain and noise), gradient checkpointing and validation WER/CER during training. For larger models on a free T4 GPU, the decoder can be trained alone (`--freeze-encoder`) with the memory-saving Adafactor optimizer.

**Continued fine-tuning:** the training script can also start from an already fine-tuned Uzbek model and mix in new data. *Replay data* from the original model's training domains prevents it from forgetting standard Uzbek (catastrophic forgetting), and a small learning rate with few steps adjusts the model instead of overwriting it.

## Comparing open Uzbek models on real videos

| Model | Size | Training data (as reported) | On my videos |
|---|---|---|---|
| openai/whisper-base | 74 M | multilingual, very little Uzbek | unusable |
| whisper-base, my fine-tune | 74 M | FLEURS uz (~10 h) | readable, many errors |
| BlueRaccoon/whisper-small-uz | 244 M | Common Voice 11 + FLEURS | weak |
| navai-uz/whisper-base-uzbek | 74 M | ~750 h | better, still errors |
| Abduqayum/whisper-uzbek-medium-callcenter | 769 M | ~780 h (audiobooks, podcasts) | good |
| **islomov/rubaistt_v2_medium** (used in the app) | 769 M | ~475 h incl. Tashkent-dialect podcasts | **best** |

The app uses **rubaistt_v2_medium**, converted to CTranslate2, because it gave the best subtitles on real Uzbek videos. Even this model still struggles with **Samarkand-dialect speech** and **Russian words inside Uzbek sentences**, which motivated the dataset work below.

## Building a dialect and code-switching dataset

Public Uzbek datasets (the ISSAI Uzbek Speech Corpus with ~105 h and FLEURS with ~10 h) are mostly clean, read speech. To measure performance on real reels, a labeling tool turns videos into a dataset:

1. **Segment:** cut videos into speech clips with voice activity detection and create draft transcripts.
2. **Review:** correct the drafts in a small web app.
3. **Export:** create train/test splits **by video**, so no video appears in both (no leakage).
4. **Evaluate:** WER per group: standard, Tashkent, Samarkand and others, and "+ru" for clips that contain Russian words.

**Labeling rules:** Uzbek Latin only; Russian words written in Latin as pronounced (*prosto*, *koroche*); dialect words written as spoken rather than "corrected" to literary Uzbek; each clip tagged with its dialect and whether it contains Russian; test videos transcribed from scratch, without model drafts, to avoid bias.

## Deployment

- **Streamlit Community Cloud (free):** tuned for little RAM, with the int8 Uzbek model, 2 CPU threads, greedy decoding, one video at a time (a lock shared by all visitors), a 30 MB upload limit and downscaling to at most 1280 px height. Temporary files are deleted after each job, so **uploaded videos are not stored**.
- **Docker:** the image includes ffmpeg with libass and bakes the models in, so containers start without downloading ~2 GB.
- **Model conversion:** export to CTranslate2 in float16 for local use or int8 for small CPU servers (half the size), with upload to the Hugging Face Hub.

## Limitations

- The real-video test set is small (11 clips) and was labeled from model drafts, so the per-dialect numbers are not yet reliable.
- All tested models still make many errors on Samarkand-dialect speech and on Russian words inside Uzbek sentences.
- The free online demo runs on a small shared CPU: it takes minutes per reel and serves one user at a time.

## Tech stack

Python · OpenAI Whisper · faster-whisper / CTranslate2 · Hugging Face Transformers · PyTorch · ffmpeg + libass · Streamlit · Gradio · Docker · pytest
