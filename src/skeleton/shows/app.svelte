<script>
  import oboe from 'oboe'
  import Box from '../box.svelte'
  import Paragraph from '../paragraph.svelte'

  let app = import("../../components/shows/app.svelte")
</script>

<style>
  .avatar {
    float: left;
    margin-right: 20px;
  }
</style>

{#await app}
  <h1>teeeest</h1>
{:then component}
  <Paragraph width={300} height={200} lineHeight={30}>
    <div class="avatar">
      <Box width={100} height={100} />
    </div>
  </Paragraph>
  <svelte:component name="world" this={component.default}></svelte:component>
{:catch error}
  <pre>Something went wrong {error.message}</pre>
{/await}