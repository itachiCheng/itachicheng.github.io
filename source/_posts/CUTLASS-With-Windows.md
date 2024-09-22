---
title: CUTLASS-With-Windows
date: 2024-09-14 23:11:57
tags:
---





### 查看GPU设备的计算能力

`C:\Program Files\NVIDIA GPU Computing\Toolkit\CUDA\v12.6\extras\demo_suite\deviceQuery.exe`

```shell
deviceQuery.exe Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

Detected 1 CUDA Capable device(s)

Device 0: "NVIDIA GeForce RTX 2060"
  CUDA Driver Version / Runtime Version          12.6 / 12.6
  CUDA Capability Major/Minor version number:    7.5
  Total amount of global memory:                 6144 MBytes (6442123264 bytes)
  (30) Multiprocessors, ( 64) CUDA Cores/MP:     1920 CUDA Cores
  GPU Max Clock rate:                            1680 MHz (1.68 GHz)
  Memory Clock rate:                             7001 Mhz
  Memory Bus Width:                              192-bit
  L2 Cache Size:                                 3145728 bytes
  Maximum Texture Dimension Size (x,y,z)         1D=(131072), 2D=(131072, 65536), 3D=(16384, 16384, 16384)
  Maximum Layered 1D Texture Size, (num) layers  1D=(32768), 2048 layers
  Maximum Layered 2D Texture Size, (num) layers  2D=(32768, 32768), 2048 layers
  Total amount of constant memory:               zu bytes
  Total amount of shared memory per block:       zu bytes
  Total number of registers available per block: 65536
  Warp size:                                     32
  Maximum number of threads per multiprocessor:  1024
  Maximum number of threads per block:           1024
  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
  Maximum memory pitch:                          zu bytes
  Texture alignment:                             zu bytes
  Concurrent copy and kernel execution:          Yes with 6 copy engine(s)
  Run time limit on kernels:                     Yes
  Integrated GPU sharing Host Memory:            No
  Support host page-locked memory mapping:       Yes
  Alignment requirement for Surfaces:            Yes
  Device has ECC support:                        Disabled
  CUDA Device Driver Mode (TCC or WDDM):         WDDM (Windows Display Driver Model)
  Device supports Unified Addressing (UVA):      Yes
  Device supports Compute Preemption:            Yes
  Supports Cooperative Kernel Launch:            Yes
  Supports MultiDevice Co-op Kernel Launch:      No
  Device PCI Domain ID / Bus ID / location ID:   0 / 1 / 0
  Compute Mode:
     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 12.6, CUDA Runtime Version = 12.6, NumDevs = 1, Device0 = NVIDIA GeForce RTX 2060
Result = PASS
```

### 下载CUTLASS压缩包

地址：https://github.com/NVIDIA/cutlass/archive/refs/tags/v3.5.0.zip

![image-20240914233132449](./CUTLASS-With-Windows.assets/image-20240914233132449.png)

### 解压并新建build文件夹

在build文件夹中，可以通过Cmake生成Visual Studio项目管理文件，如下：

```shell
cmake .. -DCUTLASS_NVCC_ARCHS=75(对应上述CUDA Capability7.5)
```

![image-20240914233811190](./CUTLASS-With-Windows.assets/image-20240914233811190.png)

通过Visual Studio打开build/CUTLASS.sln，我们可以得到对examples所有案例的管理。`本地Windows调试器`->`配置启动项目`，选择`当前选定内容`，之后可以对选中的案例进行单独生成执行。

![image-20240914234246948](./CUTLASS-With-Windows.assets/image-20240914234246948.png)

运行结果如下所示：

![image-20240914234150247](./CUTLASS-With-Windows.assets/image-20240914234150247.png)

