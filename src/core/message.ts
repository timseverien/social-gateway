export type GatewayMessageImage = {
	data: Buffer;
	name: string;
	description: string;
};

export type GatewayMessageMedia = GatewayMessageImage;

export type GatewayMessage = {
	content: string;
	language?: string;
	media?: GatewayMessageMedia[];
};
