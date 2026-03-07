<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import { DAY_NAMES } from '../types/index.js';
	import type { DayOfWeek } from '../types/index.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import * as Tooltip from '$ui/tooltip';
	import { Monitor, MapPin, Users, BarChart3, TrendingUp } from '@lucide/svelte';

	const store = escritoriosStore;
	const days: DayOfWeek[] = [0, 1, 2, 3, 4];

	let selectedDay: DayOfWeek = $state(0);

	function getGrid() {
		const desks = store.desks;
		if (desks.length === 0) return { rows: 0, cols: 0, grid: [] as (typeof desks[0] | null)[][] };
		const maxRow = Math.max(...desks.map((d) => d.row));
		const maxCol = Math.max(...desks.map((d) => d.col));
		const grid: (typeof desks[0] | null)[][] = [];
		for (let r = 0; r <= maxRow; r++) {
			const row: (typeof desks[0] | null)[] = [];
			for (let c = 0; c <= maxCol; c++) {
				row.push(desks.find((d) => d.row === r && d.col === c) ?? null);
			}
			grid.push(row);
		}
		return { rows: maxRow + 1, cols: maxCol + 1, grid };
	}

	function getPersonForDesk(deskId: string) {
		const assignments = store.getAssignmentsForDesk(deskId, selectedDay);
		if (assignments.length === 0) return null;
		const person = store.getPerson(assignments[0].personId);
		if (!person) return null;
		const team = store.getTeam(person.teamId);
		return { person, team };
	}

	function getDayAssignmentCount(day: DayOfWeek): number {
		return store.getAssignmentsForDay(day).length;
	}
</script>

<div class="flex flex-col gap-6">
	{#if !store.schedule}
		<Card.Root class="border-dashed border-border/60">
			<Card.Content class="py-16 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
					<MapPin class="h-7 w-7 text-primary" />
				</div>
				<h3 class="mb-1 text-base font-semibold">Sin distribución disponible</h3>
				<p class="text-sm text-muted-foreground">
					Genera un horario primero para ver la distribución de escritorios.
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- Day Selector -->
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<MapPin class="h-5 w-5 text-primary" />
				<h2 class="text-xl font-semibold">Mapa de Oficina</h2>
			</div>

			<div class="flex gap-2">
				{#each days as day}
					{@const count = getDayAssignmentCount(day)}
					<button
						type="button"
						class="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all {selectedDay === day
							? 'border-primary bg-primary/10 text-primary shadow-sm'
							: 'border-border/40 bg-card/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5'}"
						onclick={() => (selectedDay = day)}
					>
						<span class="text-xs font-semibold">{DAY_NAMES[day].slice(0, 3)}</span>
						<span class="text-[10px] opacity-70">{count}/{store.desks.length}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Team distribution for selected day -->
		{@const teamDist = store.getTeamDistributionForDay(selectedDay)}
		{#if teamDist.length > 0}
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium text-muted-foreground">Equipos hoy:</span>
				{#each teamDist as { team, count }}
					<Badge variant="outline" class="gap-1 text-[10px]" style="color: {team.color}; border-color: {team.color}40">
						<span class="inline-block h-2 w-2 rounded-full" style="background-color: {team.color}"></span>
						{team.name} ({count})
					</Badge>
				{/each}
			</div>
		{/if}

		<!-- Interactive Office Map -->
		{@const { grid } = getGrid()}
		<Card.Root class="overflow-hidden border-border/60">
			<Card.Header class="border-b border-border/40 bg-primary/5 pb-3">
				<Card.Title class="flex items-center gap-2 text-base">
					<Monitor class="h-4 w-4 text-primary" />
					Distribución — {DAY_NAMES[selectedDay]}
				</Card.Title>
				<Card.Description>
					{@const dayAssignments = store.getAssignmentsForDay(selectedDay)}
					{dayAssignments.length} de {store.desks.length} escritorios ocupados
				</Card.Description>
			</Card.Header>
			<Card.Content class="pt-5">
				<div class="flex flex-col gap-3 rounded-2xl border border-border/30 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-5">
					{#each grid as row}
						<div class="flex gap-3">
							{#each row as cell}
								{#if cell}
									{@const occupant = getPersonForDesk(cell.id)}
									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger>
												<div
													class="flex h-20 w-28 flex-col items-center justify-center rounded-xl border-2 shadow-sm transition-all {occupant
														? 'border-primary/30 bg-card hover:border-primary/50 hover:shadow-md'
														: 'border-border/20 bg-muted/30 opacity-60'}"
													style={occupant?.team ? `border-left: 4px solid ${occupant.team.color}` : ''}
												>
													<Monitor class="mb-1 h-4 w-4 {occupant ? 'text-primary' : 'text-muted-foreground/40'}" />
													<span class="text-[10px] font-bold text-muted-foreground">{cell.label}</span>
													{#if occupant}
														<span class="mt-0.5 max-w-full truncate px-1 text-[10px] font-medium" style="color: {occupant.team?.color ?? 'inherit'}">
															{occupant.person.name.split(' ')[0]}
														</span>
													{:else}
														<span class="mt-0.5 text-[9px] text-muted-foreground/40">Libre</span>
													{/if}
												</div>
											</Tooltip.Trigger>
											<Tooltip.Content>
												{#if occupant}
													<div class="flex flex-col gap-1">
														<span class="font-semibold">{occupant.person.name}</span>
														<span class="text-xs text-muted-foreground">
															Mesa {cell.label} · {occupant.team?.name ?? 'Sin equipo'}
														</span>
													</div>
												{:else}
													<span>Mesa {cell.label} — Libre</span>
												{/if}
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								{:else}
									<div class="h-20 w-28 rounded-xl border border-dashed border-border/10"></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Desk Detail List -->
		<Card.Root class="overflow-hidden border-border/60">
			<Card.Header class="border-b border-border/40 bg-primary/5">
				<Card.Title class="flex items-center gap-2 text-base">
					<BarChart3 class="h-4 w-4 text-primary" />
					Detalle por Escritorio
				</Card.Title>
				<Card.Description>Uso semanal de cada escritorio</Card.Description>
			</Card.Header>
			<Card.Content class="pt-4">
				<div class="flex flex-col gap-2">
					{#each store.desks as desk (desk.id)}
						{@const occupancy = store.getDeskOccupancyRate(desk.id)}
						{@const occupancyPct = Math.round(occupancy * 100)}
						<div class="flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-3 transition-colors hover:bg-accent/20">
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
								<Monitor class="h-4 w-4 text-primary" />
							</div>
							<div class="flex flex-1 flex-col gap-1">
								<div class="flex items-center gap-2">
									<span class="text-sm font-semibold">{desk.label}</span>
									<Badge variant="secondary" class="text-[10px]">
										{occupancyPct}% uso
									</Badge>
								</div>
								<!-- Weekly occupant strip -->
								<div class="flex gap-1">
									{#each days as day}
										{@const dayAssignments = store.getAssignmentsForDesk(desk.id, day)}
										{@const dayPerson = dayAssignments.length > 0 ? store.getPerson(dayAssignments[0].personId) : null}
										{@const dayTeam = dayPerson ? store.getTeam(dayPerson.teamId) : null}
										<div
											class="flex h-6 flex-1 items-center justify-center rounded-md text-[9px] font-medium {dayPerson
												? 'text-white'
												: 'border border-border/20 bg-muted/30 text-muted-foreground/40'}"
											style={dayPerson && dayTeam ? `background-color: ${dayTeam.color}` : ''}
											title="{DAY_NAMES[day]}: {dayPerson?.name ?? 'Libre'}"
										>
											{#if dayPerson}
												{dayPerson.name.split(' ')[0].slice(0, 4)}
											{:else}
												—
											{/if}
										</div>
									{/each}
								</div>
							</div>
							<!-- Occupancy bar -->
							<div class="flex w-16 flex-col items-end gap-0.5">
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<div
										class="h-full rounded-full transition-all {occupancyPct >= 80
											? 'bg-emerald-500'
											: occupancyPct >= 50
												? 'bg-primary'
												: 'bg-amber-500'}"
										style="width: {occupancyPct}%"
									></div>
								</div>
								<span class="text-[9px] text-muted-foreground">{Math.round(occupancy * 5)}/5 días</span>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Occupancy Summary -->
		{@const overallRate = store.getOverallOccupancyRate()}
		<div class="grid gap-3 sm:grid-cols-3">
			<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<TrendingUp class="h-5 w-5 text-primary" />
				</div>
				<div>
					<p class="text-2xl font-bold">{Math.round(overallRate * 100)}%</p>
					<p class="text-xs text-muted-foreground">Ocupación general</p>
				</div>
			</div>
			<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
					<Users class="h-5 w-5 text-emerald-500" />
				</div>
				<div>
					<p class="text-2xl font-bold">{store.people.length}</p>
					<p class="text-xs text-muted-foreground">Personas asignadas</p>
				</div>
			</div>
			<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10">
					<Monitor class="h-5 w-5 text-fuchsia-500" />
				</div>
				<div>
					<p class="text-2xl font-bold">{store.desks.length}</p>
					<p class="text-xs text-muted-foreground">Escritorios totales</p>
				</div>
			</div>
		</div>
	{/if}
</div>
