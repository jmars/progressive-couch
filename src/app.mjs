import page from 'page'
import oboe from "oboe"

page('*/:design/_show/:show/:doc?', ctx => {
  const { design, show, doc } = ctx.params
  const stream = !doc ? null : oboe(doc)
  System.import(`../${show}`)
    .then(({ default: Component }) => {
      const app = new Component({
        target: document.body,
        hydrate: true,
        props: {
          doc: stream
        }
      })
    })
})

export default () => {
  console.log('starting')
  page({
    dispatch: false
  })
}