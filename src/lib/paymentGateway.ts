// Legacy stub - kept for compatibility
export const getActiveGateway = async (): Promise<string> => "stripe";
export const getGatewayCredentials = async (): Promise<any> => ({});
export const setActiveGateway = async (_gateway: string): Promise<void> => {};
export const updateGatewayCredentials = async (_creds: any): Promise<void> => {};
export default { getActiveGateway, getGatewayCredentials, setActiveGateway, updateGatewayCredentials };
