import { shows } from "./skeleton/index"
import page from 'page'

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

page('*/:design/_show/:show/:doc?', ctx => {
  const { design, show } = ctx.params
  new shows[show]({
    target: document.body,
    hydrate: true,
    props: {}
  })
})

export default () => {
  page()
}