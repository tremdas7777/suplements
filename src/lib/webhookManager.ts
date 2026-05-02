// Legacy stub - kept for compatibility
export const listWebhooks = async (): Promise<any[]> => [];
export const addWebhook = async (_data: any): Promise<void> => {};
export const removeWebhook = async (_id: string): Promise<void> => {};
export const triggerWebhooks = async (_event: string, _payload: any): Promise<void> => {};
export default { listWebhooks, addWebhook, removeWebhook, triggerWebhooks };
