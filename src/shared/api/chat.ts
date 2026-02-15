import type {
  ChatConversationListResponse,
  ChatHistoryResponse,
} from '../../features/chat/types/chat.types';
import API, { apiRequest } from './config';

type FetchConversationParams = {
  limit?: number;
  lastId?: string;
};

type FetchMessagesParams = {
  conversationId: string;
  firstId?: string;
  limit?: number;
};

export async function fetchChatConversations(
  params: FetchConversationParams = {},
): Promise<ChatConversationListResponse> {
  const search = new URLSearchParams();
  if (params.limit) {
    search.set('limit', String(params.limit));
  }
  if (params.lastId) {
    search.set('last_id', params.lastId);
  }

  const query = search.toString();
  const url = query ? `${API.chat.conversations}?${query}` : API.chat.conversations;

  const res = await apiRequest(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error('CONVERSATION_LIST_FAILED');
  }

  return (await res.json()) as ChatConversationListResponse;
}

export async function fetchChatMessages(params: FetchMessagesParams) {
  const search = new URLSearchParams();
  search.set('conversation_id', params.conversationId);
  if (params.firstId) search.set('first_id', params.firstId);
  if (params.limit) search.set('limit', String(params.limit));

  const url = `${API.chat.messages}?${search.toString()}`;
  const res = await apiRequest(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error('CONVERSATION_MESSAGES_FAILED');
  }
  return (await res.json()) as ChatHistoryResponse;
}

export async function deleteChatConversation(conversationId: string) {
  const url = `${API.chat.conversations}/${conversationId}`;
  const res = await apiRequest(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('CONVERSATION_DELETE_FAILED');
  }
}
