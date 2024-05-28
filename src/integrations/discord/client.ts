import { HttpClient, createHttpClient } from '../../infrastructure/http.client';

export function createDiscordClient(): HttpClient {
	const httpClient = createHttpClient(new URL('https://discord.com'), {
		headers: new Headers({
			'Content-Type': 'application/json',
		}),
	});

	return httpClient;
}

export async function sendMessage(
	client: HttpClient,
	options: {
		webhookId: string;
		webhookToken: string;
	},
	data: {
		content: string;
	},
) {
	const response = await client.post(
		`/api/webhooks/${options.webhookId}/${options.webhookToken}`,
		{
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		console.log(response.status);
		console.log(response.statusText);
		console.log(await response.text());

		throw new Error('INTEGRATION_PUBLISH_FAILED');
	}
}
