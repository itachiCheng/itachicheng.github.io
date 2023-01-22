---
title: Docker
date: 2022-01-09 22:55:44
categories:
- Docker
---

- [Download Docker](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
docker 下载地址，点击OK即可，稍等完成下载。
![img.png](docker_install_1.png)
- Enable the WSL 2 feature on Windows

最近工作中接触了docker，开始试着敲了一些docker指令。

`docker images`：列出docker镜像

`docker ps`: 列出当前正在运行的docker容器

`docker cp .../ .../ `：从宿主机或docker容器中拷贝文件到docker容器或宿主机当中

`docker start containerId` ：启动docker容器

`docker attach containerId`：进入docker容器

我想这相当于最基本的查看操作，同时借鉴面向对象中类和实例的关系，对docker的理解停留在抽象层。想钻研其背景，多看总是很好的途径。

<center>卷一</center>

###### Docker versus virtual machines 

`Docker is just cgroups and namespace wrappedd up.` 这句话出自[JUSTIN CORMACK](https://www.docker.com/blog/investing-in-performance-trust-and-great-experiences-for-developers/) ，他认为从docker这九年来发展来看，重要的远不止这些。`docker run -it ubuntu`The time-to-magic is so short, and there is so much you can build on from there.
的确，现在围绕Docker, Kubernetes 和 更加广泛的云原生运动正在展开。

Docker处于现代软件供应链的核心，并且有三个方向值得努力——Performance、Trust and Experience.