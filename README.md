# itachicheng.github.io

---

### T1 初始化

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

### T2 个性化配置

1. 修改_config.butterfly.yml文件，包含各种封面、图片、组件配置。

2. 通过`hexo new "My New Post"`可以生成Markdown文件以及资料文件夹，资料编辑完成后，可以通过以下方式提交。

   ```shell
   git add -A
   git commit -m "Your Commit" 
   git push origin srcbuild
   ```

3. 图片素材可以添加至themes/butterfly/source/img/路径下，素材文件可单独推送至hexo-theme-butterfly仓。

   ```shell
   cd themes/butterfly
   git add -A
   git commit -m "Your Commit"
   git push origin dev
   ```

### T3 生成部署

1. 重新定位至itachi.github.io文件夹

2. 生成网页并推送部署

   ```shell
   hexo clean
   hexo generate && hexo deploy
   ```
   

### T4 分布式协作

1. 拉取最新分支

   ```shell
   # 配置代理（可选）
   git config --global http.proxy http://127.0.0.1:xxxx
   git config --global https.proxy http://127.0.0.1:xxxx
   
   (如本地有未提交更新)
   git stash save as YOUR_NAME
   
   git fetch or git -c http.proxy="127.0.0.1:xxxx" fetch origin
   git rebase origin/srcbuild
   
   (如本地有暂存更新，可能面临解决冲突)
   git stash pop
   
   ```

2. commit提交（同T2.2）