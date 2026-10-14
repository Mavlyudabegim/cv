---
title: Scribble-Based Image Segmentation
summary: Built and evaluated a machine learning prototype for foreground/background segmentation, reaching 95% mean IoU on held-out data.
order: 1
color: violet
metric: "95%"
metricLabel: mean IoU
tags: [Python, PyTorch]
repo: https://github.com/Mavlyudabegim/scribble-segmentation
---

## Overview

A machine learning prototype that separates the foreground of an image from its background, guided by a few user scribbles.

## Approach

- Built the model in **Python** with **PyTorch**.
- Split the data 80/20 into training and held-out sets.
- Used early stopping to avoid overfitting.

## Result

The model reached **95% mean IoU** (intersection over union) on the held-out data.
