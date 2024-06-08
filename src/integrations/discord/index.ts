import { Integration } from '../common.js';
import { createDiscordClient, sendMessage } from './client.js';
import { validateMessage } from './service.js';

type DiscordIntegrationOptions = {
	webhookId: string;
	webhookToken: string;
};

export function createDiscordIntegration(
	webhookOptions: DiscordIntegrationOptions,
): Integration {
	const client = createDiscordClient();

	return {
		validate: validateMessage,
		publish: (message) =>
			sendMessage(client, webhookOptions, {
				content: message.content,
				files:
					message.media?.map((m) => ({
						content: m.data,
						description: m.description,
						name: m.name,
					})) ?? [],
			}),
	};
}
