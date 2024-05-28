import { GatewayMessage } from '../../core/message';
import { IntegrationValidateResult } from '../common';

export async function validateMessage(
	message: GatewayMessage,
): Promise<IntegrationValidateResult> {
	if (message.content.length === 0) {
		return 'CONTENT_TOO_SHORT';
	}

	return 'VALID';
}
