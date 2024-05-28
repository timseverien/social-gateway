import { describe, expect, test, vi } from 'vitest';
import {
	HttpClient,
	RequestOptions,
	mergeHeaders,
	mergeRequestOptions,
} from './http.client';

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

describe(mergeHeaders.name, () => {
	test.each<[Headers, Headers | undefined, Headers]>([
		[
			new Headers({
				'content-type': 'application/json',
				'x-one': 'foo',
			}),
			new Headers({
				'content-type': 'application/json',
				'x-two': 'foo',
			}),
			new Headers({
				'content-type': 'application/json',
				'x-one': 'foo',
				'x-two': 'foo',
			}),
		],
		[
			new Headers({
				'content-type': 'application/json',
				'x-one': 'foo',
			}),
			undefined,
			new Headers({
				'content-type': 'application/json',
				'x-one': 'foo',
			}),
		],
	])(
		'returns merged headers',
		(headersBase, headersOverride, expectedResult) => {
			const result = mergeHeaders(headersBase, headersOverride);

			expect(result).toEqual(expectedResult);
		},
	);
});

describe(mergeRequestOptions.name, () => {
	test.each<[RequestOptions, RequestOptions, RequestOptions]>([
		// Override
		[
			{
				body: 'foo',
			},
			{
				body: 'bar',
			},
			{
				body: 'bar',
			},
		],

		// Merge headers
		[
			{
				headers: new Headers({
					'content-type': 'application/json',
					'x-one': 'foo',
				}),
				body: 'foo',
			},
			{
				headers: new Headers({
					'x-two': 'foo',
				}),
				body: 'bar',
			},
			{
				headers: new Headers({
					'content-type': 'application/json',
					'x-one': 'foo',
					'x-two': 'foo',
				}),
				body: 'bar',
			},
		],
	])(
		'returns merged request options',
		(requestOptionsBase, requestOptionsOverride, expectedResult) => {
			const result = mergeRequestOptions(
				requestOptionsBase,
				requestOptionsOverride,
			);

			expect(result).toEqual(expectedResult);
		},
	);
});
