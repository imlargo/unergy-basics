<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$ui/card';
	import { NotebookPen, Monitor } from '@lucide/svelte';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold tracking-tight">Unergy Basics</h1>
		<p class="text-muted-foreground">Colección de mini-apps y pruebas de concepto.</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<a href="/bitacora" class="group">
			<Card.Root
				class="transition-colors group-hover:border-primary/50 group-hover:shadow-md h-full"
			>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<NotebookPen class="h-5 w-5" />
						Bitácora de Visitas
					</Card.Title>
					<Card.Description>
						Genera bitácoras estructuradas de visitas a terrenos usando texto o voz con ayuda de IA.
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</a>

		<a href="/escritorios" class="group">
			<Card.Root
				class="transition-colors group-hover:border-primary/50 group-hover:shadow-md h-full"
			>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Monitor class="h-5 w-5" />
						Asignación de Escritorios
					</Card.Title>
					<Card.Description>
						Gestiona equipos, personas y escritorios de oficina. Genera horarios semanales optimizados.
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</a>
	</div>
</div>
