
# 🚀 Speed-Auto-CDN77

基于 Datapacket / CDN77 测速节点的 **智能重定向代理服务**。  
根据用户地理位置自动选择最优测速节点，提升测速准确性与体验。

---

## ✨ 特性

- 🌍 **智能路由**：基于 IP 自动匹配最佳节点  
- 🎯 **国家级匹配**：支持 50+ 国家/地区精准选择  
- 📍 **距离优化**：经纬度计算最近节点  
- 🔧 **手动指定**：支持 `?node=` 强制节点  
- 🐳 **Docker 支持**：一键部署  
- 🚀 **轻量高效**：Node.js + Express，镜像约 100MB  
- 📊 **可观测性**：内置 `/health`、`/debug`  

---

## 🚀 快速开始

### 🐳 Docker

```bash
docker pull ghcr.io/lanlan13-14/speedtest-proxy:latest
```
```
docker run -d \
  -p 3000:3000 \
  --name speedtest-proxy \
  ghcr.io/lanlan13-14/speedtest-proxy:latest
```

---

📦 Docker Compose
```
services:
  speedtest-proxy:
    image: ghcr.io/lanlan13-14/speedtest-proxy:latest
    ports:
      - '3000:3000'
    environment:
      - PORT=3000
      - DEFAULT_NODE=https://sgp.download.datapacket.com/10000mb.bin
    restart: unless-stopped
```

---

📖 使用说明

基础用法

curl -L http://localhost:3000/


---

手动指定节点

# 新加坡
curl -L http://localhost:3000/?node=SG

# 洛杉矶
curl -L http://localhost:3000/?node=US-LAX

# 法兰克福
curl -L http://localhost:3000/?node=DE


---

🔌 API 端点

路径	方法	说明

/	GET	自动选择节点并重定向
/?node=CODE	GET	手动指定节点
/health	GET	健康检查
/nodes	GET	节点列表
/debug	GET	IP + 地理信息



---

📡 节点示例

curl http://localhost:3000/nodes

{
  "SG": "https://sgp.download.datapacket.com/10000mb.bin",
  "JP": "https://tyo.download.datapacket.com/10000mb.bin",
  "US-LAX": "https://lax.download.datapacket.com/10000mb.bin"
}

常用节点：

SG  JP  HK  US-LAX  US-NYC  DE  GB  NL


---

⚙️ 环境变量

变量	说明	默认值

PORT	服务端口	3000
DEFAULT_NODE	默认测速节点	sgp 节点



---

📊 工作原理

用户请求 → 获取 IP → 查询地理位置 → 匹配节点 → 302 重定向

优先级：

1. 国家代码匹配


2. 最近距离计算


3. 默认节点兜底




---

🛠️ 项目结构
```
Speed-Auto-CDN77/
├── .github/workflows/
├── Dockerfile
├── server.js
├── package.json
├── .dockerignore
├── .gitignore
└── README.md
```

---

📦 镜像
```
ghcr.io/lanlan13-14/speedtest-proxy:latest

```
---
