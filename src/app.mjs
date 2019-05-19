import Hello from "./components/Hello.svelte"

const app = new Hello({
  target: document.body,
  hydrate: true,
  props: {
    name: 'client'
  }
})

export default app