import PouchDB from 'pouchdb-browser'
import PList from 'pouchdb-list'
import PRewrite from 'pouchdb-rewrite'
import PShow from 'pouchdb-show'
import PUpdate from 'pouchdb-update'
import PValidate from 'pouchdb-validation'

PouchDB.plugin(PList)
PouchDB.plugin(PRewrite)
PouchDB.plugin(PShow)
PouchDB.plugin(PUpdate)
PouchDB.plugin(PValidate)

const CACHE_NAME = 'foxtrot-cache-v1'

const urlsToCache = [
  'bundle.js',
  'bundle.css'
]

const ldb = new PouchDB('foxtrot')
const rdb = new PouchDB('http://localhost:5984/foxtrot')
ldb.replicate.from(rdb, {
  live: true,
  retry: true
}).on('change', change => {
  console.log('change', change)
  // yo, something changed!
}).on('paused', info => {
  console.log('paused', info)
  // replication was paused, usually because of a lost connection
}).on('active', info => {
  console.log('active', info)
  // replication was resumed
}).on('error', err => {
  console.log('error', err)
  // totally unhandled error (shouldn't happen)
});

self.addEventListener('install', event => {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', event => {
  console.log('fetch')
  const request = event.request
  const url = new URL(request.url)
  if (url.pathname.includes('_show')) {
    const show = url.pathname.split('_show/')[1].split('/')[0]
    event.respondWith(
      ldb.show(`codename-foxtrot/${show}`).then(res => {
        const { body, headers } = res
        return new Response(body, { headers })
      })
    )
    console.log('run show')
    return
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
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName)
        })
      )
    })
  )
})