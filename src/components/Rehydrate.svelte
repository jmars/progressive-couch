<script>
  export let ssr
  export let path
</script>

{#if ssr}
	<script data-path={path}>
    const tag = document.currentScript
		System.import(tag.getAttribute('data-path'))
		.then(({ default: Component }) => {
			const { parentElement } = tag
			const component = new Component({
				target: parentElement,
				hydrate: true,
				props: {
					ssr: false
				}
			})
		})
	</script>
{/if}