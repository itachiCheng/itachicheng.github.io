---
title: Ascend
date: 2025-05-29 23:40:00
tags:
---



### Host与Device

- Host指与Device相连的X86服务器、ARM服务器，会利用Device提供的NN（Neural Network）计算能力完成任务
- Device模块指安装了昇腾AI处理器的硬件设备，利用PCIe接口与Host侧连接，提供NN计算能力

### 核函数

核函数（Kernel Function）是Ascend C算子device侧的入口。Ascend C允许用户使用核函数这种C/C++的语法扩展来运行device代码。用户在核函数中实现算子逻辑的编写，例如自定义算子类及其成员函数以实现该算子的所有功能。

**核函数**是直接在device侧执行的代码。在核函数中，需要为在一个核上执行的代码规定要进行的**数据访问**和**计算操作**，SPMD编程模型允许核函数调用时，多个核并行地执行同一个计算任务。

核函数是host侧和device侧连接的桥梁。

```C++
Ascend C __global__ __aicore__ void kernel_name(argument list);
CUDA __global__ void kernel_name(argument list);
```

### DaVinci Core



### AI Core的逻辑架构抽象



### AI Core内部并行计算架构抽象

- 计算单元

  Scalar计算单元：执行地址计算、循环控制等标量计算工作，并把向量计算、矩阵计算、数据搬运、同步指令发射给对应单元执行

  Cube计算单元：负责执行矩阵计算

  Vector计算单元：负责执行向量计算
  
  AI Core内异步计算过程（指令流）：

  ```mermaid
  graph TB
  标量计算单元:读取指令序列 --> 标量计算单元:发射指令到对应单元 --> 各处理单元:并行执行指令:数据搬运,向量计算,矩阵计算
  
  ```

- 搬运单元

  负责在Global Memory和Local Memory之间搬运数据

  MTE1——数据在AI Core内部的流转

  MTE2——数据搬入单元

  MTE3——数据搬出单元

  AI Core内部搬运过程（数据流）：

  ```mermaid
  graph TB
  DMA:数据搬入LocalMem --> 计算单元:数据完成计算,回写LocalMem --> DMA:数据搬出到GlobalMem
  
  ```

- 存储单元

  编程对象，数据主体

  外部存储：Global Memory

  ```C++
  void Init(__gm__ uint8 *__restrict__ src_gm, __gm__ uint8_t *__restrict__ dst_gm)
  {
    uint32_t dataSize = 256;
    GlobalTensor<int32_t> inputGlobal;// 类型为int32_t
    // 设置源操作数在Global Memory上的起始地址为src_gm,所占外部存储的大小为256个int32_t
    inputGlobal.SetGlobalBuffer(reinterpret_cast<__gm__ int32_t *>(src_gm), dataSize);
    
  }
  ```

  内部存储：Local Memory 

  ```C++
  template <typename T> class LocalTensor {
    T GetValue(const uint32_t offset) const; // 获取LocalTensor中的某个值，返回T类型的立即数。
    // 获取距原LocalTensor起始地址偏移量为offset的新LocalTensor，注意offset不能超过原有LocalTensor的size大小。offset单位为element
    LocalTensor operator[](const uint32_t offset) const;
    uint32_t GetSize() const; // 获取当前LocalTensor size大小
  }
  ```

  LocalTensor指代的是AI Core内部的存储，不同的流水任务之间存在数据依赖，需要进行数据传递。Ascend C中使用Queue队列完成任务之间的数据通信和同步，例如在Compute之前完成CopyIn的数据搬运。
### 逻辑位置

  | TPosition | 具体含义                                                     |
  | --------- | ------------------------------------------------------------ |
  | GM        | Global Memory，对应AI Core的外部存储                         |
  | VECIN     | 用于向量计算，搬入数据的存放位置，在数据搬入Vector计算单元时使用此位置 |
  | VECOUT    | 用于向量计算，搬出数据的存放位置，在将Vector计算单元结果搬出时使用此位置 |
  | A1        | 用于矩阵计算，存放整块A矩阵，可类比CPU多级缓存中的二级缓存   |
  | B1        | 用于矩阵计算，存放整块B矩阵，可类比CPU多级缓存中的二级缓存   |
  | A2        | 用于矩阵计算，存放切分后的小块A矩阵，可类比CPU多级缓存中的一级缓存 |
  | B2        | 用于矩阵计算，存放切分后的小块B矩阵，可类比CPU多级缓存中的一级缓存 |
  | CO1       | 用于矩阵计算，存放小块结果C矩阵，可理解为Cube Out            |
  | CO2       | 用于矩阵计算，存放整块结果C矩阵，可理解为Cube Out            |

 

### 开发流程

算子分析：分析算子的数学表达式、输入、输出以及计算逻辑的实现，明确需要调用的Ascend C接口。

- 明确算子的数学表达式及计算逻辑

  Add算子的数学表达式：$$z = x + y$$，计算逻辑：输入数据需要先搬入到片上存储，然后使用计算接口完成两个加法运算，得到最终结果，再搬出到外部存储

- 明确输入和输出
  
  Add算子有两个输入：$x$ 与 $$y$$ ，输出为$$z$$。输入数据类型为half，输出数据类型与输入数据类型相同。输入支持固定shape（8，2048），输出shape与输入shape相同。输入数据排布类型为ND。
  
- 确定核函数名称和参数

  自定义核函数名，如add_custom。

- 确定算子实现所需接口

  DataCopy实现

  Add双目实现

  使用到LocalTensor，使用Queue队列管理，会使用到EnQue，DeQue接口。

核函数定义：定义Ascend C算子入口函数

根据编程范式实现算子类：完成核函数的内部实现

### 编程范式

Ascend C编程范式把算子内部的处理程序，分成多个流水任务（Stage），以张量（Tensor）为数据载体，以队列（Queue）进行任务之间的通信同步，以内存管理模块（Pipe）管理任务间的通信内存。

### SPMD模型  

Ascend C算子编程是SPMD的编程，将需要处理的数据拆分并分布在多个计算核心上运行

多个AI Core共享相同的指令代码，每个核上的运行实例唯一的区别是block_idx不同

block的类似于进程，block_idx就是标识进程唯一性的进程ID，编程中使用函数GetBlockIdx()获取ID

###   流水任务

单核处理程序中主程序调度的并行任务。在核函数内部，可以通过流水任务实现数据的并行处理来提升性能。

### 矢量编程流水任务设计

矢量算子编程范式把算子的实现分为3个基本任务：CopyIn，Compute，CopyOut。

CopyIn，Compute任务间通过VECIN队列inQueueX，inQueueY进行通信和同步，Compute，CopyOut任务间通过VECOUT队列outQueueZ进行通信和同步。















### 开发环境

- 非昇腾AI设备

  代码开发、编译等不依赖昇腾设备的开发环境

- 昇腾AI设备

  支持代码开发和编译，同时可以运行应用程序或进行训练脚本的迁移、开发&调试

### 运行环境

- 昇腾AI设备

  支持代码开发和编译，同时可以运行应用程序或进行训练脚本的迁移、开发&调试

### CANN相关安装包解读

`Ascend-cann-toolkit_8.0.RC2.alpha002_linux_aarch64.run`其中，`Ascend`和`cann`是固定前缀，`toolkit`代表套件软件包，很多在特定场景下的工具包有单独的命名，如`Ascend-cann-nnrt_8.0.RC2.alpha002_linux_aarch64.run`，`nnrt`代表推理引擎，其他`nnae`、`kernels`代表深度学习引擎软件包和算子二进制安装包。
