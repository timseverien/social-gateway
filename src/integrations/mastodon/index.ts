import { BaseUrl } from '../../infrastructure/http.client';
import { Integration } from '../common';
import { createMastodonClient, publishStatus } from './client';

type MastodonIntegrationOptions = {
	instanceUrl: BaseUrl;
	accessToken: string;
};

export function createMastodonIntegration(
	options: MastodonIntegrationOptions,
): Integration {
	const client = createMastodonClient(options.instanceUrl, {
		accessToken: options.accessToken,
	});

	return {
		async validate(message) {
			if (message.content.length === 0) {
				return 'CONTENT_TOO_SHORT';
			}

			return 'VALID';
		},

		async publish(message) {
			await publishStatus(client, {
				status: message.content,
			});
		},
	};
}
