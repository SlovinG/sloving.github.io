#!/bin/bash

# 创建索引文件
echo "---" > index.md
echo "hidden: true" >> index.md
echo "readingTime: false" >> index.md
echo "date: false" >> index.md
echo "author: false" >> index.md
echo "recommend: false" >> index.md
echo "---" >> index.md
echo "" >> index.md
echo "# 生活随笔" >> index.md

# 初始化列表
entries=()

# 遍历当前目录下的所有 .md 文件
for file in *.md; do
    # 跳过索引文件本身
    if [[ "$file" == "index.md" ]]; then
        continue
    fi
    
    # 从文件中提取 title 和 date 字段，并去除可能的新行符和额外的空格
    title=$(grep '^title: ' "$file" | awk -F': ' '{gsub(/\r|\n/, "", $2); print $2}')
    date=$(grep '^date: ' "$file" | awk -F': ' '{gsub(/\r|\n/, "", $2); print $2}')

    # 构建条目字符串
    entry="$date $title ./$(basename "$file")"
    entries+=("$entry")
done

# 按照日期降序排序条目
IFS=$'\n' sorted_entries=($(sort -r <<<"${entries[*]}"))

# 当前年份变量
current_year=""

# 将排序后的内容写入索引文件，按年份分组
for entry in "${sorted_entries[@]}"; do
    # 获取年份
    year=$(echo "$entry" | cut -d '-' -f 1)
    # 获取月日和标题
    month_day_title=$(echo "$entry" | cut -d ' ' -f 1,2 --output-delimiter=' ' | cut -d '-' -f 2,3)
    # 获取文件路径
    path=$(echo "$entry" | cut -d ' ' -f 3-)
    
    # 检查是否更换年份
    if [[ "$year" != "$current_year" ]]; then
        echo "" >> index.md
        echo "## $year" >> index.md
        current_year="$year"
    fi
    
    # 输出条目
    echo "- [$month_day_title]($path)" >> index.md
done
