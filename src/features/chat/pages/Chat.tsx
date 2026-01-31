import { useOutletContext } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';
import ChatWindow from '../components/ChatWindow';

type LayoutContext = {
  user: UserInfo | null;
  refreshUser: () => void;
};

export default function Chat() {
  const { user } = useOutletContext<LayoutContext>();

  return <ChatWindow userAvatar={user?.avatar} />;
}
