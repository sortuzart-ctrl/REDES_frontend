// Service Worker para modo offline avanzado
const CACHE_NAME = 'bitacora-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './reporte.html',
  './styles/style.css',
  './scripts/main.js',
  './iconos/consolidado.png',
  './iconos/guardar.png',
  './assets/logo-izquierdo.png',
  './assets/logo-derecho.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando recursos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error('[Service Worker] Error al cachear:', error);
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia de red primero, luego cache
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes que no son GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar solicitudes de chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si obtenemos una respuesta válida, actualizamos el cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos obtener del cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si es una navegación y no está en cache, retornar página offline
          if (event.request.mode === 'navigate') {
            return caches.match('./reporte.html');
          }
          
          // Para otros recursos, retornar respuesta vacía
          return new Response('Recurso no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sincronización en segundo plano:', event.tag);
  
  if (event.tag === 'sync-informes') {
    event.waitUntil(sincronizarInformes());
  }
  
  if (event.tag === 'sync-cola-pendientes') {
    event.waitUntil(procesarColaPendientes());
  }
});

// Función para sincronizar informes (puede expandirse con API backend)
async function sincronizarInformes() {
  console.log('[Service Worker] Sincronizando informes...');
  
  try {
    // Obtener datos pendientes de sincronización
    const cache = await caches.open(CACHE_NAME);
    const colaSyncResponse = await cache.match('/sync-queue');
    
    if (colaSyncResponse) {
      const colaPendiente = await colaSyncResponse.json();
      
      if (colaPendiente && colaPendiente.length > 0) {
        console.log(`[Service Worker] ${colaPendiente.length} elementos en cola para sincronizar`);
        
        // Procesar cada elemento de la cola
        for (const item of colaPendiente) {
          try {
            await enviarDatosAlServidor(item);
            console.log('[Service Worker] ✅ Item sincronizado:', item.id);
          } catch (error) {
            console.error('[Service Worker] ❌ Error al sincronizar item:', item.id, error);
            throw error; // Reintentar en la próxima sincronización
          }
        }
        
        // Limpiar cola después de sincronización exitosa
        await cache.delete('/sync-queue');
        
        // Notificar al cliente
        const allClients = await self.clients.matchAll();
        allClients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            success: true,
            count: colaPendiente.length
          });
        });
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Error en sincronización:', error);
    return Promise.reject(error);
  }
}

// Procesar cola de operaciones pendientes
async function procesarColaPendientes() {
  console.log('[Service Worker] Procesando cola de operaciones pendientes...');
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/pending-operations');
    
    if (response) {
      const operaciones = await response.json();
      
      for (const op of operaciones) {
        console.log('[Service Worker] Procesando operación:', op.type);
        
        switch (op.type) {
          case 'GUARDAR_INFORME':
            await procesarGuardarInforme(op.data);
            break;
          case 'ACTUALIZAR_INFORME':
            await procesarActualizarInforme(op.data);
            break;
          case 'ELIMINAR_INFORME':
            await procesarEliminarInforme(op.data);
            break;
        }
      }
      
      // Limpiar operaciones procesadas
      await cache.delete('/pending-operations');
      
      // Notificar éxito
      const allClients = await self.clients.matchAll();
      allClients.forEach(client => {
        client.postMessage({
          type: 'OPERATIONS_SYNCED',
          count: operaciones.length
        });
      });
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Error procesando cola:', error);
    return Promise.reject(error);
  }
}

// Funciones auxiliares para procesar operaciones
async function procesarGuardarInforme(data) {
  // Simulación - aquí iría la llamada real a la API
  console.log('[Service Worker] Guardando informe:', data.nombre);
  return Promise.resolve();
}

async function procesarActualizarInforme(data) {
  console.log('[Service Worker] Actualizando informe:', data.id);
  return Promise.resolve();
}

async function procesarEliminarInforme(data) {
  console.log('[Service Worker] Eliminando informe:', data.id);
  return Promise.resolve();
}

// Enviar datos al servidor (preparado para backend real)
async function enviarDatosAlServidor(item) {
  // Simulación de envío - reemplazar con fetch real cuando haya backend
  console.log('[Service Worker] Enviando al servidor:', item);
  
  // Ejemplo de cómo sería con backend real:
  /*
  const response = await fetch('https://tu-api.com/api/informes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item.data)
  });
  
  if (!response.ok) {
    throw new Error('Error al enviar datos');
  }
  
  return await response.json();
  */
  
  // Por ahora solo simulamos éxito
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 100);
  });
}

// Manejo de notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recibido');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: './iconos/consolidado.png',
    badge: './iconos/guardar.png',
    vibrate: [200, 100, 200],
    tag: 'bitacora-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('Bitácora ROV', options)
  );
});

// Manejo de clic en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificación clickeada');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});

// Mensajes desde el cliente
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Mensaje recibido:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data.action === 'getCacheStatus') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.keys();
      }).then((keys) => {
        event.ports[0].postMessage({ 
          cached: keys.length,
          total: ASSETS_TO_CACHE.length
        });
      })
    );
  }
});
