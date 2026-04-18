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
const GEO_API_URL = process.env.GEO_API_URL || 'http://ip-api.com/json/{ip}?fields=status,countryCode,lat,lon';
const GEO_API_TOKEN = process.env.GEO_API_TOKEN || '';
const GEO_API_RESPONSE_FORMAT = process.env.GEO_API_RESPONSE_FORMAT || 'default';

// 自定义字段映射（支持点号路径，如 geo.countryCodeAlpha2）
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
  let bestCode = 'DEFAULT';

  for (const [code, coord] of Object.entries(nodeCoords)) {
    const d = getDistance(lat, lon, coord.lat, coord.lon);
    if (d < min) {
      min = d;
      bestCode = code;
      const matchedKey = Object.keys(speedtestNodes).find(key =>
        key.includes(code) || speedtestNodes[key].includes(code.toLowerCase())
      );
      if (matchedKey) bestUrl = speedtestNodes[matchedKey];
    }
  }

  console.log(`[Distance] Nearest: ${bestCode}, ${min.toFixed(2)}km`);
  return bestUrl;
}

// 通过路径获取对象属性（支持点号路径）
function getNestedValue(obj, path) {
  if (!path) return undefined;
  if (path.includes('.')) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }
  return obj[path];
}

// 解析不同 API 的响应格式
function parseGeoResponse(data, format) {
  if (format === 'ipinfo') {
    return {
      country: data.country,
      latitude: data.loc ? parseFloat(data.loc.split(',')[0]) : NaN,
      longitude: data.loc ? parseFloat(data.loc.split(',')[1]) : NaN
    };
  }

  const country = getNestedValue(data, GEO_FIELD_MAPPING.country);
  const latitude = parseFloat(getNestedValue(data, GEO_FIELD_MAPPING.latitude));
  const longitude = parseFloat(getNestedValue(data, GEO_FIELD_MAPPING.longitude));

  return { country, latitude, longitude };
}

// 🔧 修复：正确传递客户端 IP 到 API
async function getGeoFromIP(ip) {
  try {
    let apiUrl = GEO_API_URL;
    // 如果 URL 中包含 {ip} 占位符，则替换；否则将 IP 作为查询参数 ?ip= 附加
    if (apiUrl.includes('{ip}')) {
      apiUrl = apiUrl.replace('{ip}', ip);
    } else {
      const separator = apiUrl.includes('?') ? '&' : '?';
      apiUrl = `${apiUrl}${separator}ip=${encodeURIComponent(ip)}`;
    }
    
    const headers = {};
    if (GEO_API_TOKEN) {
      headers['Authorization'] = `Bearer ${GEO_API_TOKEN}`;
    }

    console.log(`[GeoLookup] Querying ${apiUrl} for client IP ${ip}`);
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error('Geo API returned fail');
    }

    const geo = parseGeoResponse(data, GEO_API_RESPONSE_FORMAT);
    console.log(`[GeoLookup] Result: country=${geo.country}, lat=${geo.latitude}, lon=${geo.longitude}`);

    if (geo.country && !isNaN(geo.latitude) && !isNaN(geo.longitude)) {
      return geo;
    }
  } catch (error) {
    console.error(`Geo lookup failed for ${ip}:`, error.message);
  }

  return { country: '', latitude: NaN, longitude: NaN };
}

// 🔧 修复：优先使用 X-Real-IP，然后 X-Forwarded-For
function getClientIP(req) {
  // 1. Nginx 传递的真实 IP
  const realIP = req.headers['x-real-ip'];
  if (realIP) return realIP;
  
  // 2. X-Forwarded-For 第一个
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  
  // 3. Cloudflare
  const cfIP = req.headers['cf-connecting-ip'];
  if (cfIP) return cfIP;
  
  // 4. 直连 IP（过滤 Docker 内部和本地）
  const remoteAddr = req.socket.remoteAddress;
  if (remoteAddr && !remoteAddr.startsWith('::ffff:172.') && !remoteAddr.startsWith('127.') && remoteAddr !== '::1') {
    return remoteAddr;
  }
  
  return null;
}

// 路由：重定向到测速节点（经纬度优先）
app.get('/', async (req, res) => {
  const overrideNode = req.query.node;
  if (overrideNode && speedtestNodes[overrideNode.toUpperCase()]) {
    console.log(`Manual override: ${overrideNode.toUpperCase()}`);
    return res.redirect(speedtestNodes[overrideNode.toUpperCase()]);
  }

  const clientIP = getClientIP(req);
  let geo = { country: '', latitude: NaN, longitude: NaN };

  if (clientIP && !clientIP.startsWith('127.') && clientIP !== '::1') {
    geo = await getGeoFromIP(clientIP);
  } else {
    console.log(`Invalid client IP: ${clientIP}, skipping geo lookup`);
  }

  let targetUrl = DEFAULT_NODE;

  // 🎯 优先使用经纬度匹配
  if (!isNaN(geo.latitude) && !isNaN(geo.longitude) && geo.latitude !== 0 && geo.longitude !== 0) {
    targetUrl = findNearest(geo.latitude, geo.longitude);
    console.log(`✅ Nearest match (priority): ${geo.latitude},${geo.longitude} -> ${targetUrl}`);
  }
  // 备选：国家匹配
  else if (geo.country && speedtestNodes[geo.country]) {
    targetUrl = speedtestNodes[geo.country];
    console.log(`⚠️ Country match (fallback): ${geo.country} -> ${targetUrl}`);
  }
  // 兜底：默认节点
  else {
    console.log(`❌ Fallback to default: ${DEFAULT_NODE}`);
  }

  res.redirect(targetUrl);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    defaultNode: DEFAULT_NODE,
    geoApi: GEO_API_URL.replace(/token=[^&]*/, 'token=***')
  });
});

app.get('/nodes', (req, res) => {
  res.json(speedtestNodes);
});

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
  console.log(`Match priority: Lat/Lon > Country > Default`);
});