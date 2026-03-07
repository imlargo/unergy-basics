<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Badge } from '$ui/badge';
	import { Users, Plus, Trash2 } from '@lucide/svelte';

	const store = escritoriosStore;

	let newTeamName = $state('');
	let newTeamColor = $state('#8b5cf6');

	function handleAdd() {
		const name = newTeamName.trim();
		if (!name) return;
		store.addTeam(name, newTeamColor);
		newTeamName = '';
		newTeamColor = '#8b5cf6';
	}
</script>

<Card.Root class="border-border/60">
	<Card.Header class="border-b border-border/40 bg-primary/5">
		<Card.Title class="flex items-center gap-2">
			<Users class="h-4 w-4 text-primary" />
			Equipos ({store.teams.length})
		</Card.Title>
		<Card.Description>Gestiona los equipos de trabajo</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4 pt-4">
		<!-- Add form -->
		<div class="flex items-end gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
			<div class="flex-1">
				<label for="team-name" class="mb-1 block text-xs font-medium text-muted-foreground">Nombre</label>
				<Input
					id="team-name"
					bind:value={newTeamName}
					placeholder="Nombre del equipo"
					class="h-8 text-sm"
					onkeydown={(e) => e.key === 'Enter' && handleAdd()}
				/>
			</div>
			<div>
				<label for="team-color" class="mb-1 block text-xs font-medium text-muted-foreground">Color</label>
				<input
					id="team-color"
					type="color"
					bind:value={newTeamColor}
					class="h-8 w-12 cursor-pointer rounded-lg border border-border/60"
				/>
			</div>
			<Button size="sm" onclick={handleAdd} class="h-8 gap-1.5">
				<Plus class="h-3.5 w-3.5" />
				Agregar
			</Button>
		</div>

		<!-- Team list -->
		<div class="flex flex-col gap-2">
			{#each store.teams as team (team.id)}
				{@const memberCount = store.getPeopleByTeam(team.id).length}
				<div class="flex items-center gap-3 rounded-xl border border-border/40 bg-card/80 p-3 transition-colors hover:bg-accent/30">
					<div
						class="h-5 w-5 shrink-0 rounded-full shadow-sm"
						style="background-color: {team.color}"
					></div>
					<span class="flex-1 text-sm font-semibold">{team.name}</span>
					<Badge variant="secondary" class="text-xs">
						{memberCount} miembro{memberCount !== 1 ? 's' : ''}
					</Badge>
					<Button
						variant="ghost"
						size="icon-sm"
						onclick={() => store.removeTeam(team.id)}
						class="h-7 w-7 text-muted-foreground hover:text-destructive"
					>
						<Trash2 class="h-3.5 w-3.5" />
					</Button>
				</div>
			{/each}
			{#if store.teams.length === 0}
				<div class="py-8 text-center">
					<Users class="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
					<p class="text-sm text-muted-foreground">No hay equipos configurados</p>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
