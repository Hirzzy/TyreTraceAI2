
import Link from "next/link";

export default function SelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         <Link href="/dashboard">
            <span className="font-bold text-xl text-primary">TyreTrace AI</span>
         </Link>
       </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
