import { describe, expect, test } from 'vitest';
import { createMockHttpClient } from '../../infrastructure/http.client.spec';
import { createMastodonClient, publishStatus } from './client';

describe(createMastodonClient.name, () => {
	test('does not throw', () => {
		const mastodonUrl = 'https://mastodon.social';
		const clientOptions = { accessToken: 'abc' };

		expect(() =>
			createMastodonClient(mastodonUrl, clientOptions),
		).not.toThrow();
	});

	test('given invalid Mastodon URL, throws', () => {
		const mastodonUrl = 'NOT_AN_URL';
		const clientOptions = { accessToken: 'abc' };

		expect(() => createMastodonClient(mastodonUrl, clientOptions)).toThrow();
	});
});

describe(publishStatus.name, () => {
	test("calls client.post('/api/v1/statuses')", async () => {
		const client = createMockHttpClient();
		const message = 'Foobar';

		await publishStatus(
			client,
			{},
			{
				status: message,
			},
		);

		expect(client.post).toHaveBeenCalledWith(
			'/api/v1/statuses',
			expect.objectContaining({
				body: JSON.stringify({
					status: message,
				}),
			}),
		);
	});
});
