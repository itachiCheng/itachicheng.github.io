---
title: Reinforcement-Learning
date: 2025-01-29 11:54:26
tags:
---



出于对股票市场自动化交易的兴趣，在自身交易决策精力有限的情况下，希望通过强化学习来节省投入时间，因而，我开始阅读Maxim Lapan的《Deep Reinforcement Learning Hands-on》。某种角度而言，强化学习比有监督学习所站的维度更高。“Even simple Machine Learning (ML) problems have a hidden time dimension, which is frequently overlooked, but it might become an issue in a production system.”，恰好我需要关注这样的时间维度，因为市场的投资瞬息万变，一如湍流在当前人类常识维度中难以理解。如果不借助更高维度的思维模型，有限的精力是无法与之匹配的。

- "Theoretical foundations of RL: the Markov decision processes"
- "RL is the third camp and lays somewhere in between full supervision and a complete lack of predefined labels. "

强化学习是在回答诸如“how”的问题，有监督学习是在回答诸如“what”的问题。其中的两个实体，一个是智能体（Agent），另一个是环境（Environment）。智能体得知的是当前的状态（State）以及上一步获得的奖励（Reward），并根据这两个信息在环境中采取动作（Action）。强化学习就是学习“做什么（即如何把当前的情境映射成动作）才能使得数智化的收益信号最大化”。动作往往影响的不仅仅是即时收益，也会影响下一个情境，从而影响随后的收益。因此，试错和延迟收益——是强化学习两个最重要最显著的特征。

在强化学习中需要解决一个问题是如何训练一个智能体，使得智能体能够在合适的状态下产生合适的动作，使后续的奖励总和最大。我们称智能体根据环境状态产生动作的方法为策略（Policy）。




强化学习的分类：

- Policy Optimization：

  深度学习模型描述策略本身

- Q-Learning:

  在当前状态下未来能够获得的奖励



  



