import type { ReactNode } from "react";
import { BackLink } from "./BackLink";
import { Header } from "./Header";

type PageProps = {
  title: string;
  // Every page except My trips says where "back" goes.
  back?: { href: string; label: string };
  children: ReactNode;
};

export function Page({ title, back, children }: PageProps) {
  return (
    <>
      {/* Only My trips has no back link: it's home. */}
      <Header title={title} isHome={!back} />
      <main className="mx-auto flex w-full max-w-225 flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        {back && (
          <div className="-mt-2">
            <BackLink href={back.href}>{back.label}</BackLink>
          </div>
        )}
        {children}
      </main>
    </>
  );
}
