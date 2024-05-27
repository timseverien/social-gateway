import { createDiscordIntegration } from './discord';
import { createMastodonIntegration } from './mastodon';

export const integrations = [
	createDiscordIntegration,
	createMastodonIntegration,
];
