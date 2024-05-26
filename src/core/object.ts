export async function mapValuesAsync<T extends object, TResult>(
	obj: T,
	iterator: (value: any, key: string) => Promise<TResult>,
) {
	const promises = Object.entries(obj).map(([key, value]) =>
		iterator(value, key).then((r) => [key, r]),
	);

	return Object.fromEntries(await Promise.all(promises));
}
