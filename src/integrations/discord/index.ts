import { Integration } from '../common';
import { createDiscordClient, sendMessage } from './client';
import { validateMessage } from './service';

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
			}),
	};
}
