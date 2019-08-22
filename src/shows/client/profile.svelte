<script>
	import Rehydrate from "../../components/Rehydrate.svelte"

	export let ssr
	export let doc
	export let query
</script>

<style>
	h1 {
		color: blue;
		font-size: 12px;
	}
</style>

<h1>I am another page :)</h1>
<a href="/">
  <p>Home page</p>
</a>
<Rehydrate {ssr} path="/static/profile.js" />