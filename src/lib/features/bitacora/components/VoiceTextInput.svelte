<script lang="ts">
	import { Mic, MicOff, Send, Loader2 } from '@lucide/svelte';
	import { Button } from '$ui/button';
	import { Textarea } from '$ui/textarea';

	let {
		onsubmit,
		loading = false
	}: {
		onsubmit: (texto: string) => void;
		loading?: boolean;
	} = $props();

	let texto = $state('');
	let grabando = $state(false);
	let reconocimiento: SpeechRecognition | null = $state(null);
	let soportaVoz = $state(false);

	$effect(() => {
		soportaVoz = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
	});

	function iniciarGrabacion() {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		reconocimiento = new SpeechRecognition();
		reconocimiento.lang = 'es';
		reconocimiento.continuous = true;
		reconocimiento.interimResults = true;

		let textoFinal = texto;

		reconocimiento.onresult = (event: SpeechRecognitionEvent) => {
			let interim = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcripcion = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					textoFinal += (textoFinal ? ' ' : '') + transcripcion;
				} else {
					interim = transcripcion;
				}
			}
			texto = textoFinal + (interim ? ' ' + interim : '');
		};

		reconocimiento.onerror = () => {
			grabando = false;
		};

		reconocimiento.onend = () => {
			grabando = false;
		};

		reconocimiento.start();
		grabando = true;
	}

	function detenerGrabacion() {
		if (reconocimiento) {
			reconocimiento.stop();
			reconocimiento = null;
		}
		grabando = false;
	}

	function toggleGrabacion() {
		if (grabando) {
			detenerGrabacion();
		} else {
			iniciarGrabacion();
		}
	}

	function enviar() {
		if (texto.trim() && !loading) {
			onsubmit(texto.trim());
			texto = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			enviar();
		}
	}
</script>

<div class="flex flex-col gap-3">
	<div class="relative">
		<Textarea
			bind:value={texto}
			placeholder="Describe la visita al terreno... Escribe libremente o usa el micrófono 🎙️"
			class="min-h-[100px] resize-y pr-24 text-sm leading-relaxed"
			disabled={loading}
			onkeydown={handleKeydown}
		/>
		<div class="absolute right-2 bottom-2 flex gap-1">
			{#if soportaVoz}
				<Button
					variant={grabando ? 'destructive' : 'ghost'}
					size="icon"
					class="h-8 w-8"
					onclick={toggleGrabacion}
					disabled={loading}
				>
					{#if grabando}
						<MicOff class="h-4 w-4" />
					{:else}
						<Mic class="h-4 w-4" />
					{/if}
				</Button>
			{/if}
			<Button
				size="icon"
				class="h-8 w-8"
				onclick={enviar}
				disabled={!texto.trim() || loading}
			>
				{#if loading}
					<Loader2 class="h-4 w-4 animate-spin" />
				{:else}
					<Send class="h-4 w-4" />
				{/if}
			</Button>
		</div>
	</div>

	{#if grabando}
		<div class="flex items-center gap-2 text-xs text-red-500">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
			Grabando — habla y tu voz se transcribirá automáticamente
		</div>
	{/if}

	<p class="text-muted-foreground text-xs">
		Ctrl+Enter para enviar · Puedes ser informal, la IA organizará todo
	</p>
</div>
