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
   
   **Note**: 当前主题fork于**jerryc127/hexo-theme-butterfly.git**，如果需要个性化，那么请修改.gitsubmodules,自行维护个性化主题修改 。
   
3. **hexo server**可以本地拉起**localhost:4000**的博客服务。

### 个性化配置

1. 修改_config.butterfly.yml文件，包含各种封面、图片、组件配置，修改完成后可以通过以下命令推送。

   ```shell
   git add -A
   git commit -m "Your Commit" 
   git push origin srcbuild
   ```

2. 图片素材可以添加至themes/butterfly/source/img/路径下，素材文件可单独推送至hexo-theme-butterfly仓。

   ```shell
   cd themes/butterfly
   git add -A
   git commit -m "Your Commit"
   git push origin dev
   ```

### 生成部署

1. 重新定位至itachi.github.io文件夹

2. 生成网页并推送部署

   ```shell
   hexo clean
   hexo generate && hexo deploy
   ```
