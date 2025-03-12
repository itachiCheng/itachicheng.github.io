---
title: JAX
date: 2025-01-11 17:47:16
tags:
---



### JAX Background

- High Performance Array Computing
- NumPy on steriods
- Compile and Parallelize code, no matter whether it is deep learning code or, say, ocean simulation weather forecasting

### JAX Highlight

- A new approach to self-supervised learning called BYOL (Bootstrap Your Own Latent; https://arxiv.org/abs/2006.07733)
- A general transformer-based architecture for structured inputs and outputs called Perceiver IO (https://mng.bz/OZ02)
- Research on large language models (LLMs), with the 280-billion-parameters Gopher model (https://mng.bz/Y7Be) and the 70-billion-parameters Chinchilla (https://mng.bz/r1yg)



### Composable-Function-Transformations of JAX

- **Differentiation:** Gradient-based optimisation is fundamental to ML. JAX natively supports both forward and reverse mode [automatic differentiation](https://jax.readthedocs.io/en/latest/notebooks/autodiff_cookbook.html) of arbitrary numerical functions, via function transformations such as grad, hessian, jacfwd and jacrev.
- **Vectorisation:** In ML research we often apply a single function to lots of data, e.g. calculating the loss across a batch or [evaluating per-example gradients](https://arxiv.org/abs/2010.09063) for differentially private learning. JAX provides automatic vectorisation via the vmap transformation that simplifies this form of programming. For example, researchers don't need to reason about batching when implementing new algorithms. JAX also supports large scale data parallelism via the related pmap transformation, elegantly distributing data that is too large for the memory of a single accelerator.
- **JIT-compilation:** [XLA](https://www.tensorflow.org/xla) is used to just-in-time (JIT)-compile and execute JAX programs on GPU and [Cloud TPU](https://cloud.google.com/tpu) accelerators. JIT-compilation, together with JAX's NumPy-consistent API, allows researchers with no previous experience in high-performance computing to easily scale to one or many accelerators.

