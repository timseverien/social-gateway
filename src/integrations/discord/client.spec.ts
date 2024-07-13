import { createMockHttpClient } from '@/infrastructure/http.client.spec';
import { describe, expect, test } from 'vitest';
import { createDiscordClient, sendMessage } from './client';

describe(createDiscordClient.name, () => {
	test('does not throw', () => {
		expect(() => createDiscordClient()).not.toThrow();
	});
});

describe(sendMessage.name, () => {
	test("calls client.post('/api/webhooks/[ID]/[TOKEN]')", async () => {
		const client = createMockHttpClient();
		const webhookOptions = {
			webhookId: 'WEBHOOK_ID',
			webhookToken: 'WEBHOOK_TOKEN',
		};
		const message = 'Foobar';

		await sendMessage(client, webhookOptions, {
			content: message,
		});

		expect(client.post).toHaveBeenCalledWith(
			`/api/webhooks/${webhookOptions.webhookId}/${webhookOptions.webhookToken}`,
			expect.objectContaining({
				body: JSON.stringify({
					content: message,
				}),
			}),
		);
	});
});
