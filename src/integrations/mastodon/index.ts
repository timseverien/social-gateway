import { Integration } from '../common';
import { createMastodonClient, publishStatus } from './client';
import { validateMessage } from './service';

type MastodonIntegrationOptions = {
	instanceUrl: string;
	accessToken: string;
};

export function createMastodonIntegration(
	options: MastodonIntegrationOptions,
): Integration {
	const client = createMastodonClient(options.instanceUrl, {
		accessToken: options.accessToken,
	});

	return {
		validate: validateMessage,
		publish: (message) =>
			publishStatus(
				client,
				{},
				{
					status: message.content,
					language: message.language,
				},
			),
	};
}
