import { Integration } from '../common';
import { createDiscordClient, executeWebhook } from './client';

type DiscordIntegrationOptions = {
	webhookId: string;
	webhookToken: string;
};

export function createDiscordIntegration(
	webhookOptions: DiscordIntegrationOptions,
): Integration {
	const client = createDiscordClient();

	return {
		async validate(message) {
			if (message.content.length === 0) {
				return 'CONTENT_TOO_SHORT';
			}

			return 'VALID';
		},

		async publish(message) {
			await executeWebhook(client, webhookOptions, {
				content: message.content,
			});
		},
	};
}
