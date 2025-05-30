---
title: Ascend
date: 2025-05-29 23:40:00
tags:
---



### Host与Device

- Host指与Device相连的X86服务器、ARM服务器，会利用Device提供的NN（Neural Network）计算能力完成任务
- Device模块指安装了昇腾AI处理器的硬件设备，利用PCIe接口与Host侧连接，提供NN计算能力

### 核函数

核函数（Kernel Function）是Ascend C算子device侧的入口。Ascend C允许用户使用核函数这种C/C++

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





