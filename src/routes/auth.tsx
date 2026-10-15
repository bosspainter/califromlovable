import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { CompanyBrand } from "@/components/company-brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in | Calipro Painting" },
      { name: "description", content: "Sign in to manage the Calipro Painting website." },
      { property: "og:title", content: "Admin sign in — Calipro Painting" },
      { property: "og:description", content: "Owner sign in for the Calipro Painting website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/admin", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function signIn() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) {
      toast.error("Sign-in failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-secondary/60 px-6 font-body">
      <CompanyBrand />
      <div className="w-full max-w-sm rounded-lg bg-card p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-bold">Admin panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with your Google account to manage the website.</p>
        <Button className="mt-6 w-full" onClick={signIn} disabled={busy}>{busy ? "Opening Google…" : "Continue with Google"}</Button>
      </div>
    </div>
  );
}
