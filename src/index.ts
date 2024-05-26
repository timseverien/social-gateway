import { GatewayMessage } from './core/message';
import { Integration } from './integrations/common';

export type PublishOptions = { integrations: Integration[] };

export async function publish(
	message: GatewayMessage,
	options: PublishOptions,
) {
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
