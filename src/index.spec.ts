import type { GatewayMessage } from '@/core/message';
import type { Integration } from '@/integrations/common';
import { describe, expect, test, vi } from 'vitest';
import { publish, type PublishOptions } from './index';

describe(publish.name, () => {
	test('calls integration validate', async () => {
		const message: GatewayMessage = {
			content: 'foobar',
		};
		const integration: Integration = {
			validate: vi.fn<Integration['validate']>((_) => Promise.resolve('VALID')),
			publish: vi.fn(),
		};
		const publishOptions: PublishOptions = {
			integrations: [integration],
		};

		await publish(message, publishOptions);

		expect(integration.validate).toHaveBeenCalledWith(message);
	});

	test('calls integration publish when all validation passes', async () => {
		const message: GatewayMessage = {
			content: 'foobar',
		};
		const integration1: Integration = {
			validate: vi.fn<Integration['validate']>((_) => Promise.resolve('VALID')),
			publish: vi.fn(),
		};
		const integration2: Integration = {
			validate: vi.fn<Integration['validate']>((_) => Promise.resolve('VALID')),
			publish: vi.fn(),
		};
		const publishOptions: PublishOptions = {
			integrations: [integration1, integration2],
		};

		await publish(message, publishOptions);

		expect(integration1.publish).toHaveBeenCalledWith(message);
		expect(integration2.publish).toHaveBeenCalledWith(message);
	});

	test('throws when validation fails', async () => {
		const message: GatewayMessage = {
			content: 'foobar',
		};
		const integration: Integration = {
			validate: vi.fn<Integration['validate']>((_) =>
				Promise.resolve('CONTENT_TOO_LONG'),
			),
			publish: vi.fn(),
		};
		const publishOptions: PublishOptions = {
			integrations: [integration],
		};

		expect(() => publish(message, publishOptions)).rejects.toThrowError(
			'MESSAGE_VALIDATION_ERROR',
		);
	});

	test('given message with invalid language code, throws', () => {
		const message: GatewayMessage = {
			content: 'foobar',
			language: 'fake',
		};
		const publishOptions: PublishOptions = {
			integrations: [],
		};

		expect(() => publish(message, publishOptions)).rejects.toThrowError(
			'MESSAGE_LANGUAGE_INVALID',
		);
	});

	test('does not call publish of any integration when validation of one of the integration fails', async () => {
		const message: GatewayMessage = {
			content: 'foobar',
		};
		const integration1: Integration = {
			validate: vi.fn<Integration['validate']>((_) => Promise.resolve('VALID')),
			publish: vi.fn(),
		};
		const integration2: Integration = {
			validate: vi.fn<Integration['validate']>((_) =>
				Promise.resolve('CONTENT_TOO_LONG'),
			),
			publish: vi.fn(),
		};
		const publishOptions: PublishOptions = {
			integrations: [integration1, integration2],
		};

		try {
			await publish(message, publishOptions);
		} catch {}

		expect(integration1.publish).not.toHaveBeenCalled();
		expect(integration2.publish).not.toHaveBeenCalled();
	});
});
