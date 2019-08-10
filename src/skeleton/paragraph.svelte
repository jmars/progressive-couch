<script>
  export let height = 0
  export let width = 0
  export let lineHeight

  let padding = lineHeight * 0.5

  let words = []
  let w = 0
  let h = 0
  while (h < height) {
    while (w < width) {
      const word = Math.floor(Math.random() * (+6 - +3)) + +3
      const size = Math.floor(word * (lineHeight / 2))
      words.push(size)
      w += size + 10
      if ((width - w) < (6 * (lineHeight / 2))) {
        break
      }
    }
    h += lineHeight
    w = 0
  }
  words = words
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
    font-size: 0;
    margin-right: 10px;
    display: inline-block;
  }

  .container {
    overflow: hidden;
  }
</style>

<p class="container" style="width:{width}px;height:{height}px">
  <slot></slot>
  {#each words as word}
    <span
      class="skeleton"
      style="min-width:{word}px;height:{lineHeight / 2}px;line-height:{lineHeight}px;margin-bottom:{lineHeight / 2}"
    >M</span>
  {/each}
</p>