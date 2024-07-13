import { describe, expect, test } from 'vitest';
import { createMastodonIntegration } from './index';

describe(createMastodonIntegration.name, () => {
	test('does not throw', () => {
		const options = {
			instanceUrl: 'https://mastodon.social',
			accessToken: 'abc',
		};

		expect(() => createMastodonIntegration(options)).not.toThrow();
	});

	test('given invalid instance URL, throws', () => {
		const options = {
			instanceUrl: 'INVALID_URL',
			accessToken: 'abc',
		};

		expect(() => createMastodonIntegration(options)).toThrow();
	});
});
