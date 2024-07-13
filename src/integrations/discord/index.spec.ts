import { describe, expect, test } from 'vitest';
import { createDiscordIntegration } from './index';

describe(createDiscordIntegration.name, () => {
	test('does not throw', () => {
		const options = {
			webhookId: 'WEBHOOK_ID',
			webhookToken: 'WEBHOOK_TOKEN',
		};

		expect(() => createDiscordIntegration(options)).not.toThrow();
	});
});
