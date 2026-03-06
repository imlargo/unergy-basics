<script lang="ts">
	import type { ActaFinal } from '$lib/features/bitacora/types';
	import * as Card from '$ui/card';
	import { Badge } from '$ui/badge';
	import { Separator } from '$ui/separator';
	import {
		MapPin,
		Mountain,
		Building2,
		CheckCircle2,
		AlertTriangle,
		ArrowRight,
		FileCheck,
		Calendar,
		Lightbulb,
		ShieldAlert
	} from '@lucide/svelte';

	let { acta }: { acta: ActaFinal } = $props();

	const evaluacionLabels: Record<
		string,
		{ texto: string; variante: 'default' | 'secondary' | 'destructive' | 'outline' }
	> = {
		viable: { texto: 'Viable', variante: 'default' },
		no_viable: { texto: 'No Viable', variante: 'destructive' },
		requiere_estudio: { texto: 'Requiere Estudio', variante: 'secondary' }
	};

	let evalInfo = $derived(
		evaluacionLabels[acta.viabilidad?.evaluacion] ?? {
			texto: 'Sin evaluar',
			variante: 'outline' as const
		}
	);
</script>

<div class="flex flex-col gap-4">
	<!-- Header -->
	<Card.Root class="border-primary/20 bg-primary/[0.02]">
		<Card.Header>
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-start gap-3">
					<div class="bg-primary/10 text-primary mt-0.5 rounded-lg p-2">
						<FileCheck class="h-5 w-5" />
					</div>
					<div>
						<Card.Title class="text-lg font-semibold">
							{acta.titulo || 'Acta Final de Evaluación'}
						</Card.Title>
						<Card.Description class="mt-1 flex items-center gap-1.5">
							<Calendar class="h-3.5 w-3.5" />
							Generada el {acta.fecha_generacion || new Date().toISOString().split('T')[0]}
						</Card.Description>
					</div>
				</div>
				<Badge variant={evalInfo.variante} class="shrink-0">{evalInfo.texto}</Badge>
			</div>
		</Card.Header>
		{#if acta.resumen_ejecutivo}
			<Card.Content class="pt-0">
				<div class="rounded-lg bg-background px-4 py-3">
					<p class="text-sm font-medium">Resumen ejecutivo</p>
					<p class="text-muted-foreground mt-1 text-sm leading-relaxed">
						{acta.resumen_ejecutivo}
					</p>
				</div>
			</Card.Content>
		{/if}
	</Card.Root>

	<!-- Details -->
	<Card.Root>
		<Card.Content class="flex flex-col gap-5 pt-6">
			<!-- Ubicación -->
			{@const ubicacionItems = [
				{ label: 'Dirección', value: acta.ubicacion?.direccion },
				{ label: 'Municipio', value: acta.ubicacion?.municipio },
				{ label: 'Departamento', value: acta.ubicacion?.departamento },
				{ label: 'Coordenadas', value: acta.ubicacion?.coordenadas }
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

			<!-- Terreno -->
			{@const terrenoItems = [
				{ label: 'Topografía', value: acta.condiciones_terreno?.topografia },
				{ label: 'Tipo de suelo', value: acta.condiciones_terreno?.tipo_suelo },
				{ label: 'Vegetación', value: acta.condiciones_terreno?.vegetacion },
				{ label: 'Acceso', value: acta.condiciones_terreno?.acceso },
				{ label: 'Área aproximada', value: acta.condiciones_terreno?.area_aproximada }
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
				{ label: 'Vías de acceso', value: acta.infraestructura?.vias_acceso },
				{ label: 'Servicios públicos', value: acta.infraestructura?.servicios_publicos },
				{ label: 'Construcciones', value: acta.infraestructura?.construcciones_existentes }
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
			{#if acta.viabilidad?.observaciones || acta.viabilidad?.recomendaciones}
				<Separator />
				<section>
					<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold">
						<CheckCircle2 class="h-4 w-4 text-teal-500" />
						Evaluación de Viabilidad
					</h3>
					<div class="flex flex-col gap-1.5 text-sm">
						{#if acta.viabilidad?.observaciones}
							<div>
								<span class="text-muted-foreground">Observaciones:</span>
								{acta.viabilidad.observaciones}
							</div>
						{/if}
						{#if acta.viabilidad?.recomendaciones}
							<div>
								<span class="text-muted-foreground">Recomendaciones:</span>
								{acta.viabilidad.recomendaciones}
							</div>
						{/if}
					</div>
				</section>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Hallazgos & Riesgos -->
	<div class="grid gap-4 sm:grid-cols-2">
		{#if acta.hallazgos_clave?.length > 0}
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="flex items-center gap-2 text-sm font-semibold">
						<Lightbulb class="h-4 w-4 text-amber-500" />
						Hallazgos Clave
					</Card.Title>
				</Card.Header>
				<Card.Content class="pt-0">
					<ul class="flex flex-col gap-1.5">
						{#each acta.hallazgos_clave as hallazgo}
							<li class="flex items-start gap-2 text-sm">
								<span class="text-muted-foreground mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400"
								></span>
								{hallazgo}
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		{/if}

		{#if acta.riesgos_identificados?.length > 0}
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="flex items-center gap-2 text-sm font-semibold">
						<ShieldAlert class="h-4 w-4 text-red-500" />
						Riesgos Identificados
					</Card.Title>
				</Card.Header>
				<Card.Content class="pt-0">
					<ul class="flex flex-col gap-1.5">
						{#each acta.riesgos_identificados as riesgo}
							<li class="flex items-start gap-2 text-sm">
								<AlertTriangle
									class="mt-0.5 h-3 w-3 shrink-0 text-red-400"
								/>
								{riesgo}
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>

	<!-- Conclusión -->
	{#if acta.conclusion}
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-semibold">Conclusión</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0">
				<p class="text-sm leading-relaxed">{acta.conclusion}</p>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Próximos pasos -->
	{#if acta.proximos_pasos?.length > 0}
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-semibold">Próximos Pasos</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0">
				<ol class="flex flex-col gap-1.5">
					{#each acta.proximos_pasos as paso, i}
						<li class="flex items-start gap-2.5 text-sm">
							<span
								class="bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
							>
								{i + 1}
							</span>
							{paso}
						</li>
					{/each}
				</ol>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
