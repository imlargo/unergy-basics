<script lang="ts">
	import type { Bitacora, CampoStatus } from '$lib/features/bitacora/types';
	import { obtenerStatusCampos } from '$lib/features/bitacora/validation';
	import * as Card from '$ui/card';
	import { Badge } from '$ui/badge';
	import { Separator } from '$ui/separator';
	import { Progress } from '$ui/progress';
	import {
		MapPin,
		Mountain,
		Building2,
		CheckCircle2,
		User,
		Calendar,
		CircleCheck,
		CircleAlert,
		FileText
	} from '@lucide/svelte';

	let { bitacora, compact = false }: { bitacora: Bitacora; compact?: boolean } = $props();

	const evaluacionLabels: Record<
		string,
		{ texto: string; variante: 'default' | 'secondary' | 'destructive' | 'outline' }
	> = {
		viable: { texto: 'Viable', variante: 'default' },
		no_viable: { texto: 'No Viable', variante: 'destructive' },
		requiere_estudio: { texto: 'Requiere Estudio', variante: 'secondary' },
		pendiente: { texto: 'Pendiente', variante: 'outline' }
	};

	let evalInfo = $derived(
		evaluacionLabels[bitacora.viabilidad.evaluacion] ?? evaluacionLabels['pendiente']
	);
	let campos = $derived(obtenerStatusCampos(bitacora));
	let camposCompletos = $derived(campos.filter((c) => c.completo).length);
	let totalCampos = $derived(campos.length);
	let porcentaje = $derived(Math.round((camposCompletos / totalCampos) * 100));
	let camposFaltantes = $derived(campos.filter((c) => !c.completo));

	let seccionesCampos = $derived(
		campos.reduce(
			(acc, campo) => {
				if (!acc[campo.seccion]) acc[campo.seccion] = [];
				acc[campo.seccion].push(campo);
				return acc;
			},
			{} as Record<string, CampoStatus[]>
		)
	);
</script>

{#if compact}
	<!-- Compact card for the saved list -->
	<Card.Root class="transition-shadow hover:shadow-sm">
		<Card.Header class="pb-3">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1">
					<Card.Title class="flex items-center gap-2 text-base">
						<FileText class="h-4 w-4 shrink-0" />
						<span class="truncate">
							{bitacora.ubicacion.direccion || bitacora.ubicacion.municipio || 'Sin ubicación'}
						</span>
					</Card.Title>
					<Card.Description class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
						{#if bitacora.fecha}
							<span class="flex items-center gap-1">
								<Calendar class="h-3 w-3" />
								{bitacora.fecha}
							</span>
						{/if}
						{#if bitacora.visitador}
							<span class="flex items-center gap-1">
								<User class="h-3 w-3" />
								{bitacora.visitador}
							</span>
						{/if}
					</Card.Description>
				</div>
				<Badge variant={evalInfo.variante} class="shrink-0 text-xs">{evalInfo.texto}</Badge>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			<div class="flex items-center gap-3">
				<Progress value={porcentaje} class="h-1.5 flex-1" />
				<span class="text-muted-foreground shrink-0 text-xs font-medium">
					{camposCompletos}/{totalCampos}
				</span>
			</div>
			{#if camposFaltantes.length > 0}
				<p class="text-muted-foreground mt-2 text-xs">
					Falta: {camposFaltantes.map((c) => c.label).join(', ')}
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
{:else}
	<!-- Full display -->
	<div class="flex flex-col gap-4">
		<!-- Completeness overview -->
		<Card.Root>
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Card.Title class="text-sm font-medium">Completitud de la información</Card.Title>
					<span
						class="text-sm font-semibold"
						class:text-green-600={porcentaje === 100}
						class:text-yellow-600={porcentaje >= 50 && porcentaje < 100}
						class:text-red-500={porcentaje < 50}
					>
						{porcentaje}%
					</span>
				</div>
			</Card.Header>
			<Card.Content class="flex flex-col gap-4 pt-0">
				<Progress value={porcentaje} class="h-2" />

				<div class="grid gap-x-6 gap-y-3 sm:grid-cols-2">
					{#each Object.entries(seccionesCampos) as [seccion, camposSeccion]}
						<div>
							<p class="text-muted-foreground mb-1.5 text-xs font-medium uppercase tracking-wide">
								{seccion}
							</p>
							<div class="flex flex-col gap-1">
								{#each camposSeccion as campo}
									<div class="flex items-center gap-2 text-sm">
										{#if campo.completo}
											<CircleCheck class="h-3.5 w-3.5 shrink-0 text-green-500" />
										{:else}
											<CircleAlert class="h-3.5 w-3.5 shrink-0 text-amber-400" />
										{/if}
										<span class:text-muted-foreground={!campo.completo}>
											{campo.label}
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				{#if camposFaltantes.length > 0}
					<div class="rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-950/30">
						<p class="mb-1 text-xs font-medium text-amber-700 dark:text-amber-300">
							Dile al visitador que complete:
						</p>
						<ul class="flex flex-col gap-0.5">
							{#each camposFaltantes as campo}
								<li class="text-xs text-amber-600 dark:text-amber-400">
									• {campo.descripcion}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Main Bitacora Card -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title class="text-lg font-semibold">Bitácora de Visita</Card.Title>
					<Badge variant={evalInfo.variante}>{evalInfo.texto}</Badge>
				</div>
				<Card.Description class="flex flex-wrap gap-x-4 gap-y-1">
					{#if bitacora.fecha}
						<span class="flex items-center gap-1.5">
							<Calendar class="h-3.5 w-3.5" />
							{bitacora.fecha}
						</span>
					{/if}
					{#if bitacora.visitador}
						<span class="flex items-center gap-1.5">
							<User class="h-3.5 w-3.5" />
							{bitacora.visitador}
						</span>
					{/if}
				</Card.Description>
			</Card.Header>

			<Card.Content class="flex flex-col gap-5">
				<!-- Ubicación -->
				{@const ubicacionItems = [
					{ label: 'Dirección', value: bitacora.ubicacion.direccion },
					{ label: 'Municipio', value: bitacora.ubicacion.municipio },
					{ label: 'Departamento', value: bitacora.ubicacion.departamento },
					{ label: 'Coordenadas', value: bitacora.ubicacion.coordenadas }
				].filter((i) => i.value)}
				{#if ubicacionItems.length > 0}
					<section>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold">
							<MapPin class="h-4 w-4 text-blue-500" />
							Ubicación
						</h3>
						<div class="grid gap-1.5 text-sm sm:grid-cols-2">
							{#each ubicacionItems as item}
								<div>
									<span class="text-muted-foreground">{item.label}:</span>
									{item.value}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Condiciones del Terreno -->
				{@const terrenoItems = [
					{ label: 'Topografía', value: bitacora.condiciones_terreno.topografia },
					{ label: 'Tipo de suelo', value: bitacora.condiciones_terreno.tipo_suelo },
					{ label: 'Vegetación', value: bitacora.condiciones_terreno.vegetacion },
					{ label: 'Acceso', value: bitacora.condiciones_terreno.acceso },
					{ label: 'Área aproximada', value: bitacora.condiciones_terreno.area_aproximada }
				].filter((i) => i.value)}
				{#if terrenoItems.length > 0}
					<Separator />
					<section>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold">
							<Mountain class="h-4 w-4 text-emerald-500" />
							Condiciones del Terreno
						</h3>
						<div class="grid gap-1.5 text-sm sm:grid-cols-2">
							{#each terrenoItems as item}
								<div>
									<span class="text-muted-foreground">{item.label}:</span>
									{item.value}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Infraestructura -->
				{@const infraItems = [
					{ label: 'Vías de acceso', value: bitacora.infraestructura.vias_acceso },
					{
						label: 'Servicios públicos',
						value: bitacora.infraestructura.servicios_publicos
					},
					{
						label: 'Construcciones',
						value: bitacora.infraestructura.construcciones_existentes
					}
				].filter((i) => i.value)}
				{#if infraItems.length > 0}
					<Separator />
					<section>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold">
							<Building2 class="h-4 w-4 text-violet-500" />
							Infraestructura
						</h3>
						<div class="grid gap-1.5 text-sm sm:grid-cols-2">
							{#each infraItems as item}
								<div>
									<span class="text-muted-foreground">{item.label}:</span>
									{item.value}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Viabilidad -->
				{@const viabilidadItems = [
					{ label: 'Observaciones', value: bitacora.viabilidad.observaciones },
					{ label: 'Recomendaciones', value: bitacora.viabilidad.recomendaciones }
				].filter((i) => i.value)}
				{#if viabilidadItems.length > 0}
					<Separator />
					<section>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold">
							<CheckCircle2 class="h-4 w-4 text-teal-500" />
							Viabilidad
						</h3>
						<div class="flex flex-col gap-1.5 text-sm">
							{#each viabilidadItems as item}
								<div>
									<span class="text-muted-foreground">{item.label}:</span>
									{item.value}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if bitacora.observaciones_generales}
					<Separator />
					<section>
						<h3 class="mb-2 text-sm font-semibold">Observaciones Generales</h3>
						<p class="text-sm leading-relaxed">{bitacora.observaciones_generales}</p>
					</section>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
{/if}
