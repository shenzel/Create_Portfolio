# Node.js 22 LTS Alpineをベースイメージとして使用
FROM node:22-alpine

RUN apk add --no-cache git

# 作業ディレクトリを設定
WORKDIR /workspace

# package.json, tsconfig.json 等をコピーし、所有者をnodeに変更
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./

# .next ディレクトリを明示的に作成し、所有者をnodeユーザーにする
# これにより、next_cache_volume が空でマウントされる際に、このディレクトリの状態が
# ボリュームにコピーされることを期待します。
RUN mkdir -p /workspace/.next && \
    chown -R node:node /workspace/.next

# /workspace ディレクトリ全体の所有者も念のためnodeユーザーにしておく
# (以前npm installが通った時の設定に近い形)
RUN chown -R node:node /workspace

# nodeユーザーに切り替え
USER node

# 依存関係をインストール
RUN npm install --save-dev ts-node-dev@1.1.8
RUN npm install gray-matter remark remark-html

# Next.jsが使用するポート
EXPOSE 3000