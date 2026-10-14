// 原「期货入门知识库」的 Service Worker 随站点改版下线。
// 仅保留最小清理脚本：注销自身并清空旧缓存，避免老访客继续看到缓存里的旧页面。
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
  })());
});
