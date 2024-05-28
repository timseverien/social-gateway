import { checkbox, confirm, input } from '@inquirer/prompts';
import { compact } from 'lodash';
import { publish } from '../src';
import { Integration } from '../src/integrations/common';
import { createDiscordIntegration } from '../src/integrations/discord';
import { createMastodonIntegration } from '../src/integrations/mastodon';

async function getUrlContentAsBuffer(url: string) {
	const response = await fetch(url);
	return Buffer.from(await response.arrayBuffer());
}

const integrationListFormatter = new Intl.ListFormat('en', {
	type: 'conjunction',
});

const integrationMap: Map<string, Integration> = new Map([
	[
		'Discord',
		createDiscordIntegration({
			webhookId: process.env['DISCORD_WEBHOOK_ID']!,
			webhookToken: process.env['DISCORD_WEBHOOK_TOKEN']!,
		}),
	],
	[
		'Mastodon',
		createMastodonIntegration({
			accessToken: process.env['MASTODON_ACCESS_TOKEN']!,
			instanceUrl: process.env['MASTODON_INSTANCE_URL']!,
		}),
	],
]);

const integrations = await checkbox({
	message: 'Which integrations would you like to test?',
	choices: Array.from(integrationMap.keys()).map((key) => ({
		checked: false,
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

const media = await input({
	message: 'What image URL would you like to submit?',
});

const isConfirmed = await confirm({
	message: `Are you sure you want to publish ${message} via ${integrationListFormatter.format(integrations)}`,
	default: false,
});

if (isConfirmed) {
	const mediaFile = media ? await getUrlContentAsBuffer(media) : null;

	await publish(
		{
			content: message,
			media: mediaFile
				? [
						{
							data: mediaFile,
							description: 'foobar',
						},
					]
				: [],
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
