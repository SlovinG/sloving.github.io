#!/bin/bash

# 遇到错误立即停止
set -e

# 远程 Git 仓库地址
REMOTE_REPO_URL="git@github.com:SlovinG/sloving.github.io.git"

# 远程 Git 仓库分支
REMOTE_BRANCH="master"

# 初始化 Git 仓库（如果尚未初始化）
if [ ! -d ".git" ]; then
  git init
fi

# 检查远程仓库是否已经存在
if ! git remote | grep -q "origin"; then
  # 添加远程仓库
  git remote add origin $REMOTE_REPO_URL
fi

# 拉取远程仓库的最新更改
git pull origin $REMOTE_BRANCH

# 添加所有更改到暂存区
git add .

# 提交更改
git commit -m "Deploy updates from local project folder"

# 推送更改到远程仓库
git push origin $REMOTE_BRANCH

echo "Deployment completed successfully!"