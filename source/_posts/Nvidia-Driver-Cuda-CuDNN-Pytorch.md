---
title: Nvidia-Driver-Cuda-CuDNN-Pytorch
date: 2025-01-09 15:47:43
tags:
---



### 显卡类型

```shell
lspci | grep -i nvidia
################# Tesla A100  ##############
```



### kernel-headers and kernel-devel

```shell
dnf install kernel-headers
dnf install kernel-devel
dnf distro-sync
```



### 运行驱动包

```shell
## 加上kernel-source-path可能无需重启
./NVIDIA_Linux-xxxxxxxxx.run --kernel-source-path /usr/src/kernels/6.10****
```



### `nvidia-smi` Time

```shell
nvidia-smi
+++++++++++++++++++
+ Tesla A100-PCIE +
+++++++++++++++++++
```



### 安装CUDA、CUDNN、minconda、pytorch

```shell
wget https://developer.download.nvidia.com/compute/cuda/12.1.1/local_installers/cuda-repo-rhel7-12-1-local-12.1.1_530.30.02-1.x86_64.rpm --no-check-certificate

wget https://developer.nvidia.com/downloads/compute/cudnn/secure/8.9.7/local_installers/12.x/cudnn-linux-x86_64-8.9.7.29_cuda12-archive.tar.xz --no-check-certificate

cd cudnn-linux-x86_64-8.9.7.29_cuda12-archive/
cp include/cudnn.h /usr/local/cuda/include/
cp lib/libcudnn* /usr/local/cuda/lib64/
# 添加CUDA_HOME

curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
sh Miniconda3-latest-Linux-x86_64.sh
# 添加conda环境变量

conda create -n torch2.4 python=3.12
conda activate torch2.4
pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url https://downloads.pytorch.org/whl/cu121
```



### 磁盘挂载

```shell
fdisk /dev/sdc

mkfs.ext4 /dev/sdc1
mkfs.ext4 /dev/sdc2

mkdir -p /data1 /data2
mount /dev/sdc1 /data1
mount /dev/sdc2 /data2

vim /etc/fstab
# 添加UUID
```

