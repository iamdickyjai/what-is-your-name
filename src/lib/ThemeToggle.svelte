<script lang="ts">
	const sunIcon =
		'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41';
	const moonIcon = 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z';

	let isDark = $state(document.documentElement.classList.contains('dark'));

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

{#snippet icon(path: string, isSelected: boolean)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={['relative size-5 transition-colors', isSelected ? 'text-canvas' : 'text-muted']}
	>
		<path d={path} />
	</svg>
{/snippet}

<button
	type="button"
	role="switch"
	aria-checked={isDark}
	aria-label="Dark mode"
	onclick={toggleTheme}
	class="relative grid h-15 w-24 shrink-0 grid-cols-2 place-items-center surface p-1.5"
>
	<span
		class={[
			'absolute inset-y-1.5 right-1/2 left-1.5 rounded-md bg-ink transition-transform',
			isDark && 'translate-x-full'
		]}
	></span>
	{@render icon(sunIcon, !isDark)}
	{@render icon(moonIcon, isDark)}
</button>
