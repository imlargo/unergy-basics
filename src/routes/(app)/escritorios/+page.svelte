<script lang="ts">
	import TeamManager from '$lib/features/escritorios/components/TeamManager.svelte';
	import PeopleManager from '$lib/features/escritorios/components/PeopleManager.svelte';
	import DeskManager from '$lib/features/escritorios/components/DeskManager.svelte';
	import ScheduleView from '$lib/features/escritorios/components/ScheduleView.svelte';
	import * as Tabs from '$ui/tabs';
	import { Button } from '$ui/button';
	import { ArrowLeft, Monitor } from '@lucide/svelte';
</script>

<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/">
			<ArrowLeft class="h-4 w-4" />
		</Button>
		<div class="flex flex-col gap-1">
			<h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight">
				<Monitor class="h-6 w-6" />
				Asignación de Escritorios
			</h1>
			<p class="text-sm text-muted-foreground">
				Gestiona equipos, personas y escritorios, y genera horarios semanales optimizados.
			</p>
		</div>
	</div>

	<Tabs.Root value="schedule">
		<Tabs.List>
			<Tabs.Trigger value="schedule">Horario</Tabs.Trigger>
			<Tabs.Trigger value="teams">Equipos</Tabs.Trigger>
			<Tabs.Trigger value="people">Personas</Tabs.Trigger>
			<Tabs.Trigger value="desks">Escritorios</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="schedule">
			<ScheduleView />
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
