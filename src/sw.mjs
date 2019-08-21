import PouchDB from 'pouchdb-browser'
import PList from 'pouchdb-list'
import PRewrite from 'pouchdb-rewrite'
import PShow from 'pouchdb-show'
import PUpdate from 'pouchdb-update'
import PValidate from 'pouchdb-validation'
import page from 'page'

const REVISION = 153

PouchDB.plugin(PList)
PouchDB.plugin(PRewrite)
PouchDB.plugin(PShow)
PouchDB.plugin(PUpdate)
PouchDB.plugin(PValidate)

let ldb
let rdb
let _attachments
const activateDb = () => {
  ldb = new PouchDB('foxtrot')
  rdb = new PouchDB('http://localhost:5984/foxtrot')
  ldb.replicate.from(rdb, {
    live: true,
    retry: true
  }).on('change', change => {
    // yo, something changed!
  }).on('paused', info => {
    // replication was paused, usually because of a lost connection
  }).on('active', info => {
    // replication was resumed
  }).on('error', err => {
    // totally unhandled error (shouldn't happen)
  });
}

self.addEventListener('install', event => {
  console.log('install revision', REVISION)
  activateDb()
  event.waitUntil(
    rdb.get('_design/codename-foxtrot').then(design => {
      const _attachments = Object.keys(design._attachments)
      return (caches.open(design._rev)
        .then(cache => {
          return cache.addAll(_attachments)
        }))
    })
  )
})

let handler
page('*/:design/_show/:show/:doc?', (ctx, next) => {
  const { design, show, doc } = ctx.params
  // TODO: use rdb in cloudflare workers
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
  const request = event.request
  const url = new URL(request.url)
  page(url.pathname)
  if (handler) {
    if (!ldb || !rdb) {
      activateDb()
    }
    event.respondWith(handler(request).then(res => {
      handler = null
      return res
    }))
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
  event.waitUntil(
    rdb.get('_design/codename-foxtrot').then(design => {
      const _rev = design._rev
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== _rev) {
              return caches.delete(cacheName)
            }
          })
        )
      })
    })
  )
})