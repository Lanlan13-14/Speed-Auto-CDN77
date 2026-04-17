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
- 🔌 **自定义 API**：支持更换地理位置服务

---

## 🚀 快速开始

### 🐳 Docker

```bash
docker pull ghcr.io/lanlan13-14/speedtest-proxy:latest
```

```bash
docker run -d \
  -p 3000:3000 \
  --name speedtest-proxy \
  ghcr.io/lanlan13-14/speedtest-proxy:latest
```

---

📦 Docker Compose

```yaml
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

```bash
curl -L http://localhost:3000/
```

手动指定节点

```bash
# 新加坡
curl -L http://localhost:3000/?node=SG

# 洛杉矶
curl -L http://localhost:3000/?node=US-LAX

# 法兰克福
curl -L http://localhost:3000/?node=DE
```

---

🔌 API 端点

路径 方法 说明
/ GET 自动选择节点并重定向
/?node=CODE GET 手动指定节点
/health GET 健康检查
/nodes GET 节点列表
/debug GET IP + 地理信息

---

📡 节点示例

```bash
curl http://localhost:3000/nodes
```

```json
{
  "SG": "https://sgp.download.datapacket.com/10000mb.bin",
  "JP": "https://tyo.download.datapacket.com/10000mb.bin",
  "US-LAX": "https://lax.download.datapacket.com/10000mb.bin"
}
```

---

⚙️ 环境变量

基础配置

变量 说明 默认值
PORT 服务端口 3000
DEFAULT_NODE 默认测速节点（无法匹配时使用） https://sgp.download.datapacket.com/10000mb.bin

地理位置 API 配置（可选）

默认使用 ip-api.com，无需配置。如需更换为自定义 API，可设置以下变量：

变量 说明 默认值
GEO_API_URL API 地址，支持 {ip} 占位符 http://ip-api.com/json/{ip}?fields=status,countryCode,lat,lon
GEO_API_TOKEN API 认证 Token（如需要） 空
GEO_API_RESPONSE_FORMAT 响应格式：default 或 ipinfo default
GEO_FIELD_COUNTRY 响应中国家字段名 countryCode
GEO_FIELD_LAT 响应中纬度字段名 lat
GEO_FIELD_LON 响应中经度字段名 lon

自定义 API 配置示例

示例 1：ip-api.com（默认，无需配置）

```yaml
# 不需要设置任何环境变量，自动使用
```

示例 2：ipinfo.io

```yaml
environment:
  - GEO_API_URL=https://ipinfo.io/{ip}/geo
  - GEO_API_TOKEN=your_token_here
  - GEO_API_RESPONSE_FORMAT=ipinfo
```

示例 3：自定义 API（返回嵌套结构）

如果你的 API 返回如下格式：

```json
{
  "ip": "1.1.1.1",
  "geo": {
    "countryCodeAlpha2": "XX",
    "latitude": xx.xxx,
    "longitude": xx.xxx
  }
}
```

配置如下：

```yaml
environment:
  - GEO_API_URL=https://your-api.com/ip/{ip}
  - GEO_API_RESPONSE_FORMAT=default
  - GEO_FIELD_COUNTRY=countryCodeAlpha2
  - GEO_FIELD_LAT=latitude
  - GEO_FIELD_LON=longitude
```

示例 4：带认证 Header 的 API

```yaml
environment:
  - GEO_API_URL=https://your-api.com/geo/{ip}
  - GEO_API_TOKEN=your_bearer_token
  - GEO_FIELD_COUNTRY=country
  - GEO_FIELD_LAT=lat
  - GEO_FIELD_LON=lng
```

---

📊 工作原理

```
用户请求 → 获取 IP → 查询地理位置 → 匹配节点 → 302 重定向
```

优先级：

1. 国家代码匹配
2. 最近距离计算
3. 默认节点兜底

---

🛠️ 项目结构

```
Speed-Auto-CDN77/
├── .github/workflows/     # GitHub Actions 自动构建
├── Dockerfile             # Docker 镜像配置
├── server.js              # 主程序
├── package.json           # 依赖配置
├── .dockerignore          # Docker 忽略文件
├── .gitignore             # Git 忽略文件
└── README.md              # 项目文档
```

---

📦 镜像地址

```
ghcr.io/lanlan13-14/speedtest-proxy:latest
```

---