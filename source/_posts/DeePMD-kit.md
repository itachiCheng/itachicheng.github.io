---
title: DeePMD-kit
date: 2024-06-19 10:39:35
tags:
cover: deepmd.png
---

### DeePMD-kit

- 给定第一性原理数据，训练深度势能模型
  - VASP
  - CP2K
  - QE
  - ABACUS
  - SIESTA
  - GAUSSIAN
- 将深度势能模型与常用分子动力学引擎结合
  - LAMMPS
  - GROMACS
  - OPENMM

### DP-GEN

- 利用同步学习框架，产生数据集
  - 探索
  - 标注
  - 训练

### dpdata

- 多种软件间坐标文件格式转化



### 实践(参考：[快速开始 DeePMD-kit｜训练甲烷深度势能分子动力学模型](https://bohrium.dp.tech/))

#### 1 数据准备

DeePMD-kit 的训练数据来源于第一性原理计算数据，包含原子类型、模拟晶格、原子坐标、原子力、系统能量和维里量。

<div align="left" style="margin:1.5rem"><img src="workflow.jpg" alt="image-20230116161737203" style="zoom: 25%;"></div>

在 *00.data* 文件夹下仅有 *abacus_md* 文件夹，*abacus_md* 文件夹是通过使用 ABACUS 进行从头算分子动力学 (*ab initio* Molecular Dynamics, AIMD) 获得的。

DeePMD-kit 采用压缩数据格式。所有训练数据应首先转换为此格式，然后可以在 DeePMD-kit 中使用。该数据格式在 DeePMD-kit 手册中有详细解释，可以在[DeePMD-kit Github](http://www.github.com/deepmodeling/deepmd-kit)中找到。

我们提供了一个方便的工具 **dpdata**，可以将由 VASP、CP2K、Gaussian、Quantum-Espresso、ABACUS 和 LAMMPS 产生的数据转换为 DeePMD-kit 的压缩格式。

具有计算数据信息的分子系统的快照(snapshot)称为帧。数据系统包括许多共享相同原子数和原子类型的帧。

例如，分子动力学轨迹可以转换为数据系统，其中每个时间步长对应于系统中的一帧。

接下来，我们使用 dpdata 工具将 *abacus_md* 中的数据随机分成训练和验证数据。

```python
import dpdata 
import numpy as np

# 读入 ABACUS/MD 格式的数据
data = dpdata.LabeledSystem('DeePMD-kit_Tutorial/00.data/abacus_md', fmt = 'abacus/md') 
print('# 数据包含%d帧' % len(data))

# 随机选择40个索引作为验证集数据
index_validation = np.random.choice(201,size=40,replace=False)

# 其他索引作为训练集数据
index_training = list(set(range(201))-set(index_validation))
data_training = data.sub_system(index_training)
data_validation = data.sub_system(index_validation)

# 将所有训练数据放入文件夹"training_data"中
data_training.to_deepmd_npy('DeePMD-kit_Tutorial/00.data/training_data')

# 将所有验证数据放入文件夹"validation_data"中
data_validation.to_deepmd_npy('DeePMD-kit_Tutorial/00.data/validation_data')

print('# 训练数据包含%d帧' % len(data_training)) 
print('# 验证数据包含%d帧' % len(data_validation))
```

可以看到，161个帧被选为训练数据，其他40个帧是验证数据。

让我们再查看一下 00.data 文件夹，其中产生了新的文件，分别是 DeePMD-kit 深度势能训练所需的训练集和验证集。

```shell
! tree DeePMD-kit_Tutorial/00.data/ -L 1
```

```
DeePMD-kit_Tutorial/00.data/
├── abacus_md
├── training_data
└── validation_data
```

```shell
! tree DeePMD-kit_Tutorial/00.data/training_data -L 1
```

```
DeePMD-kit_Tutorial/00.data/training_data
├── set.000
├── type.raw
└── type_map.raw
```

这些文件的作用如下：

1. `set.000`：是一个目录，包含压缩格式的数据（NumPy压缩数组）。
2. `type.raw`：是一个文件，包含原子的类型（以整数表示）。
3. `type_map.raw`：是一个文件，包含原子的类型名称。

让我们来看一下这些文件：

```shell
! cat DeePMD-kit_Tutorial/00.data/training_data/type.raw 
0
0
0
0
1
```

这告诉我们这个例子中有5个原子，其中4个原子由类型"0"表示，1个原子由类型"1"表示。有时需要将整数类型映射到原子名称。映射可以通过文件`type_map.raw`给出。

```python
! cat DeePMD-kit_Tutorial/00.data/training_data/type_map.raw
H
C
```

这告诉我们类型“0”被命名为“H”，类型“1”被命名为“C”。

#### 2 准备输入脚本

训练数据准备完成后，接下来就可以进行训练。DeePMD-kit 需要一个`json`格式的文件来指定训练参数。该文件称为 DeePMD-kit 的输入脚本，让我们进入训练目录看一下该输入脚本：

```shell
! cd DeePMD-kit_Tutorial/01.train/ && cat input.json
```

```json
{
    "_comment": " model parameters",
    "model": {
	"type_map":	["H", "C"],
	"descriptor" :{
	    "type":		"se_e2_a",
	    "sel":		"auto",
	    "rcut_smth":	0.50,
	    "rcut":		6.00,
	    "neuron":		[25, 50, 100],
	    "resnet_dt":	false,
	    "axis_neuron":	16,
	    "seed":		1,
	    "_comment":		" that's all"
	},
	"fitting_net" : {
	    "neuron":		[240, 240, 240],
	    "resnet_dt":	true,
	    "seed":		1,
	    "_comment":		" that's all"
	},
	"_comment":	" that's all"
    },

    "learning_rate" :{
	"type":		"exp",
	"decay_steps":	50,
	"start_lr":	0.001,	
	"stop_lr":	3.51e-8,
	"_comment":	"that's all"
    },

    "loss" :{
	"type":		"ener",
	"start_pref_e":	0.02,
	"limit_pref_e":	1,
	"start_pref_f":	1000,
	"limit_pref_f":	1,
	"start_pref_v":	0,
	"limit_pref_v":	0,
	"_comment":	" that's all"
    },

    "training" : {
	"training_data": {
	    "systems":     ["../00.data/training_data"],
	    "batch_size":  "auto",
	    "_comment":	   "that's all"
	},
	"validation_data":{
	    "systems":	   ["../00.data/validation_data"],
	    "batch_size":  "auto",
	    "numb_btch":   1,
	    "_comment":	   "that's all"
	},
	"numb_steps":	10000,
	"seed":		10,
	"disp_file":	"lcurve.out",
	"disp_freq":	200,
	"save_freq":	1000,
	"_comment":	"that's all"
    },    

    "_comment":		"that's all"
}
```

在模型部分，指定了嵌入和拟合网络的参数。

```json
"model":{
    "type_map":    ["H", "C"],                 
    "descriptor":{
        "type":            "se_e2_a",          
        "rcut":            6.00,               
        "rcut_smth":       0.50,               
        "sel":             "auto",             
        "neuron":          [25, 50, 100],       
        "resnet_dt":       false,
        "axis_neuron":     16,                  
        "seed":            1,
        "_comment":        "that's all"
        },
    "fitting_net":{
        "neuron":          [240, 240, 240],    
        "resnet_dt":       true,
        "seed":            1,
        "_comment":        "that's all"
    },
    "_comment":    "that's all"'
},
```

部分参数的解释如下：

| 参数                     | 解释                          |
| ------------------------ | ----------------------------- |
| type_map                 | 每种原子的名称                |
| descriptor > type        | 描述类型                      |
| descriptor > rcut        | 截断半径                      |
| descriptor > rcut_smth   | 平滑开始的位置                |
| descriptor > sel         | 切割半径内第i种原子的最大数目 |
| descriptor > neuron      | 嵌入神经网络的大小            |
| descriptor > axis_neuron | G矩阵的子矩阵大小(嵌入矩阵)   |
| fitting_net > neuron     | 拟合神经网络的大小            |

使用`se_e2_a`描述符来训练DP模型。`neurons`的参数将描述符和拟合网络的大小分别设置为[25, 50, 100]和[240, 240, 240]。本地环境中的组成部分会在从0.5到6 Å的范围内平滑地趋于零。

以下是指定学习率和损失函数的参数。

```json
    "learning_rate" :{
        "type":                "exp",
        "decay_steps":         50,
        "start_lr":            0.001,    
        "stop_lr":             3.51e-8,
        "_comment":            "that's all"
    },
    "loss" :{
        "type":                "ener",
        "start_pref_e":        0.02,
        "limit_pref_e":        1,
        "start_pref_f":        1000,
        "limit_pref_f":        1,
        "start_pref_v":        0,
        "limit_pref_v":        0,
        "_comment":            "that's all"
    },
```

在损失函数中，`pref_e`从 0.02 逐渐增加到 1，`pref_f`从 1000 逐渐减小到 1，这意味着力项在开始时占主导地位，而能量和压力项在最后变得重要。这种策略非常有效，并减少了总的训练时间。`pref_v`设置为 0，表示训练过程中不包括压力数据。起始学习率、终止学习率和衰减步数分别设置为 0.001、3.51e-8 和 50。模型训练 10000 步。

训练参数如下所示：

```json
    "training" : {
        "training_data": {
            "systems":            ["../00.data/training_data"],     
            "batch_size":         "auto",                       
            "_comment":           "that's all"
        },
        "validation_data":{
            "systems":            ["../00.data/validation_data/"],
            "batch_size":         "auto",               
            "numb_btch":          1,
            "_comment":           "that's all"
        },
        "numb_steps":             10000,                           
        "seed":                   10,
        "disp_file":              "lcurve.out",
        "disp_freq":              200,
        "save_freq":              10000,
        },
```

#### 3 训练模型

准备好训练脚本后，我们可以通过简单地运行 DeePMD-kit 来开始训练。

```shell
# ########## Time Warning: 8 mins 48 secs ##########
! cd DeePMD-kit_Tutorial/01.train/ && dp train input.json
```

```
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/compat/v2_compat.py:107: disable_resource_variables (from tensorflow.python.ops.variable_scope) is deprecated and will be removed in a future version.
Instructions for updating:
non-resource variables are not supported in the long term
WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
WARNING:root:Environment variable KMP_BLOCKTIME is empty. Use the default value 0
WARNING:root:Environment variable KMP_AFFINITY is empty. Use the default value granularity=fine,verbose,compact,1,0
/opt/deepmd-kit-2.2.1/lib/python3.10/importlib/__init__.py:169: UserWarning: The NumPy module was reloaded (imported a second time). This can in some cases result in small but subtle issues and is discouraged.
  _bootstrap._exec(spec, module)
DEEPMD INFO    Calculate neighbor statistics... (add --skip-neighbor-stat to skip this step)
2023-09-25 18:08:39.837014: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: libcuda.so.1: cannot open shared object file: No such file or directory; LD_LIBRARY_PATH: /usr/local/cuda/lib64:/usr/local/nvidia/lib:/usr/local/nvidia/lib64
2023-09-25 18:08:39.837045: W tensorflow/stream_executor/cuda/cuda_driver.cc:269] failed call to cuInit: UNKNOWN ERROR (303)
OMP: Info #155: KMP_AFFINITY: Initial OS proc set respected: 0,1
OMP: Info #216: KMP_AFFINITY: decoding x2APIC ids.
OMP: Info #216: KMP_AFFINITY: cpuid leaf 11 not supported.
OMP: Info #216: KMP_AFFINITY: decoding legacy APIC ids.
OMP: Info #157: KMP_AFFINITY: 2 available OS procs
OMP: Info #158: KMP_AFFINITY: Uniform topology
OMP: Info #287: KMP_AFFINITY: topology layer "LL cache" is equivalent to "socket".
OMP: Info #192: KMP_AFFINITY: 1 socket x 1 core/socket x 2 threads/core (1 total cores)
OMP: Info #218: KMP_AFFINITY: OS proc to physical thread map:
OMP: Info #172: KMP_AFFINITY: OS proc 0 maps to socket 0 core 0 thread 0 
OMP: Info #172: KMP_AFFINITY: OS proc 1 maps to socket 0 core 0 thread 1 
OMP: Info #254: KMP_AFFINITY: pid 99 tid 109 thread 1 bound to OS proc set 1
OMP: Info #254: KMP_AFFINITY: pid 99 tid 111 thread 2 bound to OS proc set 0
OMP: Info #254: KMP_AFFINITY: pid 99 tid 108 thread 3 bound to OS proc set 1
OMP: Info #254: KMP_AFFINITY: pid 99 tid 112 thread 4 bound to OS proc set 0
DEEPMD INFO    training data with min nbor dist: 1.045920568611028
DEEPMD INFO    training data with max nbor size: [4 1]
DEEPMD INFO     _____               _____   __  __  _____           _     _  _   
DEEPMD INFO    |  __ \             |  __ \ |  \/  ||  __ \         | |   (_)| |  
DEEPMD INFO    | |  | |  ___   ___ | |__) || \  / || |  | | ______ | | __ _ | |_ 
DEEPMD INFO    | |  | | / _ \ / _ \|  ___/ | |\/| || |  | ||______|| |/ /| || __|
DEEPMD INFO    | |__| ||  __/|  __/| |     | |  | || |__| |        |   < | || |_ 
DEEPMD INFO    |_____/  \___| \___||_|     |_|  |_||_____/         |_|\_\|_| \__|
DEEPMD INFO    Please read and cite:
DEEPMD INFO    Wang, Zhang, Han and E, Comput.Phys.Comm. 228, 178-184 (2018)
DEEPMD INFO    installed to:         /home/conda/feedstock_root/build_artifacts/deepmd-kit_1678943793317/work/_skbuild/linux-x86_64-3.10/cmake-install
DEEPMD INFO    source :              v2.2.1
DEEPMD INFO    source brach:         HEAD
DEEPMD INFO    source commit:        3ac8c4c7
DEEPMD INFO    source commit at:     2023-03-16 12:33:24 +0800
DEEPMD INFO    build float prec:     double
DEEPMD INFO    build variant:        cuda
DEEPMD INFO    build with tf inc:    /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/include;/opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/../../../../include
DEEPMD INFO    build with tf lib:    
DEEPMD INFO    ---Summary of the training---------------------------------------
DEEPMD INFO    running on:           bohrium-14076-1043333
DEEPMD INFO    computing device:     cpu:0
DEEPMD INFO    CUDA_VISIBLE_DEVICES: unset
DEEPMD INFO    Count of visible GPU: 0
DEEPMD INFO    num_intra_threads:    0
DEEPMD INFO    num_inter_threads:    0
DEEPMD INFO    -----------------------------------------------------------------
DEEPMD INFO    ---Summary of DataSystem: training     -----------------------------------------------
DEEPMD INFO    found 1 system(s):
DEEPMD INFO                                        system  natoms  bch_sz   n_bch   prob  pbc
DEEPMD INFO                      ../00.data/training_data       5       7      23  1.000    T
DEEPMD INFO    --------------------------------------------------------------------------------------
DEEPMD INFO    ---Summary of DataSystem: validation   -----------------------------------------------
DEEPMD INFO    found 1 system(s):
DEEPMD INFO                                        system  natoms  bch_sz   n_bch   prob  pbc
DEEPMD INFO                    ../00.data/validation_data       5       7       5  1.000    T
DEEPMD INFO    --------------------------------------------------------------------------------------
DEEPMD INFO    training without frame parameter
DEEPMD INFO    data stating... (this step may take long time)
OMP: Info #254: KMP_AFFINITY: pid 99 tid 99 thread 0 bound to OS proc set 0
DEEPMD INFO    built lr
DEEPMD INFO    built network
DEEPMD INFO    built training
WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
DEEPMD INFO    initialize model from scratch
DEEPMD INFO    start training at lr 1.00e-03 (== 1.00e-03), decay_step 50, decay_rate 0.950006, final lr will be 3.51e-08
DEEPMD INFO    batch     200 training time 11.42 s, testing time 0.24 s
DEEPMD INFO    batch     400 training time 9.99 s, testing time 0.04 s
DEEPMD INFO    batch     600 training time 9.90 s, testing time 0.04 s
DEEPMD INFO    batch     800 training time 9.90 s, testing time 0.04 s
DEEPMD INFO    batch    1000 training time 9.93 s, testing time 0.04 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    1200 training time 9.91 s, testing time 0.03 s
DEEPMD INFO    batch    1400 training time 9.89 s, testing time 0.04 s
DEEPMD INFO    batch    1600 training time 9.96 s, testing time 0.04 s
DEEPMD INFO    batch    1800 training time 9.88 s, testing time 0.04 s
DEEPMD INFO    batch    2000 training time 9.91 s, testing time 0.03 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    2200 training time 9.89 s, testing time 0.04 s
DEEPMD INFO    batch    2400 training time 9.87 s, testing time 0.04 s
DEEPMD INFO    batch    2600 training time 9.91 s, testing time 0.06 s
DEEPMD INFO    batch    2800 training time 9.93 s, testing time 0.04 s
DEEPMD INFO    batch    3000 training time 9.89 s, testing time 0.03 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    3200 training time 9.89 s, testing time 0.03 s
DEEPMD INFO    batch    3400 training time 9.87 s, testing time 0.03 s
DEEPMD INFO    batch    3600 training time 9.89 s, testing time 0.03 s
DEEPMD INFO    batch    3800 training time 9.89 s, testing time 0.03 s
DEEPMD INFO    batch    4000 training time 9.98 s, testing time 0.04 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    4200 training time 9.88 s, testing time 0.03 s
DEEPMD INFO    batch    4400 training time 9.87 s, testing time 0.03 s
DEEPMD INFO    batch    4600 training time 9.85 s, testing time 0.04 s
DEEPMD INFO    batch    4800 training time 9.88 s, testing time 0.03 s
DEEPMD INFO    batch    5000 training time 9.90 s, testing time 0.04 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    5200 training time 9.91 s, testing time 0.04 s
DEEPMD INFO    batch    5400 training time 9.86 s, testing time 0.03 s
DEEPMD INFO    batch    5600 training time 9.88 s, testing time 0.04 s
DEEPMD INFO    batch    5800 training time 9.87 s, testing time 0.03 s
DEEPMD INFO    batch    6000 training time 9.90 s, testing time 0.03 s
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/training/saver.py:1066: remove_checkpoint (from tensorflow.python.training.checkpoint_management) is deprecated and will be removed in a future version.
Instructions for updating:
Use standard file APIs to delete files with this prefix.
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/training/saver.py:1066: remove_checkpoint (from tensorflow.python.training.checkpoint_management) is deprecated and will be removed in a future version.
Instructions for updating:
Use standard file APIs to delete files with this prefix.
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    6200 training time 9.87 s, testing time 0.03 s
DEEPMD INFO    batch    6400 training time 9.97 s, testing time 0.03 s
DEEPMD INFO    batch    6600 training time 9.85 s, testing time 0.03 s
DEEPMD INFO    batch    6800 training time 9.90 s, testing time 0.04 s
DEEPMD INFO    batch    7000 training time 9.86 s, testing time 0.04 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    7200 training time 9.90 s, testing time 0.04 s
DEEPMD INFO    batch    7400 training time 9.92 s, testing time 0.03 s
DEEPMD INFO    batch    7600 training time 9.91 s, testing time 0.04 s
DEEPMD INFO    batch    7800 training time 9.91 s, testing time 0.04 s
DEEPMD INFO    batch    8000 training time 9.87 s, testing time 0.03 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    8200 training time 9.86 s, testing time 0.04 s
DEEPMD INFO    batch    8400 training time 9.86 s, testing time 0.04 s
DEEPMD INFO    batch    8600 training time 9.93 s, testing time 0.04 s
DEEPMD INFO    batch    8800 training time 9.86 s, testing time 0.04 s
DEEPMD INFO    batch    9000 training time 9.92 s, testing time 0.04 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    9200 training time 9.85 s, testing time 0.04 s
DEEPMD INFO    batch    9400 training time 9.89 s, testing time 0.03 s
DEEPMD INFO    batch    9600 training time 9.84 s, testing time 0.03 s
DEEPMD INFO    batch    9800 training time 9.98 s, testing time 0.04 s
DEEPMD INFO    batch   10000 training time 9.86 s, testing time 0.03 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    average training time: 0.0495 s/batch (exclude first 200 batches)
DEEPMD INFO    finished training
DEEPMD INFO    wall time: 509.976 s
```



屏幕上会显示数据系统的信息，例如：

```
DEEPMD INFO    -----------------------------------------------------------------
DEEPMD INFO    ---Summary of DataSystem: training     ----------------------------------
DEEPMD INFO    found 1 system(s):
DEEPMD INFO                                 system  natoms  bch_sz   n_bch   prob  pbc
DEEPMD INFO               ../00.data/training_data       5       7      23  1.000    T
DEEPMD INFO    -------------------------------------------------------------------------
DEEPMD INFO    ---Summary of DataSystem: validation   ----------------------------------
DEEPMD INFO    found 1 system(s):
DEEPMD INFO                                 system  natoms  bch_sz   n_bch   prob  pbc
DEEPMD INFO             ../00.data/validation_data       5       7       5  1.000    T
DEEPMD INFO    -------------------------------------------------------------------------
```

以及该训练的起始和最终学习率：

```
DEEPMD INFO    start training at lr 1.00e-03 (== 1.00e-03), decay_step 50, decay_rate 0.950006, final lr will be 3.51e-08
```

如果一切正常，您将看到每 200 batch 打印的信息，例如：

```
DEEPMD INFO    batch     200 training time 6.04 s, testing time 0.02 s
DEEPMD INFO    batch     400 training time 4.80 s, testing time 0.02 s
DEEPMD INFO    batch     600 training time 4.80 s, testing time 0.02 s
DEEPMD INFO    batch     800 training time 4.78 s, testing time 0.02 s
DEEPMD INFO    batch    1000 training time 4.77 s, testing time 0.02 s
DEEPMD INFO    saved checkpoint model.ckpt
DEEPMD INFO    batch    1200 training time 4.47 s, testing time 0.02 s
DEEPMD INFO    batch    1400 training time 4.49 s, testing time 0.02 s
DEEPMD INFO    batch    1600 training time 4.45 s, testing time 0.02 s
DEEPMD INFO    batch    1800 training time 4.44 s, testing time 0.02 s
DEEPMD INFO    batch    2000 training time 4.46 s, testing time 0.02 s
DEEPMD INFO    saved checkpoint model.ckpt
```

它们显示了训练和测试时间计数。在每 1000 batch 结束时，模型将保存在 Tensorflow 的 checkpoint 文件 `model.ckpt` 中。

同时，训练和测试误差将在文件`lcurve.out`中呈现。该文件包含 8 列，从左到右依次是：
1. 训练步数
2. 验证损失
3. 训练损失
4. 能量的均方根（RMS）验证误差
5. 能量的 RMS 训练误差
6. 力的 RMS 验证误差
7. 力的 RMS 训练误差
8. 学习率

学习率是机器学习中的一个重要概念。在 DP 模型中，学习率会经历一个 从大到小指数衰减的过程。这样既能保证模型收敛的效率，也能保证模型的精度。因此在学习率的参数中，有起始学习率(start_lr）和结束学习率（end_rate） 两种。在上面的例子中，我们将起始学习率、结束学习率和学习率的衰减步长分别设置为 0.001，3.51e-8，和 50，那么模型学习率会从 0.001 开始，每 50 步降低一点，直到降低到 3.51e-8（或者训练结束）为止。



#### 4 冻结模型

在训练结束时，应该将保存在 TensorFlow 的 `checkpoint` 文件中的模型参数冻结为一个模型文件，通常以扩展名 .pb 结束。只需执行以下命令：

```shell
# # 进入 DeePMD-kit_Tutorial/01.train/ 训练文件夹并冻结模型
! cd DeePMD-kit_Tutorial/01.train/ && dp freeze -o graph.pb
```

```
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/compat/v2_compat.py:107: disable_resource_variables (from tensorflow.python.ops.variable_scope) is deprecated and will be removed in a future version.
Instructions for updating:
non-resource variables are not supported in the long term
WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
WARNING:root:Environment variable KMP_BLOCKTIME is empty. Use the default value 0
WARNING:root:Environment variable KMP_AFFINITY is empty. Use the default value granularity=fine,verbose,compact,1,0
/opt/deepmd-kit-2.2.1/lib/python3.10/importlib/__init__.py:169: UserWarning: The NumPy module was reloaded (imported a second time). This can in some cases result in small but subtle issues and is discouraged.
  _bootstrap._exec(spec, module)
2023-09-25 18:48:11.340773: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: libcuda.so.1: cannot open shared object file: No such file or directory; LD_LIBRARY_PATH: /usr/local/cuda/lib64:/usr/local/nvidia/lib:/usr/local/nvidia/lib64
2023-09-25 18:48:11.340810: W tensorflow/stream_executor/cuda/cuda_driver.cc:269] failed call to cuInit: UNKNOWN ERROR (303)
DEEPMD INFO    The following nodes will be frozen: ['model_type', 'descrpt_attr/rcut', 'descrpt_attr/ntypes', 'model_attr/tmap', 'model_attr/model_type', 'model_attr/model_version', 'train_attr/min_nbor_dist', 'train_attr/training_script', 'o_energy', 'o_force', 'o_virial', 'o_atom_energy', 'o_atom_virial', 'fitting_attr/dfparam', 'fitting_attr/daparam']
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
Instructions for updating:
Use `tf.compat.v1.graph_util.convert_variables_to_constants`
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
Instructions for updating:
Use `tf.compat.v1.graph_util.convert_variables_to_constants`
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
Instructions for updating:
Use `tf.compat.v1.graph_util.extract_sub_graph`
WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
Instructions for updating:
Use `tf.compat.v1.graph_util.extract_sub_graph`
DEEPMD INFO    1211 ops in the final graph.
```

它将在当前目录中输出一个名为 *graph.pb* 的模型文件。

<span style="color:purple; font-weight:bold">到目前为止，我们就获得了一个使用 DeePMD-kit 通过高精度的从头算分子动力学数据获得的深度势能模型：*DeePMD-kit_Tutorial/01.train/graph.pb*</span>



#### 6 测试模型

```shell
! cd DeePMD-kit_Tutorial/01.train/ && dp test -m graph.pb -s ../00.data/validation_data
```

#### 7 使用LAMMPS进行MD计算

```shell
! cd ./DeePMD-kit_Tutorial/02.lmp && lmp -i in.lammps
```

其中`in.lammps`的pair_style将deepmd的输出模型 graph.pb作为输入。


```shell
# gas phase methane

units           metal
boundary        p p p
atom_style      atomic

neighbor        1.0 bin
neigh_modify    every 10 delay 0 check no

read_data       conf.lmp
mass            1 1
mass            2 12

pair_style      deepmd graph.pb
pair_coeff      * *

velocity        all create 50.0 23456789
fix             1 all nvt temp 50.0 50.0 0.5
timestep        0.001

thermo_style    custom step pe ke etotal temp press vol
thermo          100
dump            1 all custom 100 ch4.dump id type x y z

run             5000
```

