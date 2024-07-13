import type { GatewayMessage } from '@/core/message';
import type { Integration } from '@/integrations/common';
import iso639 from 'iso-639-1';

export type PublishOptions = { integrations: Integration[] };

export async function publish(
	message: GatewayMessage,
	options: PublishOptions,
) {
	if (message.language && !iso639.validate(message.language)) {
		throw new Error('MESSAGE_LANGUAGE_INVALID');
	}

	const validationResults = await Promise.all(
		options.integrations.map((integration) => integration.validate(message)),
	);

	const hasValidationError = validationResults.some(
		(result) => result !== 'VALID',
	);

	// Currently uses an all-or-nothing strategy - if validation fails for one integration, no message is sent
	if (hasValidationError) {
		console.log(validationResults);
		throw new Error('MESSAGE_VALIDATION_ERROR');
	}

	await Promise.all(options.integrations.map((i) => i.publish(message)));
}

export * from '@/integrations/discord';
export * from '@/integrations/mastodon';
