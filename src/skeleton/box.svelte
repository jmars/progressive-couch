<script>
  export let height = 0
  export let width = 0

  let styleHeight = height ? `${height}px` : 'auto'
  let styleWidth = width ? `${width}px` : 'auto'
</script>

<style>
  @keyframes pulse {
    0% {
      background-color: gray;
    }
    100% {
      background-color: lightgray;
    }
  }

  .skeleton {
    background-color: gray;
    animation: pulse 2s infinite;
  }
</style>

<div
  class="skeleton"
  style="width:{styleWidth};height:{styleHeight}">
</div>