import { useAuthGuard } from '../hooks/useAuthGuard';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  useAuthGuard();

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('/images/chat-bg.webp')] bg-cover bg-center bg-fixed">
      <TopNav />

      <div className="flex pt-17.5">
        <Sidebar />
        <main className="flex-1 p-4">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
