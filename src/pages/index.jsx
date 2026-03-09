import Head from "next/head";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>ITZFIZZ - Premium Animation</title>
        <meta name="description" content="Cinematic scroll-based hero animation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* We place the hero section here */}
        <HeroSection />
        
        {/* Placeholder for content below fold to allow scrolling */}
        <div className="h-[200vh] w-full bg-black flex items-center justify-center border-t border-gray-800">
          <p className="text-gray-500 font-sans tracking-widest text-sm uppercase">Scroll Down For More Magic</p>
        </div>
      </main>
    </>
  );
}
