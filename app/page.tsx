import FeedPage from './components/feed';
import Menu from '@/app/pages/menu';
import Event from '@/app/pages/event';


export default function Home() {
  return (
    <main className="flex flex-row">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 flex flex-col justify-center items-center bg-gray-100">
        {/* Add content for left sidebar here */}
        <Menu />
      </div>

      {/* Main Feed */}
      <div className="w-1/2 p-4">
        <FeedPage />
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 p-4 flex flex-col justify-center items-center bg-gray-100">
        {/* Add content for right sidebar here */}
        <Event />
      </div>
    </main>
  );
}