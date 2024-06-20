import Header from "./components/header";
import Wishes from "./components/wishes";
import Image from 'next/image';

export default function Home() {
  return (
    <main >
      <Header />
      <Wishes />
    </main>
  );
}
