import PouchDB from 'pouchdb-browser'
import PList from 'pouchdb-list'
import PRewrite from 'pouchdb-rewrite'
import PShow from 'pouchdb-show'
import PUpdate from 'pouchdb-update'
import PValidate from 'pouchdb-validation'
import page from 'page'

PouchDB.plugin(PList)
PouchDB.plugin(PRewrite)
PouchDB.plugin(PShow)
PouchDB.plugin(PUpdate)
PouchDB.plugin(PValidate)

const CACHE_NAME = 'foxtrot-cache-v1'

const urlsToCache = [
  'app.js',
  'bundle.css'
]

let ldb
let rdb
const activateDb = () => {
  ldb = new PouchDB('foxtrot')
  rdb = new PouchDB('http://localhost:5984/foxtrot')
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
}

self.addEventListener('install', event => {
  console.log('install')
  activateDb()
  event.waitUntil(
    rdb.get('_design/codename-foxtrot').then(design => {
      const _attachments = Object.keys(design._attachments);
      return caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(_attachments)
      })
    })
  )
})

let handler
page('*/:design/_show/:show/:doc?', (ctx, next) => {
  const { design, show, doc } = ctx.params
  handler = request => ldb.show(`${design}/${show}/${doc}`, {
    headers: {
      'Accept': request.headers.get('Accept')
    }
  }).then(res => {
    const { body, headers } = res
    return new Response(body, { headers })
  })
  next()
})

self.addEventListener('fetch', event => {
  console.log('fetch ')
  if (!ldb) {
    activateDb()
  }
  const request = event.request
  const url = new URL(request.url)
  page(url.pathname)
  if (handler) {
    event.respondWith(handler(request).then(res => {
      handler = null
      return res
    }))
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
  activateDb()
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