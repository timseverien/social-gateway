import * as path from 'node:path';
import { GatewayMessage } from '../../core/message.js';
import { IntegrationValidateResult } from '../common.js';

const SUPPORTED_MEDIA_TYPES = ['jpg', 'jpeg', 'png'];

export async function validateMessage(
	message: GatewayMessage,
): Promise<IntegrationValidateResult> {
	if (message.content.length === 0) {
		return 'CONTENT_TOO_SHORT';
	}

	if (message.media) {
		for (const media of message.media) {
			if (
				!SUPPORTED_MEDIA_TYPES.includes(path.extname(media.name).substring(1))
			) {
				return 'MEDIA_UNSUPPORTED';
			}
		}

		if (message.media.length > 10) {
			return 'MEDIA_TOO_MANY';
		}
	}

	return 'VALID';
}
