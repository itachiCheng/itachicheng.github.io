---
title: Jupyter-Config
date: 2025-02-11 10:42:55
tags:
---
jupyter notebook --generate-config
vim /root/.jupyter//jupyter_notebook_config.py
nohup jupyter notebook --allow-root &

c.ServerApp.ip = '***.**.**.***'
c.ServerApp.notebook_dir = '/home/ccc/'
c.ServerApp.password_required = True
c.ServerApp.port = 7003

wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
sh Miniconda3-latest-Linux-x86_64.sh
conda init

conda create -n torch python=3.10
pip install numpy torch pandas jupyter

