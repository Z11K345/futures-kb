// 期货入门知识库 - Service Worker
// 网络优先：联网时始终取最新版；断网或网络被拦时回落本地缓存，保证打得开
// 首次成功打开后即建立缓存，之后离线也可用（与 futures-tool 同机制）
const CACHE_NAME = 'kb-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(['./']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy));
      return res;
    }).catch(() =>
      caches.match(req).then(m => m || caches.match('./') || caches.match('index.html'))
    )
  );
});
