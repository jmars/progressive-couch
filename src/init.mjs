import '../node_modules/systemjs/dist/s.js'

const _attachments = window.location.href.split('/').slice(0, -1).join('/')

System.import('./app.js', _attachments)
.then(({ default: main }) => {
  main()
})