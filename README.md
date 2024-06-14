# itachicheng.github.io

---

### 初始化

1. 安装[Node.js](https://nodejs.org/en)后，通过**npm install hexo-cli -g**嵌入**hexo**。

2. **git clone**本项目**srcbuild**分支，同时下载相关**node_modules**依赖，并通过**npm**下载相应**hexo**插件。

   - git clone本项目srcbuild分支
   
   ```shell
   git clone --recurse-submodules https://github.com/itachiCheng/itachicheng.github.io.git -b srcbuild 
   ```
   
   - 下载相关node_modules依赖
   
   ```shell
   hexo init blog
   ```
   
   - 拷贝blog/node_modules至itachicheng.github.io目录
   
   ```shell
   cp -r blog/node_modules/ itachicheng.github.io/
   ```
   
   - npm下载相应hexo插件
   
   ```shell
   cd ./itachicheng.github.io
   npm install
   npm install --save hexo-renderer-jade hexo-generator-feed hexo-generator-sitemap hexo-browsersync hexo-generator-archive hexo-renderer-pug hexo-renderer-stylus
   ```
   
   - 更新butterfly主题
   
   ```shell
   cd themes/butterfly/
   git fetch origin dev
   git rebase origin/dev
   cd ../../
   ```
   
   Note: 当前主题fork于https://github.com/jerryc127/hexo-theme-butterfly.git，如果需要个性化，那么请修改.gitsubmodules,自行维护个性化主题修改 。
   
3. **hexo server**可以本地拉起**localhost:4000**的博客服务。

