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
	options: {
		idempotencyKey?: string;
	},
	data: {
		language?: string;
		mediaIds?: string[];
		status: string;
	},
) {
	const headers = new Headers();

	if (options.idempotencyKey) {
		headers.set('Idempotency-Key', options.idempotencyKey);
	}

	const response = await client.post('/api/v1/statuses', {
		headers,
		body: JSON.stringify({
			status: data.status,
			...(data.language ? { language: data.language } : null),
			...(data.mediaIds?.length ? { media_ids: data.mediaIds } : null),
		}),
	});

	if (!response.ok) {
		console.log(response.status);
		console.log(await response.text());
		throw new Error('INTEGRATION_PUBLISH_FAILED');
	}
}

export async function uploadMedia(
	client: HttpClient,
	options: {
		idempotencyKey?: string;
	},
	data: {
		file: Buffer;
		description: string;
	},
): Promise<{ id: string }> {
	const headers = new Headers();

	if (options.idempotencyKey) {
		headers.set('idempotency-key', options.idempotencyKey);
	}

	const formData = new FormData();
	formData.set('file', new Blob([data.file]));
	formData.set('description', data.description);

	const response = await client.post('/api/v2/media', {
		omitBaseHeaders: ['content-type'],
		headers,
		body: formData,
	});

	if (!response.ok) {
		console.log(response.status);
		console.log(await response.text());
		throw new Error('INTEGRATION_MEDIA_UPLOAD_FAILED');
	}

	const { id } = (await response.json()) as { id: string };

	return {
		id,
	};
}
