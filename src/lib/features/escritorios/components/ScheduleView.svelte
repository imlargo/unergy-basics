<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import { DAY_NAMES } from '../types/index.js';
	import type { DayOfWeek } from '../types/index.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import { CalendarDays, Sparkles, RefreshCw } from '@lucide/svelte';

	const store = escritoriosStore;
	const days: DayOfWeek[] = [0, 1, 2, 3, 4];

	function handleGenerate() {
		store.generate();
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-2">
			<CalendarDays class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-semibold">Horario Semanal</h2>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2 text-sm text-muted-foreground">
				Mín. días/semana:
				<input
					type="number"
					min="1"
					max="5"
					bind:value={store.minDaysPerWeek}
					class="h-8 w-16 rounded-lg border border-border/60 bg-card/50 px-2 text-center text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary/30"
				/>
			</label>
			<Button onclick={handleGenerate} size="sm" class="gap-1.5">
				{#if store.schedule}
					<RefreshCw class="h-3.5 w-3.5" />
					Regenerar
				{:else}
					<Sparkles class="h-3.5 w-3.5" />
					Generar Horario
				{/if}
			</Button>
		</div>
	</div>

	{#if store.schedule}
		<div class="grid gap-4 md:grid-cols-5">
			{#each days as day}
				{@const assignments = store.schedule.days[day]}
				<Card.Root class="overflow-hidden border-border/60">
					<Card.Header class="border-b border-border/40 bg-primary/5 pb-3">
						<Card.Title class="text-center text-base font-semibold">{DAY_NAMES[day]}</Card.Title>
						<Card.Description class="text-center text-xs">
							{assignments.length} persona{assignments.length !== 1 ? 's' : ''}
						</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2 pt-3">
						{#each assignments as assignment}
							{@const person = store.getPerson(assignment.personId)}
							{@const desk = store.getDesk(assignment.deskId)}
							{@const team = person ? store.getTeam(person.teamId) : undefined}
							{#if person && desk}
								<div
									class="flex items-center gap-2 rounded-lg border border-border/40 bg-card/80 p-2 text-sm transition-colors hover:bg-accent/50"
									style="border-left: 3px solid {team?.color ?? '#888'}"
								>
									<div class="flex flex-1 flex-col">
										<span class="font-medium">{person.name}</span>
										<span class="text-xs text-muted-foreground">
											Mesa {desk.label}
										</span>
									</div>
									{#if team}
										<Badge variant="outline" class="text-[10px]" style="color: {team.color}; border-color: {team.color}40">
											{team.name}
										</Badge>
									{/if}
								</div>
							{/if}
						{/each}
						{#if assignments.length === 0}
							<p class="py-4 text-center text-sm text-muted-foreground">Sin asignaciones</p>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Summary table -->
		<Card.Root class="overflow-hidden border-border/60">
			<Card.Header class="border-b border-border/40 bg-primary/5">
				<Card.Title class="text-base">Resumen por Persona</Card.Title>
				<Card.Description>Días asignados por persona durante la semana</Card.Description>
			</Card.Header>
			<Card.Content class="pt-4">
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-border/60">
								<th class="py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Persona</th>
								<th class="py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipo</th>
								{#each days as day}
									<th class="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{DAY_NAMES[day].slice(0, 3)}</th>
								{/each}
								<th class="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
							</tr>
						</thead>
						<tbody>
							{#each store.people as person}
								{@const team = store.getTeam(person.teamId)}
								{@const assignedDays = days.filter((d) =>
									store.schedule?.days[d].some((a) => a.personId === person.id)
								)}
								<tr class="border-b border-border/30 transition-colors last:border-0 hover:bg-accent/30">
									<td class="py-2.5 font-medium">{person.name}</td>
									<td class="py-2.5">
										{#if team}
											<Badge variant="outline" class="text-[10px]" style="color: {team.color}; border-color: {team.color}40">
												{team.name}
											</Badge>
										{/if}
									</td>
									{#each days as day}
										{@const assigned = store.schedule?.days[day].find(
											(a) => a.personId === person.id
										)}
										{@const unavailable = person.unavailableDays.includes(day)}
										<td class="py-2.5 text-center">
											{#if assigned}
												{@const desk = store.getDesk(assigned.deskId)}
												<span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
													{desk?.label ?? '?'}
												</span>
											{:else if unavailable}
												<span class="text-xs text-muted-foreground/60">—</span>
											{:else}
												<span class="text-xs text-muted-foreground/30">·</span>
											{/if}
										</td>
									{/each}
									<td class="py-2.5 text-center">
										<span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-bold text-primary">
											{assignedDays.length}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root class="border-dashed border-border/60">
			<Card.Content class="py-16 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
					<CalendarDays class="h-7 w-7 text-primary" />
				</div>
				<h3 class="mb-1 text-base font-semibold">Sin horario generado</h3>
				<p class="mb-6 text-sm text-muted-foreground">
					Configura los equipos, personas y escritorios, luego genera el horario.
				</p>
				<Button onclick={handleGenerate} class="gap-1.5">
					<Sparkles class="h-4 w-4" />
					Generar Horario
				</Button>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
