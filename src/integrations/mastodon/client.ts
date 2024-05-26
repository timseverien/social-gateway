import {
	BaseUrl,
	HttpClient,
	createHttpClient,
} from '../../infrastructure/http.client';

export function createMastodonClient(
	mastodonUrl: BaseUrl,
	clientOptions: { accessToken: string },
): HttpClient {
	const httpClient = createHttpClient(mastodonUrl, {
		headers: new Headers({
			Authorization: `Bearer ${clientOptions.accessToken}`,
			'Content-Type': 'application/json',
		}),
	});

	return httpClient;
}

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
