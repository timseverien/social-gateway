import { describe, expect, test } from 'vitest';
import { createMockHttpClient } from '../../infrastructure/http.client.spec';
import { publishStatus } from './client';

describe(publishStatus.name, () => {
	test("calls client.post('/api/v1/statuses')", async () => {
		const client = createMockHttpClient();
		const status = 'Foobar';

		await publishStatus(client, {
			status,
		});

		expect(client.post).toHaveBeenCalledWith(
			'/api/v1/statuses',
			expect.objectContaining({
				body: JSON.stringify({
					status,
				}),
			}),
		);
	});
});
