<script>
	import Rehydrate from "../../components/Rehydrate.svelte"

	export let ssr
	export let doc
	export let query
</script>

<style>
	h1 {
		color: red;
		font-size: 12px;
	}
</style>

<h1>Hello {ssr ? "server" : "client"}!</h1>
<a href="/show/profile">
	<p>Other page</p>
</a>
<Rehydrate {ssr} path="/static/home.js" />