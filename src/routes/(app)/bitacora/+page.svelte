<script lang="ts">
	import type { Bitacora } from '$lib/features/bitacora/types';
	import { crearBitacoraVacia } from '$lib/features/bitacora/types';
	import { validarBitacora } from '$lib/features/bitacora/validation';
	import VoiceTextInput from '$lib/features/bitacora/components/VoiceTextInput.svelte';
	import BitacoraDisplay from '$lib/features/bitacora/components/BitacoraDisplay.svelte';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import { Separator } from '$ui/separator';
	import { toast } from 'svelte-sonner';
	import {
		ClipboardList,
		Plus,
		Merge,
		Trash2,
		ChevronDown,
		ChevronUp,
		NotebookPen
	} from '@lucide/svelte';

	let loading = $state(false);
	let bitacoraActual: Bitacora | null = $state(null);
	let bitacorasGuardadas: Bitacora[] = $state([]);
	let seleccionadasParaMerge: Set<string> = $state(new Set());
	let merging = $state(false);
	let mostrarGuardadas = $state(true);

	$effect(() => {
		const saved = localStorage.getItem('bitacoras');
		if (saved) {
			bitacorasGuardadas = JSON.parse(saved);
		}
	});

	function guardarEnStorage() {
		localStorage.setItem('bitacoras', JSON.stringify(bitacorasGuardadas));
	}

	async function generarBitacora(texto: string) {
		loading = true;

		try {
			const response = await fetch('/bitacora/api/generar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ texto, modo: 'generar' })
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Error al generar la bitácora');
			}

			const data = await response.json();
			const bitacora: Bitacora = {
				...crearBitacoraVacia(),
				...data.bitacora
			};

			bitacora.id = crypto.randomUUID();
			bitacora.warnings = validarBitacora(bitacora);
			bitacoraActual = bitacora;
			toast.success('Bitácora generada correctamente');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error desconocido';
			toast.error(message);
		} finally {
			loading = false;
		}
	}

	function guardarBitacora() {
		if (!bitacoraActual) return;

		bitacorasGuardadas = [bitacoraActual, ...bitacorasGuardadas];
		guardarEnStorage();
		toast.success('Bitácora guardada');
		bitacoraActual = null;
	}

	function eliminarBitacora(id: string) {
		bitacorasGuardadas = bitacorasGuardadas.filter((b) => b.id !== id);
		seleccionadasParaMerge.delete(id);
		seleccionadasParaMerge = new Set(seleccionadasParaMerge);
		guardarEnStorage();
		toast.success('Bitácora eliminada');
	}

	function toggleSeleccion(id: string) {
		if (seleccionadasParaMerge.has(id)) {
			seleccionadasParaMerge.delete(id);
		} else {
			seleccionadasParaMerge.add(id);
		}
		seleccionadasParaMerge = new Set(seleccionadasParaMerge);
	}

	async function mergearBitacoras() {
		if (seleccionadasParaMerge.size < 2) {
			toast.error('Selecciona al menos 2 bitácoras para combinar');
			return;
		}

		merging = true;

		try {
			const bitacorasSeleccionadas = bitacorasGuardadas.filter((b) =>
				seleccionadasParaMerge.has(b.id)
			);

			const response = await fetch('/bitacora/api/generar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ modo: 'merge', bitacoras: bitacorasSeleccionadas })
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Error al combinar bitácoras');
			}

			const data = await response.json();
			const bitacora: Bitacora = {
				...crearBitacoraVacia(),
				...data.bitacora
			};

			bitacora.id = crypto.randomUUID();
			bitacora.warnings = validarBitacora(bitacora);
			bitacoraActual = bitacora;
			seleccionadasParaMerge = new Set();
			toast.success('Bitácoras combinadas correctamente');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error desconocido';
			toast.error(message);
		} finally {
			merging = false;
		}
	}

	function nuevaEntrada() {
		bitacoraActual = null;
	}
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-3">
			<NotebookPen class="h-7 w-7" />
			<h1 class="text-3xl font-bold tracking-tight">Bitácora de Visitas</h1>
		</div>
		<p class="text-muted-foreground">
			Describe tu visita al terreno por texto o voz. La IA generará una bitácora estructurada
			automáticamente.
		</p>
	</div>

	<!-- Input Section -->
	{#if !bitacoraActual}
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<ClipboardList class="h-5 w-5" />
					Nueva entrada
				</Card.Title>
				<Card.Description>
					Escribe o dicta la información de tu visita. Puedes ser informal, la IA organizará todo.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<VoiceTextInput onsubmit={generarBitacora} {loading} />
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- Generated Bitacora -->
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap gap-2">
				<Button onclick={guardarBitacora} class="gap-2">
					<Plus class="h-4 w-4" />
					Guardar bitácora
				</Button>
				<Button variant="outline" onclick={nuevaEntrada} class="gap-2">
					<ClipboardList class="h-4 w-4" />
					Nueva entrada
				</Button>
			</div>

			<BitacoraDisplay bitacora={bitacoraActual} />
		</div>
	{/if}

	<!-- Saved Bitacoras -->
	{#if bitacorasGuardadas.length > 0}
		<Separator />

		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<button
					class="flex items-center gap-2 text-lg font-semibold"
					onclick={() => (mostrarGuardadas = !mostrarGuardadas)}
				>
					Bitácoras guardadas
					<Badge variant="secondary">{bitacorasGuardadas.length}</Badge>
					{#if mostrarGuardadas}
						<ChevronUp class="h-4 w-4" />
					{:else}
						<ChevronDown class="h-4 w-4" />
					{/if}
				</button>

				{#if seleccionadasParaMerge.size >= 2}
					<Button onclick={mergearBitacoras} disabled={merging} variant="secondary" class="gap-2">
						<Merge class="h-4 w-4" />
						Combinar ({seleccionadasParaMerge.size})
					</Button>
				{/if}
			</div>

			{#if mostrarGuardadas}
				<div class="flex flex-col gap-4">
					{#each bitacorasGuardadas as bitacora (bitacora.id)}
						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									checked={seleccionadasParaMerge.has(bitacora.id)}
									onchange={() => toggleSeleccion(bitacora.id)}
									class="h-4 w-4 rounded"
								/>
								<span class="text-muted-foreground flex-1 text-xs">
									Seleccionar para combinar
								</span>
								<Button
									variant="ghost"
									size="icon"
									onclick={() => eliminarBitacora(bitacora.id)}
									class="h-8 w-8 text-red-500 hover:text-red-700"
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
							<BitacoraDisplay {bitacora} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
