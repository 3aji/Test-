import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
