---
title: Self-Attention-for-Memory-Efficiency
date: 2024-09-21 15:54:11
tags:
---



传统Attention的计算方式可以用以下方式简单表达：

$$
s_i = dot(q, k_i),\hspace{5ex} s_i^{'} = \frac{e^{s_i}}{\sum_{j}{e^{s_j}}},\hspace{5ex}attention(q, k, v) = \sum_{i}{v_{i}s_i^{'}}.
$$



其中，$q\in{R^d}$是一个d维的向量，$keys$和$values$分别是d维向量组成的序列，例如，$k_1,...,k_n$和$v_1,...,v_n$,序列长度为$n$，可以对Attention的计算进行可视化：

![image-20240922234546414](./Self-Attention-for-Memory-Efficiency.assets/image-20240922234546414.png)
![image-20240922234612296](./Self-Attention-for-Memory-Efficiency.assets/image-20240922234612296.png)

在求解attention（Q， K，V）的整个过程中，如果将d视为常数，那么空间复杂度为O（n）。实际上，n这个维度可以看成时间延展，通过时间换空间，可以仅在（1，d）的size上做累加计算得到atten。而对应的**Self-Attention**，尽管query另一维度也可以拓展到n维，但实现的空间复杂度也不需要$O(n^2)$。这也是Flash-Attention的基本思想。

![image-20240923001802231](./Self-Attention-for-Memory-Efficiency.assets/image-20240923001802231.png)

![image-20240923001916003](./Self-Attention-for-Memory-Efficiency.assets/image-20240923001916003.png)

合理利用HBM以及SRAM的存储可以使attention变得内存高效，其中在K,V维度的切分，形成外层循环，Q维度的切分，形成内层循环。

#### Evoformer_Attention中的类似优化

按大小为B的块逐步计算输出， 只需要将最终结果除以softmax中所有系数的总和，伪代码描述如下：

```python
s_prime = torch.zeros([num_queries, B])
O = torch.zeros([num_queries, head_size_v])
for i in range(0, K.shape[0], B):
    si = exp((Q . K[i * B:(i+1) * B].t) * scale)
    sum_coefs += attn_unscaled.sum(-1)
    O += si . V[i * B:(i+1) * B]
O = O / s_prime
```

出于数值稳定性的原因， 我们还在进行指数运算之前减去迄今为止的最大值（`mi`）。 当我们遇到新的键时，用于计算O的最大值（`m_prime`） 可能与当前最大值不同，所以我们在累积之前更新O。

```python
O = O * exp(m_prime - mi)
m_prime = mi
```

实现细节：

- `si` 在两次连续的GEMM（通用矩阵乘法）之间存储在共享内存中
- 如果我们可以（`head_size_v <= 128`），我们直接在寄存器中存储并累积输出 否则，我们将其存储在全局内存中（较慢）
- 块在批处理维度、头数和查询序列大小上并行化
- 对bias也进行内层循环中的即时广播



#### 核心代码标识

##### kernel_forward.h

```C++
static void CUTLASS_DEVICE attention_kernel(Params& p)
    {
        // In this block, we will only ever:
        // - read query[query_start:query_end, :]
        // - write to output[query_start:query_end, :]
		
    	// 对中间变量应用共享内存
        extern __shared__ char smem_buffer[];
        SharedStorage& shared_storage = *((SharedStorage*)smem_buffer);
        auto& m_prime = shared_storage.m_prime;
        auto& s_prime = shared_storage.s_prime;
        auto& mi = shared_storage.mi;
        const uint32_t query_start = blockIdx.x * kQueriesPerBlock;
		...
        // 对key、value进行切分
        for (int32_t iter_key_start = 0; iter_key_start < p.num_keys;
             iter_key_start += kKeysPerBlock) {
            
			...
                
            // 如果需要对bias计算，则进行即时广播
            if (kSupportsBias) {
				...
            }

         	...
            // query的block切分
            for (int blockN = 0; blockN < nBlockN; ++blockN) {
                ...
                }
            }
            __syncthreads();  // we modify `m_prime` after
        }

		...
        }

        // 7. Calculate logsumexp
        // To make the backward easier, we pad logsumexp with `inf`
        // this avoids a few bound checks, and is not more expensive during fwd
        static_assert(kQueriesPerBlock < kNumWarpsPerBlock * kWarpSize, "");
        if (p.logsumexp_ptr && thread_id() < kQueriesPerBlock) {
            auto lse_dim = ceil_div((int32_t)p.num_queries, kAlignLSE) * kAlignLSE;
            if (thread_id() < p.num_queries) {
                p.logsumexp_ptr[thread_id()] =
                    accum_t(mi[thread_id()]) + cutlass::fast_log(accum_t(s_prime[thread_id()]));
            } else if (thread_id() < lse_dim) {
                p.logsumexp_ptr[thread_id()] =
                    cutlass::platform::numeric_limits<accum_t>::infinity();
            }
        }
    }
```

