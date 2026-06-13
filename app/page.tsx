"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (userId) router.push('/dashboard');
  }, [isLoaded, userId, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-24 px-6 bg-white dark:bg-black">
        <div className="w-full flex flex-col-reverse gap-10 items-center md:flex-row md:items-center md:gap-20">
          <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl font-extrabold leading-tight text-black dark:text-zinc-50">
              Fast, simple URL shortening for teams and creators
            </h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Create memorable short links, track clicks and analytics, and
              manage custom aliases — all from a clean dashboard and a
              developer-friendly API.
            </p>

            <div className="mt-6 flex w-full max-w-xs gap-3 md:max-w-none md:justify-start">
              <SignUpButton>
                <Button className="w-full">Get started — it's free</Button>
              </SignUpButton>

              <Button asChild variant="outline">
                <a href="/docs" className="w-full flex items-center justify-center">
                  View docs
                </a>
              </Button>
            </div>

            <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4 bg-input/30">
                <h3 className="font-semibold">Short links</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Generate short, shareable URLs in seconds.</p>
              </div>
              <div className="rounded-xl border p-4 bg-input/30">
                <h3 className="font-semibold">Analytics</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Real-time click tracking and referrer insights.</p>
              </div>
              <div className="rounded-xl border p-4 bg-input/30">
                <h3 className="font-semibold">Custom aliases</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Use your brand with custom domains and slugs.</p>
              </div>
              <div className="rounded-xl border p-4 bg-input/30">
                <h3 className="font-semibold">Developer API</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Integrate easily with a simple REST API.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Image src="/file.svg" alt="App preview" width={520} height={320} className="rounded-lg shadow-lg object-cover"/>
          </div>
        </div>
      </main>
    </div>
  );
}
