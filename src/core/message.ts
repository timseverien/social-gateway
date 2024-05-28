export type GatewayMessageImage = {
	data: Buffer;
	description: string;
};

export type GatewayMessageMedia = GatewayMessageImage;

export type GatewayMessage = {
	content: string;
	language?: string;
	media?: GatewayMessageMedia[];
};
