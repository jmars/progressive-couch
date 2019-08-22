import PouchDB from 'pouchdb-browser'
import PList from 'pouchdb-list'
import PRewrite from 'pouchdb-rewrite'
import PShow from 'pouchdb-show'
import PUpdate from 'pouchdb-update'
import PValidate from 'pouchdb-validation'
import page from 'page'

const REVISION = 172

PouchDB.plugin(PList)
PouchDB.plugin(PRewrite)
PouchDB.plugin(PShow)
PouchDB.plugin(PUpdate)
PouchDB.plugin(PValidate)

const replicate = () => {
  const rdb = new PouchDB('http://couchdb.foxtrot:5984/db')
  return new Promise((resolve, reject) => {
    const ldb = new PouchDB('foxtrot')
    ldb.replicate.from(rdb, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  }).then(() => {
    return rdb.get('_design/codename-foxtrot').then(design => {
      const _rev = design._rev
      return caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== _rev) {
              return caches.delete(cacheName)
            }
          })
        )
      })
    })
  })
}

self.addEventListener('install', event => {
  console.log('install revision', REVISION)
  const rdb = new PouchDB('http://couchdb.foxtrot:5984/db')
  event.waitUntil(
    Promise.all([
      replicate(),
      rdb.get('_design/codename-foxtrot').then(design => {
        const _attachments = Object.keys(design._attachments)
          .map(name => `/static/${name}`)
        return (caches.open(design._rev)
          .then(cache => {
            return cache.addAll(_attachments)
          }))
      })
    ])
  )
})

let handler
page('/show/:show/:doc?', (ctx, next) => {
  const ldb = new PouchDB('foxtrot')
  const { design, show, doc } = ctx.params
  handler = request => ldb.show(`codename-foxtrot/${show}/${doc}`, {
    headers: {
      'Accept': request.headers.get('Accept')
    }
  }).then(res => {
    const { body, headers } = res
    return new Response(body, { headers })
  })
  .catch(err => {
    console.error(err)
  })
  next()
})
page('/static/:attachment', (ctx, next) => {
  const { attachment } = ctx.params
  handler = false
  next()
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  page(url.pathname)
  if (handler) {
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
  event.waitUntil(replicate())
})