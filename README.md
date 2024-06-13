# itachicheng.github.io

---

### 初始化

1. 安装[Node.js](https://nodejs.org/en)后，通过**npm install hexo-cli -g**嵌入**hexo**。

2. **git clone**本项目**srcbuild**分支，同时下载相关**node_modules**依赖，并通过**npm**下载相应**hexo**插件。

   ```shell
   ## git clone本项目srcbuild分支
   git clone https://github.com/itachiCheng/itachicheng.github.io.git -b srcbuild 
   ## 下载相关node_modules依赖
   hexo init blog
   ## 拷贝blog/node_modules至itachicheng.github.io目录
   cp -r blog/node_modules/ itachicheng.github.io/
   ## npm下载相应hexo插件
   cd ./itachicheng.github.io
   npm install
   npm install --save hexo-renderer-jade hexo-generator-feed hexo-generator-sitemap hexo-browsersync hexo-generator-archive hexo-renderer-pug hexo-renderer-stylus
   ## 选用butterfly主题
   git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
   ```
   
3. **hexo server**可以本地拉起**localhost:4000**的博客服务。



