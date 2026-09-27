import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Min konto – Eluxus",
  description: "Log ind for at se og administrere dine Eluxus bookinger.",
  robots: { index: false, follow: false },
};

export default function MinKontoPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
      <LoginForm />
    </main>
  );
}
