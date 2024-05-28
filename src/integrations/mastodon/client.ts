import { HttpClient, createHttpClient } from '../../infrastructure/http.client';

export function createMastodonClient(
	instanceUrl: string,
	clientOptions: { accessToken: string },
): HttpClient {
	const url = new URL(instanceUrl);

	return createHttpClient(url, {
		headers: new Headers({
			Authorization: `Bearer ${clientOptions.accessToken}`,
			'Content-Type': 'application/json',
		}),
	});
}

// See: https://docs.joinmastodon.org/methods/statuses/#create
export async function publishStatus(
	client: HttpClient,
	data: {
		status: string;
		idempotencyKey?: string;
	},
) {
	const headers = new Headers();

	if (data.idempotencyKey) {
		headers.set('Idempotency-Key', data.idempotencyKey);
	}

	const response = await client.post('/api/v1/statuses', {
		headers,
		body: JSON.stringify({
			status: data.status,
		}),
	});

	if (!response.ok) {
		console.log(response.status);
		console.log(response.statusText);
		console.log(await response.text());

		throw new Error('INTEGRATION_PUBLISH_FAILED');
	}
}
