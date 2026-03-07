<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import { DAY_NAMES } from '../types/index.js';
	import type { DayOfWeek } from '../types/index.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import { CalendarDays } from '@lucide/svelte';

	const store = escritoriosStore;
	const days: DayOfWeek[] = [0, 1, 2, 3, 4];

	function handleGenerate() {
		store.generate();
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<CalendarDays class="h-5 w-5" />
			<h2 class="text-xl font-semibold">Horario Semanal</h2>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2 text-sm">
				Mín. días/semana:
				<input
					type="number"
					min="1"
					max="5"
					bind:value={store.minDaysPerWeek}
					class="h-8 w-16 rounded-md border bg-transparent px-2 text-center text-sm"
				/>
			</label>
			<Button onclick={handleGenerate} size="sm">
				Generar Horario
			</Button>
		</div>
	</div>

	{#if store.schedule}
		<div class="grid gap-4 md:grid-cols-5">
			{#each days as day}
				{@const assignments = store.schedule.days[day]}
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-center text-base">{DAY_NAMES[day]}</Card.Title>
						<Card.Description class="text-center text-xs">
							{assignments.length} persona{assignments.length !== 1 ? 's' : ''}
						</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2">
						{#each assignments as assignment}
							{@const person = store.getPerson(assignment.personId)}
							{@const desk = store.getDesk(assignment.deskId)}
							{@const team = person ? store.getTeam(person.teamId) : undefined}
							{#if person && desk}
								<div
									class="flex items-center gap-2 rounded-md border p-2 text-sm"
									style="border-left: 3px solid {team?.color ?? '#888'}"
								>
									<div class="flex flex-1 flex-col">
										<span class="font-medium">{person.name}</span>
										<span class="text-xs text-muted-foreground">
											Mesa {desk.label}
										</span>
									</div>
									{#if team}
										<Badge variant="outline" class="text-xs" style="color: {team.color}; border-color: {team.color}">
											{team.name}
										</Badge>
									{/if}
								</div>
							{/if}
						{/each}
						{#if assignments.length === 0}
							<p class="text-center text-sm text-muted-foreground">Sin asignaciones</p>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Summary table -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-base">Resumen por Persona</Card.Title>
				<Card.Description>Días asignados por persona durante la semana</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="py-2 text-left font-medium">Persona</th>
								<th class="py-2 text-left font-medium">Equipo</th>
								{#each days as day}
									<th class="py-2 text-center font-medium">{DAY_NAMES[day].slice(0, 3)}</th>
								{/each}
								<th class="py-2 text-center font-medium">Total</th>
							</tr>
						</thead>
						<tbody>
							{#each store.people as person}
								{@const team = store.getTeam(person.teamId)}
								{@const assignedDays = days.filter((d) =>
									store.schedule?.days[d].some((a) => a.personId === person.id)
								)}
								<tr class="border-b last:border-0">
									<td class="py-2">{person.name}</td>
									<td class="py-2">
										{#if team}
											<Badge variant="outline" class="text-xs" style="color: {team.color}; border-color: {team.color}">
												{team.name}
											</Badge>
										{/if}
									</td>
									{#each days as day}
										{@const assigned = store.schedule?.days[day].find(
											(a) => a.personId === person.id
										)}
										{@const unavailable = person.unavailableDays.includes(day)}
										<td class="py-2 text-center">
											{#if assigned}
												{@const desk = store.getDesk(assigned.deskId)}
												<span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
													{desk?.label ?? '?'}
												</span>
											{:else if unavailable}
												<span class="text-xs text-muted-foreground">—</span>
											{:else}
												<span class="text-xs text-muted-foreground/50">·</span>
											{/if}
										</td>
									{/each}
									<td class="py-2 text-center font-medium">{assignedDays.length}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<CalendarDays class="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
				<p class="text-muted-foreground">
					Configura los equipos, personas y escritorios, luego genera el horario.
				</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
