const express = require('express');
const app = express();

// ================== CDN77 / Datapacket 全量测速节点 ==================
const speedtestNodes = {
  // 亚太
  'SG': 'https://sgp.download.datapacket.com/10000mb.bin',
  'JP': 'https://tyo.download.datapacket.com/10000mb.bin',
  'HK': 'https://hkg.download.datapacket.com/10000mb.bin',
  'KR': 'https://sel.download.datapacket.com/10000mb.bin',
  'MY': 'https://kul.download.datapacket.com/10000mb.bin',
  'AU': 'https://syd.download.datapacket.com/10000mb.bin',
  'NZ': 'https://akl.download.datapacket.com/10000mb.bin',
  'AU-MEL': 'https://mel.download.datapacket.com/10000mb.bin',

  // 美洲
  'US-SJC': 'https://sjc.download.datapacket.com/10000mb.bin',
  'US-LAX': 'https://lax.download.datapacket.com/10000mb.bin',
  'US-SEA': 'https://sea.download.datapacket.com/10000mb.bin',
  'US-DEN': 'https://den.download.datapacket.com/10000mb.bin',
  'US-DAL': 'https://dal.download.datapacket.com/10000mb.bin',
  'US-HOU': 'https://hou.download.datapacket.com/10000mb.bin',
  'US-CHI': 'https://chi.download.datapacket.com/10000mb.bin',
  'US-ATL': 'https://atl.download.datapacket.com/10000mb.bin',
  'US-BOS': 'https://bos.download.datapacket.com/10000mb.bin',
  'US-NYC': 'https://nyc.download.datapacket.com/10000mb.bin',
  'US-ASH': 'https://ash.download.datapacket.com/10000mb.bin',
  'US-MIA': 'https://mia.download.datapacket.com/10000mb.bin',
  'CA-YVR': 'https://van.download.datapacket.com/10000mb.bin',
  'CA-YUL': 'https://mtl.download.datapacket.com/10000mb.bin',
  'CA-YYZ': 'https://tor.download.datapacket.com/10000mb.bin',
  'BR': 'https://mca.download.datapacket.com/10000mb.bin',

  // 欧洲
  'NL': 'https://ams.download.datapacket.com/10000mb.bin',
  'GR': 'https://ath.download.datapacket.com/10000mb.bin',
  'DE': 'https://fra.download.datapacket.com/10000mb.bin',
  'FR': 'https://cdg.download.datapacket.com/10000mb.bin',
  'SK': 'https://bts.download.datapacket.com/10000mb.bin',
  'BE': 'https://bru.download.datapacket.com/10000mb.bin',
  'RO': 'https://buh.download.datapacket.com/10000mb.bin',
  'HU': 'https://bud.download.datapacket.com/10000mb.bin',
  'DK': 'https://cph.download.datapacket.com/10000mb.bin',
  'IE': 'https://dub.download.datapacket.com/10000mb.bin',
  'UA': 'https://iev.download.datapacket.com/10000mb.bin',
  'PT': 'https://lis.download.datapacket.com/10000mb.bin',
  'GB': 'https://lhr.download.datapacket.com/10000mb.bin',
  'IT': 'https://mil.download.datapacket.com/10000mb.bin',
  'NO': 'https://osl.download.datapacket.com/10000mb.bin',
  'CZ': 'https://prg.download.datapacket.com/10000mb.bin',
  'BG': 'https://sof.download.datapacket.com/10000mb.bin',
  'SE': 'https://sto.download.datapacket.com/10000mb.bin',
  'AT': 'https://vie.download.datapacket.com/10000mb.bin',
  'PL': 'https://waw.download.datapacket.com/10000mb.bin',
  'HR': 'https://zag.download.datapacket.com/10000mb.bin',
  'CH': 'https://zrh.download.datapacket.com/10000mb.bin',
  'ES': 'https://mad.download.datapacket.com/10000mb.bin',

  // 中东 / 非洲
  'AE': 'https://fjr.download.datapacket.com/10000mb.bin',
  'TR': 'https://ist.download.datapacket.com/10000mb.bin',
  'ZA': 'https://jnb.download.datapacket.com/10000mb.bin',
  'NG': 'https://los.download.datapacket.com/10000mb.bin',
  'IL': 'https://tlv.download.datapacket.com/10000mb.bin',
};

const DEFAULT_NODE = process.env.DEFAULT_NODE || 'https://sgp.download.datapacket.com/10000mb.bin';

// ================== 地理位置 API 配置 ==================
// 支持自定义 API，通过环境变量配置
// GEO_API_URL: API 地址，支持 {ip} 占位符
// GEO_API_RESPONSE_PATH: 响应中提取数据的路径（可选）
//
// 默认使用 ip-api.com
// 示例1 - ip-api.com (默认):
//   GEO_API_URL=http://ip-api.com/json/{ip}?fields=status,countryCode,lat,lon
//
// 示例2 - ipinfo.io (需要 token):
//   GEO_API_URL=https://ipinfo.io/{ip}/geo
//   GEO_API_TOKEN=your_token
//
// 示例3 - 自定义 API 返回格式:
//   GEO_API_URL=https://your-api.com/geo/{ip}
//   需要返回包含 country, lat, lon 字段的 JSON

const GEO_API_URL = process.env.GEO_API_URL || 'http://ip-api.com/json/{ip}?fields=status,countryCode,lat,lon';
const GEO_API_TOKEN = process.env.GEO_API_TOKEN || '';
const GEO_API_RESPONSE_FORMAT = process.env.GEO_API_RESPONSE_FORMAT || 'default'; // default, ipinfo, custom

// 自定义字段映射（如果 API 返回的字段名不同）
const GEO_FIELD_MAPPING = {
  country: process.env.GEO_FIELD_COUNTRY || 'countryCode',
  latitude: process.env.GEO_FIELD_LAT || 'lat',
  longitude: process.env.GEO_FIELD_LON || 'lon'
};

// 节点坐标
const nodeCoords = {
  SIN: { lat: 1.29, lon: 103.85 },
  TYO: { lat: 35.68, lon: 139.69 },
  HKG: { lat: 22.32, lon: 114.17 },
  SEL: { lat: 37.56, lon: 126.97 },
  KUL: { lat: 3.14, lon: 101.69 },
  SYD: { lat: -33.86, lon: 151.21 },
  AKL: { lat: -36.85, lon: 174.76 },
  MEL: { lat: -37.81, lon: 144.96 },
  SJC: { lat: 37.33, lon: -121.89 },
  LAX: { lat: 34.05, lon: -118.24 },
  SEA: { lat: 47.61, lon: -122.33 },
  DEN: { lat: 39.74, lon: -104.99 },
  DAL: { lat: 32.78, lon: -96.80 },
  HOU: { lat: 29.76, lon: -95.37 },
  CHI: { lat: 41.88, lon: -87.63 },
  ATL: { lat: 33.75, lon: -84.39 },
  BOS: { lat: 42.36, lon: -71.06 },
  NYC: { lat: 40.71, lon: -74.01 },
  ASH: { lat: 38.78, lon: -77.14 },
  MIA: { lat: 25.76, lon: -80.19 },
  VAN: { lat: 49.28, lon: -123.12 },
  MTL: { lat: 45.50, lon: -73.57 },
  TOR: { lat: 43.65, lon: -79.38 },
  MCA: { lat: -23.55, lon: -46.63 },
  FRA: { lat: 50.11, lon: 8.68 },
  AMS: { lat: 52.37, lon: 4.90 },
  LHR: { lat: 51.50, lon: -0.12 },
  CDG: { lat: 49.00, lon: 2.55 },
  MAD: { lat: 40.41, lon: -3.70 },
  FJR: { lat: 25.12, lon: 56.33 },
  IST: { lat: 41.01, lon: 28.97 },
  JNB: { lat: -26.20, lon: 28.04 },
  LOS: { lat: 6.52, lon: 3.37 },
  TLV: { lat: 32.08, lon: 34.78 },
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function findNearest(lat, lon) {
  let min = Infinity;
  let bestUrl = DEFAULT_NODE;
  for (const [code, coord] of Object.entries(nodeCoords)) {
    const d = getDistance(lat, lon, coord.lat, coord.lon);
    if (d < min) {
      min = d;
      const matchedKey = Object.keys(speedtestNodes).find(key =>
        key.includes(code) || speedtestNodes[key].includes(code.toLowerCase())
      );
      if (matchedKey) bestUrl = speedtestNodes[matchedKey];
    }
  }
  return bestUrl;
}

// 解析不同 API 的响应格式
function parseGeoResponse(data, format) {
  if (format === 'ipinfo') {
    // ipinfo.io 格式
    return {
      country: data.country,
      latitude: data.loc ? parseFloat(data.loc.split(',')[0]) : NaN,
      longitude: data.loc ? parseFloat(data.loc.split(',')[1]) : NaN
    };
  }
  
  // 默认格式（ip-api.com 或自定义映射）
  const country = data[GEO_FIELD_MAPPING.country];
  const latitude = parseFloat(data[GEO_FIELD_MAPPING.latitude]);
  const longitude = parseFloat(data[GEO_FIELD_MAPPING.longitude]);
  
  return { country, latitude, longitude };
}

async function getGeoFromIP(ip) {
  try {
    // 替换 URL 中的 {ip} 占位符
    let apiUrl = GEO_API_URL.replace('{ip}', ip);
    
    // 构建请求头
    const headers = {};
    if (GEO_API_TOKEN) {
      headers['Authorization'] = `Bearer ${GEO_API_TOKEN}`;
    }
    
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();
    
    // 检查 ip-api.com 的 status 字段
    if (data.status === 'fail') {
      throw new Error('Geo API returned fail');
    }
    
    const geo = parseGeoResponse(data, GEO_API_RESPONSE_FORMAT);
    
    if (geo.country && !isNaN(geo.latitude) && !isNaN(geo.longitude)) {
      return geo;
    }
  } catch (error) {
    console.error(`Geo lookup failed for ${ip}:`, error.message);
  }
  
  return { country: '', latitude: NaN, longitude: NaN };
}

function getClientIP(req) {
  // 支持 X-Forwarded-For（代理/负载均衡场景）
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();

  // 支持 CloudFlare
  const cfIP = req.headers['cf-connecting-ip'];
  if (cfIP) return cfIP;

  // 回退到直接连接 IP
  return req.socket.remoteAddress;
}

// 路由：重定向到测速节点
app.get('/', async (req, res) => {
  // 手动指定节点
  const overrideNode = req.query.node;
  if (overrideNode && speedtestNodes[overrideNode.toUpperCase()]) {
    console.log(`Manual override: ${overrideNode.toUpperCase()}`);
    return res.redirect(speedtestNodes[overrideNode.toUpperCase()]);
  }

  // 获取客户端 IP
  const clientIP = getClientIP(req);
  let geo = { country: '', latitude: NaN, longitude: NaN };

  // 查询地理位置（跳过本地 IP）
  if (clientIP && !clientIP.startsWith('127.') && clientIP !== '::1') {
    geo = await getGeoFromIP(clientIP);
  }

  let targetUrl = DEFAULT_NODE;

  // 优先国家匹配
  if (geo.country && speedtestNodes[geo.country]) {
    targetUrl = speedtestNodes[geo.country];
    console.log(`Country match: ${geo.country} -> ${targetUrl}`);
  }
  // 最近节点匹配
  else if (!isNaN(geo.latitude) && !isNaN(geo.longitude)) {
    targetUrl = findNearest(geo.latitude, geo.longitude);
    console.log(`Nearest match: ${geo.latitude},${geo.longitude} -> ${targetUrl}`);
  }
  else {
    console.log(`Fallback to default: ${DEFAULT_NODE}`);
  }

  res.redirect(targetUrl);
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    defaultNode: DEFAULT_NODE,
    geoApi: GEO_API_URL.replace(/token=[^&]*/, 'token=***') // 隐藏 token
  });
});

// 节点列表 API
app.get('/nodes', (req, res) => {
  res.json(speedtestNodes);
});

// 调试端点：查看当前请求的 IP 和地理位置
app.get('/debug', async (req, res) => {
  const clientIP = getClientIP(req);
  const geo = await getGeoFromIP(clientIP);
  res.json({
    clientIP,
    geo,
    defaultNode: DEFAULT_NODE,
    geoApiConfigured: GEO_API_URL,
    headers: req.headers
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SpeedTest Proxy running on port ${PORT}`);
  console.log(`Default node: ${DEFAULT_NODE}`);
  console.log(`Geo API: ${GEO_API_URL.replace(/token=[^&]*/, 'token=***')}`);
});