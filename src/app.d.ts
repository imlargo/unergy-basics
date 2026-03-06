import { User } from '$lib/domain/models';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			accessToken: string | undefined | null;
			refreshToken: string | undefined | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Web Speech API types
	interface SpeechRecognition extends EventTarget {
		lang: string;
		continuous: boolean;
		interimResults: boolean;
		onresult: ((event: SpeechRecognitionEvent) => void) | null;
		onerror: ((event: Event) => void) | null;
		onend: (() => void) | null;
		start(): void;
		stop(): void;
		abort(): void;
	}

	interface SpeechRecognitionEvent extends Event {
		resultIndex: number;
		results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionResultList {
		length: number;
		[index: number]: SpeechRecognitionResult;
	}

	interface SpeechRecognitionResult {
		isFinal: boolean;
		length: number;
		[index: number]: SpeechRecognitionAlternative;
	}

	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}

	interface Window {
		SpeechRecognition: new () => SpeechRecognition;
		webkitSpeechRecognition: new () => SpeechRecognition;
	}
}

export {};
