import '../node_modules/systemjs/dist/s.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log(registration.scope)
    })
    .catch(err => {
      console.log(err)
    })
  })
}

System.import('/static/app.js')
.then(({ default: main }) => {
  main()
})