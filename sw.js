// sw.js - Service Worker para Inventario Pro PWA

const CACHE_NAME = 'inventario-pro-v7-cache-v1';

// Lista de archivos que la app necesita para funcionar offline
// IMPORTANTE: Si cambias la estructura de carpetas, actualiza estas rutas.
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './js/app.js',
    './js/state.js',
    './js/ui.js',
    './js/files.js',
    './js/logic.js',
    './logo.png', // Asegúrate de que el logo exista
    
    // Librerías Externas (CDNs) - Las cacheamos para que funcionen sin internet
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://unpkg.com/html5-qrcode',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js'
];

// 1. Instalación: Cacheamos los archivos estáticos
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Cacheando archivos de la app');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Fuerza al SW a activarse de inmediato
});

// 2. Activación: Limpiamos cachés viejas (útil cuando actualices la versión)
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activado');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Borrando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Toma control de las pestañas abiertas
});

// 3. Intercepción de red (Fetch): Estrategia "Cache First, then Network"
self.addEventListener('fetch', (event) => {
    // Solo interceptamos peticiones GET (ignoramos POST, PUT, etc.)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si está en caché, lo devolvemos (velocidad máxima / offline)
            if (cachedResponse) {
                return cachedResponse;
            }

            // Si no está en caché, lo pedimos a la red
            return fetch(event.request).then((networkResponse) => {
                // Validamos que la respuesta sea válida
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                return networkResponse;
            }).catch(() => {
                // Si falla la red y no está en caché, no hacemos nada (o podríamos mostrar una página de error offline)
                console.log('[Service Worker] Fallo de red y no hay caché para:', event.request.url);
            });
        })
    );
});