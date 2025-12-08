// IMPLEMENTATION DETAIL
const conversations = new Map<string, string>();

// PUBLIC INTERFACE
export const conversationHistory = {
   getLastResponseId(conversationId: string): string | undefined {
      return conversations.get(conversationId);
   },

   setLastResponseId(conversationId: string, responseId: string): void {
      conversations.set(conversationId, responseId);
   },
};
