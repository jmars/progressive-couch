<script>
  import oboe from 'oboe'
  console.log(oboe)
  import("../../components/shows/app.svelte").then(m => {
    console.log('real component', m)
  })
</script>

<h1>test</h1>