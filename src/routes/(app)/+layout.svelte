<script lang="ts">
	import type { LayoutProps } from './$types';
	import { Button } from '$ui/button';
	import { Sparkles } from '@lucide/svelte';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	const isHome = $derived(page.url.pathname === '/');
</script>

<div class="relative min-h-screen">
	<!-- Decorative background -->
	<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/4 blur-3xl"></div>
		<div class="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-purple-500/3 blur-3xl"></div>
		<div
			class="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/3 blur-3xl"
		></div>
	</div>

	<!-- Top nav bar -->
	<header class="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
		<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-12 xl:px-24">
			<a href="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-80">
				<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
					<Sparkles class="h-3.5 w-3.5 text-primary" />
				</div>
				<span
					class="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-sm font-bold tracking-tight text-transparent"
				>
					Unergy Basics
				</span>
			</a>

			{#if !isHome}
				<Button variant="ghost" size="sm" href="/" class="text-xs text-muted-foreground">
					← Volver al inicio
				</Button>
			{/if}
		</div>
	</header>

	<!-- Page content -->
	<main class="mx-auto w-full max-w-6xl px-4 pt-10 pb-24 md:px-12 md:pb-12 xl:px-24">
		{@render children()}
	</main>
</div>
