<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import { DAY_NAMES } from '../types/index.js';
	import type { DayOfWeek } from '../types/index.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import * as Select from '$ui/select';
	import { Badge } from '$ui/badge';
	import { UserPlus, Trash2, User } from '@lucide/svelte';

	const store = escritoriosStore;
	const days: DayOfWeek[] = [0, 1, 2, 3, 4];

	let newName = $state('');
	let newTeamId = $state('');
	let newUnavailable: number[] = $state([]);

	function handleAdd() {
		const name = newName.trim();
		if (!name || !newTeamId) return;
		store.addPerson(name, newTeamId, [...newUnavailable]);
		newName = '';
		newTeamId = '';
		newUnavailable = [];
	}

	function toggleDay(day: number) {
		if (newUnavailable.includes(day)) {
			newUnavailable = newUnavailable.filter((d) => d !== day);
		} else {
			newUnavailable = [...newUnavailable, day];
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<User class="h-4 w-4" />
			Personas ({store.people.length})
		</Card.Title>
		<Card.Description>Gestiona las personas y su disponibilidad</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4">
		<!-- Add form -->
		<div class="flex flex-col gap-3 rounded-md border border-dashed p-3">
			<div class="flex items-end gap-2">
				<div class="flex-1">
					<label for="person-name" class="mb-1 block text-xs font-medium">Nombre</label>
					<Input
						id="person-name"
						bind:value={newName}
						placeholder="Nombre completo"
						class="h-8 text-sm"
					/>
				</div>
				<div class="w-40">
					<label for="person-team" class="mb-1 block text-xs font-medium">Equipo</label>
					<Select.Root type="single" bind:value={newTeamId}>
						<Select.Trigger id="person-team" class="h-8 w-full text-sm">
							{#snippet children()}
								{store.getTeam(newTeamId)?.name ?? 'Seleccionar...'}
							{/snippet}
						</Select.Trigger>
						<Select.Content>
							{#each store.teams as team (team.id)}
								<Select.Item value={team.id}>{team.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div>
				<span class="mb-1 block text-xs font-medium">Días no disponibles</span>
				<div class="flex gap-1.5">
					{#each days as day}
						<button
							type="button"
							class="h-7 rounded-md border px-2 text-xs transition-colors {newUnavailable.includes(day)
								? 'border-destructive bg-destructive/10 text-destructive'
								: 'hover:bg-muted'}"
							onclick={() => toggleDay(day)}
						>
							{DAY_NAMES[day].slice(0, 3)}
						</button>
					{/each}
				</div>
			</div>
			<Button size="sm" onclick={handleAdd} class="self-end">
				<UserPlus class="h-3.5 w-3.5" />
				Agregar Persona
			</Button>
		</div>

		<!-- People list grouped by team -->
		{#each store.teams as team (team.id)}
			{@const teamPeople = store.getPeopleByTeam(team.id)}
			{#if teamPeople.length > 0}
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center gap-2">
						<div
							class="h-3 w-3 shrink-0 rounded-full"
							style="background-color: {team.color}"
						></div>
						<span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							{team.name}
						</span>
					</div>
					{#each teamPeople as person (person.id)}
						<div class="flex items-center gap-2 rounded-md border p-2">
							<span class="flex-1 text-sm">{person.name}</span>
							<div class="flex gap-1">
								{#each days as day}
									{@const unavailable = person.unavailableDays.includes(day)}
									<span
										class="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] {unavailable
											? 'bg-destructive/10 text-destructive line-through'
											: 'bg-muted text-muted-foreground'}"
									>
										{DAY_NAMES[day].charAt(0)}
									</span>
								{/each}
							</div>
							<Button
								variant="ghost"
								size="icon-sm"
								onclick={() => store.removePerson(person.id)}
								class="h-7 w-7 text-muted-foreground hover:text-destructive"
							>
								<Trash2 class="h-3.5 w-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		{/each}
		{#if store.people.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">No hay personas configuradas</p>
		{/if}
	</Card.Content>
</Card.Root>
