---
title: Multi-Token-Prediction
date: 2025-11-21 16:22:49
tags:
---

### Abstract

论文挑战了传统LLM训练范式——**仅预测下一个token**。提出让模型在每个位置同时预测**n个未来token**，通过**n个独立的输出头**共享同一模型主干(shared trunk)实现。这种方法将多token预测作为**辅助训练任务**，在不增加训练时间开销的情况下显著提升模型性能。

### Method

- next-token prediction

$L_1 = - \sum_{t} \log P_{\theta}(x_{t+1} \mid x_{t:1})$

- multi-token prediction


$L_n = - \sum_{t} \log P_{\theta}(x_{t+n:t+1} \mid x_{t:1})$





