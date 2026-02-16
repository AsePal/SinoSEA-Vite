import { useOutletContext } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';
import ChatWindow from '../components/ChatWindow';

type LayoutContext = {
  user: UserInfo | null;
  refreshUser: () => void;
  activeConversationId: string | null;
  activeConversationTitle: string | null;
  setActiveConversationId: (id: string | null, title?: string | null) => void;
};

export default function Chat() {
  const { user, activeConversationId, activeConversationTitle, setActiveConversationId } =
    useOutletContext<LayoutContext>();

  return (
    <ChatWindow
      userAvatar={user?.avatar}
      isAuthed={Boolean(user)}
      conversationId={activeConversationId}
      conversationTitle={activeConversationTitle}
      onConversationIdChange={setActiveConversationId}
    />
  );
}
