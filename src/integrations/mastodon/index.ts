import type { Integration } from '@/integrations/common';
import { createMastodonClient, publishStatus, uploadMedia } from './client';
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
		async publish(message) {
			const media = await Promise.all(
				message.media?.map((m) =>
					uploadMedia(
						client,
						{},
						{
							file: m.data,
							description: m.description,
						},
					),
				) ?? [],
			);

			return publishStatus(
				client,
				{},
				{
					status: message.content,
					language: message.language,
					mediaIds: media.map((m) => m.id),
				},
			);
		},
	};
}
