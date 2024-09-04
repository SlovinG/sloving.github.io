# 强制推送
# 忽略错误
set -e

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:SlovinG/sloving.github.io.git master
