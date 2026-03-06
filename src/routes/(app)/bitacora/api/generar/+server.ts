import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { SYSTEM_PROMPT, MERGE_PROMPT } from '$lib/features/bitacora/prompt';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = env.OPENAI_API_KEY;

	if (!apiKey) {
		return json({ error: 'API key no configurada. Configure OPENAI_API_KEY.' }, { status: 500 });
	}

	const body = await request.json();
	const { texto, modo, bitacoras } = body as {
		texto?: string;
		modo: 'generar' | 'merge';
		bitacoras?: unknown[];
	};

	let userMessage: string;
	let systemPrompt: string;

	if (modo === 'merge' && bitacoras) {
		systemPrompt = MERGE_PROMPT;
		userMessage = `Combina las siguientes bitácoras en una sola:\n\n${JSON.stringify(bitacoras, null, 2)}`;
	} else if (texto) {
		systemPrompt = SYSTEM_PROMPT;
		userMessage = texto;
	} else {
		return json({ error: 'Se requiere texto o bitácoras para procesar.' }, { status: 400 });
	}

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userMessage }
			],
			temperature: 0.3,
			response_format: { type: 'json_object' }
		})
	});

	if (!response.ok) {
		const errorData = await response.text();
		console.error('OpenAI API error:', errorData);
		return json({ error: 'Error al procesar con IA. Verifique su API key.' }, { status: 502 });
	}

	const data = (await response.json()) as {
		choices: { message: { content: string } }[];
	};

	const content = data.choices[0]?.message?.content;

	if (!content) {
		return json({ error: 'Respuesta vacía de la IA.' }, { status: 502 });
	}

	const bitacora = JSON.parse(content);

	return json({ bitacora });
};
