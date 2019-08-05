import PouchDB from 'pouchdb-browser'

const CACHE_NAME = 'foxtrot-cache-v1'

const urlsToCache = [
  '_show/app',
  'bundle.js',
  'bundle.css'
]

self.addEventListener('install', event => {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', event => {
  const request = event.request
  console.log(request.method)
  console.log(request.url)
  const entries = request.headers.entries();
  let next = entries.next()
  while (!next.done) {
    const [key, value] = next.value
    console.log(key, value)
    next = entries.next()
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

self.addEventListener('activate', event => {
  console.log('activate')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log(cacheNames)
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName)
        })
      )
    })
  )
})