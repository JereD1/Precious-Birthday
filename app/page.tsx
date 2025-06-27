import FeedPage from './components/feed';
import Menu from '@/app/pages/menu';
import Event from '@/app/pages/event';

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-white text-gray-900">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-1/4 p-4 bg-gray-50 border-r border-gray-200 z-10">
        <Menu />
      </aside>


       {/* Main Feed */}
      <div className="ml-[35%] mr-[35%] h-full overflow-y-scroll no-scrollbar p-4 flex justify-center">
        <div className="w-full max-w-2xl">
          <FeedPage />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-1/4 p-4 bg-gray-50 border-l border-gray-200 z-10">
        <Event />
      </aside>

     
    </main>
  );
}
