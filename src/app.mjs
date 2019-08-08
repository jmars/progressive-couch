import { shows } from "./skeleton/index"
import page from 'page'

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