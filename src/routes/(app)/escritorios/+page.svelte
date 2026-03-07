<script lang="ts">
	import TeamManager from '$lib/features/escritorios/components/TeamManager.svelte';
	import PeopleManager from '$lib/features/escritorios/components/PeopleManager.svelte';
	import DeskManager from '$lib/features/escritorios/components/DeskManager.svelte';
	import ScheduleView from '$lib/features/escritorios/components/ScheduleView.svelte';
	import DeskDistribution from '$lib/features/escritorios/components/DeskDistribution.svelte';
	import * as Tabs from '$ui/tabs';
	import { Badge } from '$ui/badge';
	import { Monitor, CalendarDays, Users, User, LayoutGrid, MapPin } from '@lucide/svelte';
	import { escritoriosStore } from '$lib/features/escritorios/stores/escritorios.svelte.js';

	const store = escritoriosStore;
</script>

<div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
	<!-- Header -->
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
				<Monitor class="h-5 w-5 text-primary" />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight">Asignación de Escritorios</h1>
				<p class="text-sm text-muted-foreground">
					Gestiona equipos, personas y escritorios, y genera horarios semanales optimizados.
				</p>
			</div>
		</div>
	</div>

	<!-- Stats overview -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
				<Users class="h-4 w-4 text-blue-500" />
			</div>
			<div>
				<p class="text-lg font-bold">{store.teams.length}</p>
				<p class="text-xs text-muted-foreground">Equipos</p>
			</div>
		</div>
		<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
				<User class="h-4 w-4 text-purple-500" />
			</div>
			<div>
				<p class="text-lg font-bold">{store.people.length}</p>
				<p class="text-xs text-muted-foreground">Personas</p>
			</div>
		</div>
		<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/10">
				<LayoutGrid class="h-4 w-4 text-fuchsia-500" />
			</div>
			<div>
				<p class="text-lg font-bold">{store.desks.length}</p>
				<p class="text-xs text-muted-foreground">Escritorios</p>
			</div>
		</div>
		<div class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
				<CalendarDays class="h-4 w-4 text-emerald-500" />
			</div>
			<div>
				<p class="text-lg font-bold">{store.schedule ? Math.round(store.getOverallOccupancyRate() * 100) + '%' : '—'}</p>
				<p class="text-xs text-muted-foreground">Ocupación</p>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<Tabs.Root value="schedule">
		<Tabs.List class="w-full justify-start">
			<Tabs.Trigger value="schedule" class="gap-1.5">
				<CalendarDays class="h-3.5 w-3.5" />
				Horario
			</Tabs.Trigger>
			<Tabs.Trigger value="distribution" class="gap-1.5">
				<MapPin class="h-3.5 w-3.5" />
				Distribución
				{#if store.schedule}
					<Badge variant="secondary" class="ml-1 h-5 px-1.5 text-[10px]">Live</Badge>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger value="teams" class="gap-1.5">
				<Users class="h-3.5 w-3.5" />
				Equipos
				<Badge variant="secondary" class="ml-1 h-5 px-1.5 text-[10px]">{store.teams.length}</Badge>
			</Tabs.Trigger>
			<Tabs.Trigger value="people" class="gap-1.5">
				<User class="h-3.5 w-3.5" />
				Personas
				<Badge variant="secondary" class="ml-1 h-5 px-1.5 text-[10px]">{store.people.length}</Badge>
			</Tabs.Trigger>
			<Tabs.Trigger value="desks" class="gap-1.5">
				<LayoutGrid class="h-3.5 w-3.5" />
				Escritorios
				<Badge variant="secondary" class="ml-1 h-5 px-1.5 text-[10px]">{store.desks.length}</Badge>
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="schedule">
			<ScheduleView />
		</Tabs.Content>

		<Tabs.Content value="distribution">
			<DeskDistribution />
		</Tabs.Content>

		<Tabs.Content value="teams">
			<TeamManager />
		</Tabs.Content>

		<Tabs.Content value="people">
			<PeopleManager />
		</Tabs.Content>

		<Tabs.Content value="desks">
			<DeskManager />
		</Tabs.Content>
	</Tabs.Root>
</div>
