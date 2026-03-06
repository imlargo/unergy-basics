<script lang="ts">
	import type { Bitacora } from '$lib/features/bitacora/types';
	import * as Card from '$ui/card';
	import { Badge } from '$ui/badge';
	import { Separator } from '$ui/separator';
	import {
		MapPin,
		Mountain,
		Building2,
		CheckCircle2,
		AlertTriangle,
		Info,
		XCircle,
		User,
		Calendar
	} from '@lucide/svelte';
	import type { Warning } from '$lib/features/bitacora/types';

	let { bitacora }: { bitacora: Bitacora } = $props();

	const evaluacionLabels: Record<string, { texto: string; variante: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
		viable: { texto: 'Viable', variante: 'default' },
		no_viable: { texto: 'No Viable', variante: 'destructive' },
		requiere_estudio: { texto: 'Requiere Estudio', variante: 'secondary' },
		pendiente: { texto: 'Pendiente', variante: 'outline' }
	};

	let evalInfo = $derived(evaluacionLabels[bitacora.viabilidad.evaluacion] ?? evaluacionLabels['pendiente']);

	function getWarningIcon(severidad: Warning['severidad']) {
		switch (severidad) {
			case 'error':
				return XCircle;
			case 'warning':
				return AlertTriangle;
			default:
				return Info;
		}
	}

	function getWarningColor(severidad: Warning['severidad']) {
		switch (severidad) {
			case 'error':
				return 'text-red-500';
			case 'warning':
				return 'text-yellow-500';
			default:
				return 'text-blue-500';
		}
	}
</script>

<div class="flex flex-col gap-4">
	{#if bitacora.warnings.length > 0}
		<Card.Root class="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
					<AlertTriangle class="h-5 w-5" />
					Campos con observaciones ({bitacora.warnings.length})
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<ul class="flex flex-col gap-2">
					{#each bitacora.warnings as warning}
						{@const Icon = getWarningIcon(warning.severidad)}
						<li class="flex items-start gap-2 text-sm">
							<Icon class="mt-0.5 h-4 w-4 shrink-0 {getWarningColor(warning.severidad)}" />
							<span>
								<strong>{warning.campo}:</strong>
								{warning.mensaje}
							</span>
						</li>
					{/each}
				</ul>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<Card.Title class="text-xl">Bitácora de Visita</Card.Title>
				<Badge variant={evalInfo.variante}>{evalInfo.texto}</Badge>
			</div>
			<Card.Description class="flex flex-wrap gap-4">
				{#if bitacora.fecha}
					<span class="flex items-center gap-1">
						<Calendar class="h-3.5 w-3.5" />
						{bitacora.fecha}
					</span>
				{/if}
				{#if bitacora.visitador}
					<span class="flex items-center gap-1">
						<User class="h-3.5 w-3.5" />
						{bitacora.visitador}
					</span>
				{/if}
			</Card.Description>
		</Card.Header>

		<Card.Content class="flex flex-col gap-6">
			<!-- Ubicación -->
			<section>
				<h3 class="mb-3 flex items-center gap-2 font-semibold">
					<MapPin class="h-4 w-4" />
					Ubicación
				</h3>
				<div class="grid gap-2 text-sm md:grid-cols-2">
					{#if bitacora.ubicacion.direccion}
						<div><span class="text-muted-foreground">Dirección:</span> {bitacora.ubicacion.direccion}</div>
					{/if}
					{#if bitacora.ubicacion.municipio}
						<div><span class="text-muted-foreground">Municipio:</span> {bitacora.ubicacion.municipio}</div>
					{/if}
					{#if bitacora.ubicacion.departamento}
						<div><span class="text-muted-foreground">Departamento:</span> {bitacora.ubicacion.departamento}</div>
					{/if}
					{#if bitacora.ubicacion.coordenadas}
						<div><span class="text-muted-foreground">Coordenadas:</span> {bitacora.ubicacion.coordenadas}</div>
					{/if}
				</div>
			</section>

			<Separator />

			<!-- Condiciones del Terreno -->
			<section>
				<h3 class="mb-3 flex items-center gap-2 font-semibold">
					<Mountain class="h-4 w-4" />
					Condiciones del Terreno
				</h3>
				<div class="grid gap-2 text-sm md:grid-cols-2">
					{#if bitacora.condiciones_terreno.topografia}
						<div><span class="text-muted-foreground">Topografía:</span> {bitacora.condiciones_terreno.topografia}</div>
					{/if}
					{#if bitacora.condiciones_terreno.tipo_suelo}
						<div><span class="text-muted-foreground">Tipo de suelo:</span> {bitacora.condiciones_terreno.tipo_suelo}</div>
					{/if}
					{#if bitacora.condiciones_terreno.vegetacion}
						<div><span class="text-muted-foreground">Vegetación:</span> {bitacora.condiciones_terreno.vegetacion}</div>
					{/if}
					{#if bitacora.condiciones_terreno.acceso}
						<div><span class="text-muted-foreground">Acceso:</span> {bitacora.condiciones_terreno.acceso}</div>
					{/if}
					{#if bitacora.condiciones_terreno.area_aproximada}
						<div class="md:col-span-2"><span class="text-muted-foreground">Área aproximada:</span> {bitacora.condiciones_terreno.area_aproximada}</div>
					{/if}
				</div>
			</section>

			<Separator />

			<!-- Infraestructura -->
			<section>
				<h3 class="mb-3 flex items-center gap-2 font-semibold">
					<Building2 class="h-4 w-4" />
					Infraestructura
				</h3>
				<div class="grid gap-2 text-sm md:grid-cols-2">
					{#if bitacora.infraestructura.vias_acceso}
						<div><span class="text-muted-foreground">Vías de acceso:</span> {bitacora.infraestructura.vias_acceso}</div>
					{/if}
					{#if bitacora.infraestructura.servicios_publicos}
						<div><span class="text-muted-foreground">Servicios públicos:</span> {bitacora.infraestructura.servicios_publicos}</div>
					{/if}
					{#if bitacora.infraestructura.construcciones_existentes}
						<div class="md:col-span-2"><span class="text-muted-foreground">Construcciones:</span> {bitacora.infraestructura.construcciones_existentes}</div>
					{/if}
				</div>
			</section>

			<Separator />

			<!-- Viabilidad -->
			<section>
				<h3 class="mb-3 flex items-center gap-2 font-semibold">
					<CheckCircle2 class="h-4 w-4" />
					Viabilidad
				</h3>
				<div class="flex flex-col gap-2 text-sm">
					{#if bitacora.viabilidad.observaciones}
						<div><span class="text-muted-foreground">Observaciones:</span> {bitacora.viabilidad.observaciones}</div>
					{/if}
					{#if bitacora.viabilidad.recomendaciones}
						<div><span class="text-muted-foreground">Recomendaciones:</span> {bitacora.viabilidad.recomendaciones}</div>
					{/if}
				</div>
			</section>

			{#if bitacora.observaciones_generales}
				<Separator />
				<section>
					<h3 class="mb-3 font-semibold">Observaciones Generales</h3>
					<p class="text-sm">{bitacora.observaciones_generales}</p>
				</section>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
