import { GatewayMessage } from '../core/message';

export type IntegrationValidateResult =
	| 'CONTENT_TOO_SHORT'
	| 'CONTENT_TOO_LONG'
	| 'VALID';

export type Integration = {
	validate(message: GatewayMessage): Promise<IntegrationValidateResult>;
	publish(message: GatewayMessage): Promise<void>;
};
