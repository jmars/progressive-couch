import { shows } from "./skeleton/index"
import page from 'page'

page('*/:design/_show/:show/:doc?', ctx => {
  const { design, show } = ctx.params
  new shows[show]({
    target: document.body,
    hydrate: true, // TODO: don't hydrate skeleton over SSR
    props: {}
  })
})

export default () => {
  page()
}