<script>
	export let ssr;
	export let doc;
	export let query;
</script>

<style>
	h1 {
		color: red;
		font-size: 12px;
	}
</style>

<h1>Hello {ssr ? "server" : "client"}!</h1>
{#if ssr}
	<script>
		const tag = document.currentScript
		System.import("../home.js")
		.then(({ default: Component }) => {
			const { parentElement } = tag
			const component = new Component({
				target: parentElement,
				hydrate: true,
				props: {
					ssr: false,
					doc: JSON.parse(
						parentElement.querySelector('data')
							.getAttribute('data-doc')
					)
				}
			})
		})
	</script>
	<data
		data-doc={JSON.stringify(doc)}
		data-query={JSON.stringify(query)}
	/>
{/if}
