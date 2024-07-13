import type { GatewayMessage } from '@/core/message';
import { describe, expect, test } from 'vitest';
import { validateMessage } from './service';

describe(validateMessage.name, () => {
	test('given empty string, returns "CONTENT_TOO_SHORT"', async () => {
		const message: GatewayMessage = { content: '' };

		const result = await validateMessage(message);

		expect(result).toEqual('CONTENT_TOO_SHORT');
	});

	test.each<[string]>([
		['foo'],
		['👍👍👍'],
		['This could be an emoji: :heart:'],
		['**ANGRY TEXT**'],
	])('given content "%p", returns "VALID"', async (content) => {
		const message: GatewayMessage = { content };

		const result = await validateMessage(message);

		expect(result).toEqual('VALID');
	});
});
