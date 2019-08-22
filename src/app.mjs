import page from 'page'
import oboe from "oboe"

page('/', '/show/home')
page('/show/:show/:doc?', ctx => {
  const { design, show, doc } = ctx.params
  const o = oboe({
    url: show,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .on('node', (node, path) => {
    console.log(node, path)
  })
  System.import(`/static/${show}.js`)
    .then(({ default: Component }) => {
      const app = new Component({
        target: document.body,
        hydrate: true,
        props: {
          doc: null
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