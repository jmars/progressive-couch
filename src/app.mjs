import Hello from "./components/App.svelte"
import page from 'page'

const Components = {
  Hello
}

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
  fetch(ctx.path, {
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Accept-Encoding': 'identity'
    }
  }).then(res => {
    return res.json()
  })
  .then(({doc, component}) => {
    new Components[component]({
      target: document.body,
      hydrate: true,
      props: {
        name: 'client'
      }
    })
  })
})

page()

export default () => {}