<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$ui/card';
	import { Badge } from '$ui/badge';
	import { NotebookPen, Monitor, ArrowRight, Sparkles } from '@lucide/svelte';

	let { data }: PageProps = $props();

	const apps = [
		{
			href: '/bitacora',
			icon: NotebookPen,
			title: 'Bitácora de Visitas',
			description:
				'Genera bitácoras estructuradas de visitas a terrenos usando texto o voz con ayuda de IA.',
			badge: 'IA',
			gradient: 'from-violet-500/10 via-purple-500/5 to-transparent'
		},
		{
			href: '/escritorios',
			icon: Monitor,
			title: 'Asignación de Escritorios',
			description:
				'Gestiona equipos, personas y escritorios de oficina. Genera horarios semanales optimizados.',
			badge: 'Nuevo',
			gradient: 'from-fuchsia-500/10 via-purple-500/5 to-transparent'
		}
	];
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-10">
	<!-- Hero Section -->
	<div class="relative flex flex-col gap-3">
		<div
			class="pointer-events-none absolute -top-12 -left-12 h-48 w-48 rounded-full bg-primary/8 blur-3xl"
		></div>
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
				<Sparkles class="h-5 w-5 text-primary" />
			</div>
			<h1
				class="bg-gradient-to-r from-primary via-purple-500 to-fuchsia-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent"
			>
				Unergy Basics
			</h1>
		</div>
		<p class="max-w-lg text-muted-foreground">
			Colección de mini-apps y pruebas de concepto para productividad empresarial.
		</p>
	</div>

	<!-- App Cards Grid -->
	<div class="grid gap-5 sm:grid-cols-2">
		{#each apps as app}
			<a href={app.href} class="group">
				<Card.Root
					class="relative h-full overflow-hidden border-border/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-br {app.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
					<Card.Header class="relative">
						<div class="mb-3 flex items-center justify-between">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15"
							>
								<app.icon class="h-5 w-5 text-primary" />
							</div>
							<Badge
								variant="secondary"
								class="text-xs font-medium text-primary/80"
							>
								{app.badge}
							</Badge>
						</div>
						<Card.Title class="text-lg">{app.title}</Card.Title>
						<Card.Description class="text-sm leading-relaxed">
							{app.description}
						</Card.Description>
					</Card.Header>
					<Card.Footer class="pt-0">
						<span
							class="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
						>
							Abrir app
							<ArrowRight
								class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
							/>
						</span>
					</Card.Footer>
				</Card.Root>
			</a>
		{/each}
	</div>
</div>
