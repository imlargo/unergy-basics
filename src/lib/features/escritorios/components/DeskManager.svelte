<script lang="ts">
	import { escritoriosStore } from '../stores/escritorios.svelte.js';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Badge } from '$ui/badge';
	import { Monitor, Plus, Trash2, LayoutGrid } from '@lucide/svelte';

	const store = escritoriosStore;

	let newLabel = $state('');
	let newRow = $state(0);
	let newCol = $state(0);

	function handleAdd() {
		const label = newLabel.trim();
		if (!label) return;
		store.addDesk(label, newRow, newCol);
		newLabel = '';
		newCol++;
	}

	// Compute grid for visual layout
	function getGrid(desks: typeof store.desks) {
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
</script>

<Card.Root class="border-border/60">
	<Card.Header class="border-b border-border/40 bg-primary/5">
		<Card.Title class="flex items-center gap-2">
			<Monitor class="h-4 w-4 text-primary" />
			Escritorios ({store.desks.length})
		</Card.Title>
		<Card.Description>Configura los escritorios y su disposición en la oficina</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-5 pt-4">
		<!-- Add form -->
		<div class="flex items-end gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
			<div class="flex-1">
				<label for="desk-label" class="mb-1 block text-xs font-medium text-muted-foreground">Etiqueta</label>
				<Input
					id="desk-label"
					bind:value={newLabel}
					placeholder="Ej: D1"
					class="h-8 text-sm"
					onkeydown={(e) => e.key === 'Enter' && handleAdd()}
				/>
			</div>
			<div class="w-20">
				<label for="desk-row" class="mb-1 block text-xs font-medium text-muted-foreground">Fila</label>
				<input
					id="desk-row"
					type="number"
					min="0"
					bind:value={newRow}
					class="h-8 w-full rounded-lg border border-border/60 bg-card/50 px-2 text-center text-sm"
				/>
			</div>
			<div class="w-20">
				<label for="desk-col" class="mb-1 block text-xs font-medium text-muted-foreground">Columna</label>
				<input
					id="desk-col"
					type="number"
					min="0"
					bind:value={newCol}
					class="h-8 w-full rounded-lg border border-border/60 bg-card/50 px-2 text-center text-sm"
				/>
			</div>
			<Button size="sm" onclick={handleAdd} class="h-8 gap-1.5">
				<Plus class="h-3.5 w-3.5" />
				Agregar
			</Button>
		</div>

		<!-- Visual grid -->
		{#if store.desks.length > 0}
			{@const { grid } = getGrid(store.desks)}
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<LayoutGrid class="h-3.5 w-3.5" />
					<span>Vista de la oficina</span>
				</div>
				<div class="flex flex-col gap-2.5 rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-5">
					{#each grid as row}
						<div class="flex gap-2.5">
							{#each row as cell}
								{#if cell}
									<div
										class="flex h-16 w-22 flex-col items-center justify-center rounded-xl border-2 border-primary/20 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
									>
										<Monitor class="mb-0.5 h-4 w-4 text-primary" />
										<span class="text-xs font-bold">{cell.label}</span>
									</div>
								{:else}
									<div class="h-16 w-22 rounded-xl border border-dashed border-border/20"></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Desk list -->
		<div class="flex flex-col gap-1.5">
			{#each store.desks as desk (desk.id)}
				<div class="flex items-center gap-3 rounded-xl border border-border/40 bg-card/80 p-2.5 transition-colors hover:bg-accent/30">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Monitor class="h-4 w-4 text-primary" />
					</div>
					<span class="flex-1 text-sm font-semibold">{desk.label}</span>
					<Badge variant="secondary" class="text-xs">
						Fila {desk.row}, Col {desk.col}
					</Badge>
					<Button
						variant="ghost"
						size="icon-sm"
						onclick={() => store.removeDesk(desk.id)}
						class="h-7 w-7 text-muted-foreground hover:text-destructive"
					>
						<Trash2 class="h-3.5 w-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
