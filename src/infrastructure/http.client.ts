export type BaseRequestOptions = { headers?: Headers };
export type GetRequestOptions = BaseRequestOptions;
export type PostRequestOptions = BaseRequestOptions & {
	body?: RequestInit['body'];
};
export type RequestOptions = GetRequestOptions | PostRequestOptions;

export type HttpClient = {
	get(path: string, options?: GetRequestOptions): Promise<Response>;
	post(path: string, options?: PostRequestOptions): Promise<Response>;
};

export type BaseUrl = `${'http' | 'https'}://${string}`;

function mergeHeaders(a: Headers | undefined, b: Headers | undefined): Headers {
	return new Headers({
		...(a ? Object.fromEntries(a.entries()) : null),
		...(b ? Object.fromEntries(b.entries()) : null),
	});
}

function mergeRequestOptions<T extends RequestOptions>(a: T, b: T): T {
	const result = { ...a, ...b };

	if (a.headers || b.headers) {
		result.headers = mergeHeaders(a.headers, b.headers);
	}

	return result;
}

export function createHttpClient(
	baseUrl: BaseUrl,
	baseOptions: BaseRequestOptions = {},
): HttpClient {
	const request = (path: string, options: RequestInit) => {
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
