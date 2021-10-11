#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Laurence-042/silly-butt-helper.git master:gh-pages

cd -