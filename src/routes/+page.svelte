<script lang="ts">
	import ThemeToggle from '#lib/ThemeToggle.svelte';
	import Fuse from 'fuse.js';
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state('');
	let scrollY = $state(0);
	let headerHeight = $state(0);

	const fuse = $derived(new Fuse(data.translations, { keys: ['english'], threshold: 0.3 }));
	const results = $derived.by(() => {
		const term = query.trim();
		return term ? fuse.search(term).map((result) => result.item) : data.translations;
	});

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const titleFadeDistance = $derived(headerHeight / 2);
	const titleOpacity = $derived(
		titleFadeDistance ? Math.max(0, 1 - scrollY / titleFadeDistance) : 1
	);
	const isSearchBarPinned = $derived(scrollY >= headerHeight);

	function scrollToFirstResult() {
		if (isSearchBarPinned) window.scrollTo({ top: headerHeight });
	}
</script>

<svelte:head>
	<title>What is your name?</title>
</svelte:head>

<svelte:window bind:scrollY />

<main class="mx-auto max-w-xl px-4">
	<header
		bind:clientHeight={headerHeight}
		class="flex h-[calc(50svh-var(--spacing-search-bar)/2)] items-end justify-center"
	>
		<h1 style:opacity={titleOpacity} class="text-4xl font-semibold tracking-tight">
			What is your name?
		</h1>
	</header>

	<div class="sticky top-0 z-10 flex h-search-bar items-center gap-3 bg-canvas">
		<input
			type="search"
			bind:value={query}
			oninput={scrollToFirstResult}
			placeholder="Type an English name"
			aria-label="English name"
			autocomplete="off"
			spellcheck="false"
			class="h-15 min-w-0 flex-1 surface px-5 text-lg placeholder:text-muted focus:border-muted focus:ring-muted"
			{@attach (input: HTMLInputElement) => input.focus()}
		/>
		<ThemeToggle />
	</div>

	<div class="min-h-[calc(100lvh-var(--spacing-search-bar))] pb-16">
		{#if results.length}
			<ul class="divide-y divide-line">
				{#each results as entry (entry)}
					<li
						class="flex items-center justify-between gap-6 py-4"
						in:fade={{ duration }}
						animate:flip={{ duration }}
					>
						<span class="text-lg">{entry.english}</span>
						<span lang="zh-HK" class="flex flex-wrap justify-end gap-2 text-2xl">
							{#each entry.cantonese as translation, i (i)}
								<span class="surface px-3 py-1">{translation}</span>
							{/each}
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="py-10 text-center text-muted">No match</p>
		{/if}
	</div>
</main>
