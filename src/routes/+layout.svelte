<script>
	import { fade } from 'svelte/transition';
	import '../app.postcss';
	import Header from './Header.svelte';
	import './styles.css';
	import { darkTheme } from '$lib/stores/store';

	$: dark = $darkTheme;
</script>

<div class:dark class="app bg-white dark:bg-neutral-900">
	<Header />

	<main in:fade={{ duration: 200 }}>
		<slot />
	</main>

	<footer>
		<p class="text-gray-400">
			Vous pouvez aussi requêter notre <a href="/api/graphql">API Graphql</a>
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
