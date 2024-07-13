import type { GatewayMessage } from '@/core/message';
import type { IntegrationValidateResult } from '@/integrations/common';
import * as path from 'node:path';

const SUPPORTED_MEDIA_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

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
