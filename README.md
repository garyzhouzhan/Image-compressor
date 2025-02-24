# 图片压缩工具

这是一个简单易用的在线图片压缩工具，具有苹果风格的界面设计。

## 功能特点

- 支持上传PNG、JPG格式图片
- 可预览原图和压缩后的图片
- 显示压缩前后文件大小
- 支持自定义压缩比例
- 可下载压缩后的图片
- 响应式设计，支持各种设备

## 技术实现

- 使用HTML5原生图片处理API
- 使用Canvas进行图片压缩
- 纯前端实现，无需后端服务
- 采用Flex布局实现响应式设计

## Vercel部署指南

### 1. 准备工作
- 注册 GitHub 账号：https://github.com/signup
- 注册 Vercel 账号：https://vercel.com/signup (建议使用GitHub账号登录)

### 2. 创建GitHub仓库
1. 登录GitHub，点击右上角的 "+" 按钮，选择 "New repository"
2. 填写仓库名称，如 "image-compressor"
3. 选择 "Public" 公开仓库
4. 点击 "Create repository"

### 3. 上传代码到GitHub
在本地项目目录中执行以下命令：

bash
初始化Git仓库
git init
添加所有文件到暂存区
git add .
提交代码
git commit -m "初始化图片压缩工具"
添加远程仓库
git remote add origin https://github.com/你的用户名/image-compressor.git
推送代码到GitHub
git push -u origin main
# 强制推送
git push -f origin main


### 4. Vercel部署步骤
1. 使用GitHub账号登录 Vercel：https://vercel.com/login
2. 点击 "New Project" 按钮
3. 在 "Import Git Repository" 页面找到你的 image-compressor 仓库
4. 点击 "Import" 导入项目
5. 在配置页面保持默认设置：
   - Framework Preset: 选择 "Other"
   - Root Directory: ./
   - Build and Output Settings: 保持默认
6. 点击 "Deploy" 按钮开始部署

### 5. 部署完成
- 部署成功后，Vercel 会自动生成一个域名，形如 `https://image-compressor-xxx.vercel.app`
- 你可以在项目设置中添加自定义域名

### 6. 更新网站
- 后续修改代码后，只需要推送到GitHub，Vercel会自动重新部署：





我在执行这行命令的时候 git push -f origin main  ，报错error: failed to push some refs to 'https://github.com/garyzhouzhan/Image-compressor'请排查
