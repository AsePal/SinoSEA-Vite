import { useOutletContext } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';
import ChatWindow from '../components/ChatWindow';

type LayoutContext = {
  user: UserInfo | null;
  refreshUser: () => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
};

export default function Chat() {
  const { user, activeConversationId, setActiveConversationId } = useOutletContext<LayoutContext>();

  return (
    <ChatWindow
      userAvatar={user?.avatar}
      conversationId={activeConversationId}
      onConversationIdChange={setActiveConversationId}
    />
  );
}
