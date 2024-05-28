export type BaseRequestOptions = {
	headers?: Headers;
};
export type OverrideRequestOptions = BaseRequestOptions & {
	omitBaseHeaders?: string[];
};
export type GetRequestOptions = OverrideRequestOptions;
export type PostRequestOptions = OverrideRequestOptions & {
	body?: RequestInit['body'];
};
export type RequestOptions = GetRequestOptions | PostRequestOptions;

export type AbsoluteUrlPath = `/${string}`;

export type HttpClient = {
	get(path: AbsoluteUrlPath, options?: GetRequestOptions): Promise<Response>;
	post(path: AbsoluteUrlPath, options?: PostRequestOptions): Promise<Response>;
};

export function omitHeaders(headers: Headers | undefined, omit: string[]) {
	if (!headers) {
		return headers;
	}

	const entries = Array.from(headers.entries());
	const omitNormalized = omit.map((k) => k.toLocaleLowerCase());

	return new Headers(
		entries.filter(
			([key]) => !omitNormalized.includes(key.toLocaleLowerCase()),
		),
	);
}

export function mergeHeaders(
	a: Headers | undefined,
	b: Headers | undefined,
): Headers {
	return new Headers({
		...(a ? Object.fromEntries(a.entries()) : null),
		...(b ? Object.fromEntries(b.entries()) : null),
	});
}

export function mergeRequestOptions<T extends RequestOptions>(
	a: BaseRequestOptions,
	b: T,
): T {
	const result = { ...a, ...b };

	if (a.headers || b.headers) {
		const baseHeaders = b.omitBaseHeaders
			? omitHeaders(a.headers, b.omitBaseHeaders)
			: a.headers;

		result.headers = mergeHeaders(baseHeaders, b.headers);
	}

	return result;
}

export function createHttpClient(
	baseUrl: URL,
	baseOptions: BaseRequestOptions = {},
): HttpClient {
	const request = (path: AbsoluteUrlPath, options: RequestInit) => {
		const url = new URL(path, baseUrl);
		return fetch(url, options);
	};

	return {
		async get(path, options = {}) {
			return request(path, {
				...mergeRequestOptions(baseOptions, options),
				method: 'GET',
			});
		},

		async post(path, options = {}) {
			return request(path, {
				...mergeRequestOptions(baseOptions, options),
				method: 'POST',
			});
		},
	};
}
