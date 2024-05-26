import { checkbox, confirm, input } from '@inquirer/prompts';
import { compact } from 'lodash';
import { publish } from '../src';
import { BaseUrl } from '../src/infrastructure/http.client';
import { Integration } from '../src/integrations/common';
import { createMastodonIntegration } from '../src/integrations/mastodon';

const integrationListFormatter = new Intl.ListFormat('en', {
	type: 'conjunction',
});

const integrationMap: Map<string, Integration> = new Map([
	[
		'Mastodon',
		createMastodonIntegration({
			accessToken: process.env['MASTODON_ACCESS_TOKEN']!,
			instanceUrl: process.env['MASTODON_INSTANCE_URL'] as BaseUrl,
		}),
	],
]);

const integrations = await checkbox({
	message: 'Which integrations would you like to test?',
	choices: Array.from(integrationMap.keys()).map((key) => ({
		checked: true,
		value: key,
	})),
});

if (integrations.length === 0) {
	console.log('No point in sending anything nowhere! Bye!');
	process.exit(0);
}

const message = await input({
	message: 'What would you like to say?',
});

const isConfirmed = await confirm({
	message: `Are you sure you want to publish ${message} via ${integrationListFormatter.format(integrations)}`,
	default: false,
});

if (isConfirmed) {
	await publish(
		{
			content: message,
		},
		{
			integrations: compact(
				integrations.map((name) => integrationMap.get(name)),
			),
		},
	);
	console.log('Perhaps you’ll go viral this time!');
} else {
	console.log('No worries, nothing was sent.');
}
