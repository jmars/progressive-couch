import '../node_modules/systemjs/dist/s.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
    .then(registration => {
      console.log(registration.scope)
    })
    .catch(err => {
      console.log(err)
    })
  })
}

const _attachments = window.location.href.split('/').slice(0, -1).join('/')

System.import('./app.js', _attachments)
.then(({ default: main }) => {
  main()
})