import { describe, test, vi } from 'vitest';
import { HttpClient, createHttpClient } from './http.client';

export function createMockHttpClient(
	get: HttpClient['get'] = () =>
		Promise.resolve(new Response(null, { status: 200 })),
	post: HttpClient['post'] = () =>
		Promise.resolve(new Response(null, { status: 200 })),
): HttpClient {
	return {
		get: vi.fn(get),
		post: vi.fn(post),
	};
}

describe(createHttpClient.name, () => {
	test.todo('given baseUrl, calls get() with concatinated URL');
});
