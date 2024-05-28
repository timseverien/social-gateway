import { HttpClient, createHttpClient } from '../../infrastructure/http.client';

type Payload = { content: string };
type PayloadWithFiles = {
	content: string;
	files: {
		name: string;
		description: string;
		content: Buffer;
	}[];
};

export function createDiscordClient(): HttpClient {
	const httpClient = createHttpClient(new URL('https://discord.com'), {
		headers: new Headers({
			'content-type': 'application/json',
		}),
	});

	return httpClient;
}

function isPayloadWithFiles(
	payload: Payload | PayloadWithFiles,
): payload is PayloadWithFiles {
	return 'files' in payload;
}

// See:https://discord.com/developers/docs/resources/webhook#execute-webhook
export async function sendMessage(
	client: HttpClient,
	options: {
		webhookId: string;
		webhookToken: string;
	},
	data: Payload | PayloadWithFiles,
) {
	if (isPayloadWithFiles(data) && data.files.length > 0) {
		return sendMessageWithFiles(client, options, data);
	}

	return sendMessageWithoutFiles(client, options, data);
}

async function sendMessageWithFiles(
	client: HttpClient,
	options: {
		webhookId: string;
		webhookToken: string;
	},
	data: PayloadWithFiles,
) {
	const formData = new FormData();

	for (const [index, file] of data.files.entries()) {
		formData.set(`files[${index}]`, new Blob([file.content]), file.name);
	}

	formData.set(
		'payload_json',
		JSON.stringify({
			content: data.content,
			attachments: data.files.map((file, index) => ({
				id: index,
				description: file.description,
				filename: file.name,
			})),
		}),
	);

	const response = await client.post(
		`/api/webhooks/${options.webhookId}/${options.webhookToken}`,
		{
			omitBaseHeaders: ['content-type'],
			body: formData,
		},
	);

	if (!response.ok) {
		console.log(response.status);
		console.log(await response.text());
		throw new Error('INTEGRATION_PUBLISH_FAILED');
	}
}

async function sendMessageWithoutFiles(
	client: HttpClient,
	options: {
		webhookId: string;
		webhookToken: string;
	},
	data: Payload,
) {
	const response = await client.post(
		`/api/webhooks/${options.webhookId}/${options.webhookToken}`,
		{
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		console.log(response.status);
		console.log(await response.text());
		throw new Error('INTEGRATION_PUBLISH_FAILED');
	}
}
