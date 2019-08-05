import Hello from "./components/App.svelte"

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

const app = new Hello({
  target: document.body,
  hydrate: true,
  props: {
    name: 'client'
  }
})

export default app