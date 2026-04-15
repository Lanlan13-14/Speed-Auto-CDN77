# 多阶段构建 - 优化版
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --only=production

# 最终镜像
FROM node:18-alpine

WORKDIR /app

# 复制 node_modules 和源码
COPY --from=builder /app/node_modules ./node_modules
COPY server.js .

# 使用非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>r.ok?process.exit(0):process.exit(1))"

CMD ["node", "server.js"]