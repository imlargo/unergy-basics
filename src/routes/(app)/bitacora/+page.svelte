<script lang="ts">
	import type { Bitacora, ActaFinal } from '$lib/features/bitacora/types';
	import { crearBitacoraVacia } from '$lib/features/bitacora/types';
	import { validarBitacora } from '$lib/features/bitacora/validation';
	import VoiceTextInput from '$lib/features/bitacora/components/VoiceTextInput.svelte';
	import BitacoraDisplay from '$lib/features/bitacora/components/BitacoraDisplay.svelte';
	import ActaFinalDisplay from '$lib/features/bitacora/components/ActaFinalDisplay.svelte';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import { Separator } from '$ui/separator';
	import * as Empty from '$ui/empty';
	import { toast } from 'svelte-sonner';
	import {
		Plus,
		Trash2,
		NotebookPen,
		FileCheck,
		Loader2,
		Save,
		RotateCcw,
		ClipboardList,
		Check
	} from '@lucide/svelte';

	let loading = $state(false);
	let bitacoraActual: Bitacora | null = $state(null);
	let bitacorasGuardadas: Bitacora[] = $state([]);
	let seleccionadas: Set<string> = $state(new Set());
	let generandoActa = $state(false);
	let actaFinal: ActaFinal | null = $state(null);

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
			toast.success('Bitácora generada');
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
		seleccionadas.delete(id);
		seleccionadas = new Set(seleccionadas);
		guardarEnStorage();
		toast.success('Bitácora eliminada');
	}

	function toggleSeleccion(id: string) {
		if (seleccionadas.has(id)) {
			seleccionadas.delete(id);
		} else {
			seleccionadas.add(id);
		}
		seleccionadas = new Set(seleccionadas);
	}

	function seleccionarTodas() {
		if (seleccionadas.size === bitacorasGuardadas.length) {
			seleccionadas = new Set();
		} else {
			seleccionadas = new Set(bitacorasGuardadas.map((b) => b.id));
		}
	}

	async function generarActaFinal() {
		if (seleccionadas.size < 2) {
			toast.error('Selecciona al menos 2 bitácoras para generar el acta');
			return;
		}

		generandoActa = true;

		try {
			const bitacorasSeleccionadas = bitacorasGuardadas.filter((b) =>
				seleccionadas.has(b.id)
			);

			const response = await fetch('/bitacora/api/generar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ modo: 'acta', bitacoras: bitacorasSeleccionadas })
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Error al generar el acta');
			}

			const data = await response.json();
			actaFinal = {
				...data.acta,
				id: crypto.randomUUID(),
				fecha_generacion: new Date().toISOString().split('T')[0],
				bitacoras_fuente: bitacorasSeleccionadas.map((b) => b.id)
			};
			seleccionadas = new Set();
			toast.success('Acta final generada');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error desconocido';
			toast.error(message);
		} finally {
			generandoActa = false;
		}
	}
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
	<!-- Header -->
	<div>
		<div class="flex items-center gap-3">
			<NotebookPen class="h-6 w-6" />
			<h1 class="text-2xl font-bold tracking-tight">Bitácora de Visitas</h1>
		</div>
		<p class="text-muted-foreground mt-1 text-sm">
			Describe tu visita por texto o voz. La IA genera la bitácora estructurada.
		</p>
	</div>

	<!-- Input Section -->
	{#if !bitacoraActual && !actaFinal}
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm font-medium">Nueva entrada</Card.Title>
				<Card.Description class="text-xs">
					Escribe o dicta lo que observaste. Puedes ser informal, la IA se encarga del resto.
				</Card.Description>
			</Card.Header>
			<Card.Content class="pt-0">
				<VoiceTextInput onsubmit={generarBitacora} {loading} />
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Generated Bitacora Preview -->
	{#if bitacoraActual}
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<Button onclick={guardarBitacora} size="sm" class="gap-1.5">
					<Save class="h-3.5 w-3.5" />
					Guardar
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => (bitacoraActual = null)}
					class="gap-1.5"
				>
					<RotateCcw class="h-3.5 w-3.5" />
					Descartar
				</Button>
			</div>
			<BitacoraDisplay bitacora={bitacoraActual} />
		</div>
	{/if}

	<!-- Acta Final Display -->
	{#if actaFinal}
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" onclick={() => (actaFinal = null)} class="gap-1.5">
					<RotateCcw class="h-3.5 w-3.5" />
					Cerrar acta
				</Button>
			</div>
			<ActaFinalDisplay acta={actaFinal} />
		</div>
	{/if}

	<!-- Saved Bitacoras -->
	{#if bitacorasGuardadas.length > 0}
		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h2 class="text-base font-semibold">Bitácoras</h2>
					<Badge variant="secondary" class="text-xs">{bitacorasGuardadas.length}</Badge>
				</div>

				<div class="flex items-center gap-2">
					<Button variant="ghost" size="sm" onclick={seleccionarTodas} class="text-xs">
						{#if seleccionadas.size === bitacorasGuardadas.length}
							Deseleccionar
						{:else}
							Seleccionar todo
						{/if}
					</Button>
					{#if seleccionadas.size >= 2}
						<Button
							onclick={generarActaFinal}
							disabled={generandoActa}
							size="sm"
							class="gap-1.5"
						>
							{#if generandoActa}
								<Loader2 class="h-3.5 w-3.5 animate-spin" />
								Generando...
							{:else}
								<FileCheck class="h-3.5 w-3.5" />
								Generar acta final ({seleccionadas.size})
							{/if}
						</Button>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-3">
				{#each bitacorasGuardadas as bitacora (bitacora.id)}
					{@const isSelected = seleccionadas.has(bitacora.id)}
					<div
						class="relative"
						role="button"
						tabindex="0"
						onclick={() => toggleSeleccion(bitacora.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								toggleSeleccion(bitacora.id);
							}
						}}
					>
						<div
							class="rounded-xl border-2 p-1 transition-colors"
							class:border-primary={isSelected}
							class:border-transparent={!isSelected}
						>
							<!-- Selection indicator -->
							<div
								class="absolute top-3 left-3 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors {isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'}"
							>
								{#if isSelected}
									<Check class="h-3 w-3 text-white" />
								{/if}
							</div>

							<div class="pl-7">
								<BitacoraDisplay {bitacora} compact />
							</div>
						</div>

						<!-- Delete button (stop propagation) -->
						<button
							class="text-muted-foreground hover:text-destructive absolute top-3 right-3 z-10 rounded-md p-1 transition-colors"
							onclick={(e) => {
								e.stopPropagation();
								eliminarBitacora(bitacora.id);
							}}
						>
							<Trash2 class="h-3.5 w-3.5" />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else if !bitacoraActual && !actaFinal}
		<Empty.Root class="border-none py-12">
			<Empty.Media variant="icon">
				<ClipboardList />
			</Empty.Media>
			<Empty.Header>
				<Empty.Title>Sin bitácoras</Empty.Title>
				<Empty.Description>
					Crea tu primera bitácora describiendo una visita a terreno arriba.
				</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/if}
</div>
