import { GatewayMessage } from '../core/message';

export type IntegrationValidateResult =
	| 'CONTENT_TOO_LONG'
	| 'CONTENT_TOO_SHORT'
	| 'MEDIA_TOO_MANY'
	| 'MEDIA_UNSUPPORTED'
	| 'VALID';

export type Integration = {
	validate(message: GatewayMessage): Promise<IntegrationValidateResult>;
	publish(message: GatewayMessage): Promise<void>;
};
