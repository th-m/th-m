import { createLazyFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./login.css";

export const OWNER_EMAIL = "thomvaladez@gmail.com";

type Claims = Record<string, unknown>;

export interface OwnerAuthClient {
  getClaims(): Promise<{ claims: Claims | null; error: Error | null }>;
  onAuthStateChange(callback: () => void): { unsubscribe(): void };
  signInWithMagicLink(input: {
    email: string;
    redirectTo: string;
    shouldCreateUser: boolean;
  }): Promise<{ error: Error | null }>;
  signOut(): Promise<{ error: Error | null }>;
}

type LoginState =
  | { kind: "initializing" }
  | { kind: "signed-out" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "authenticated"; email: string }
  | { kind: "expired-link" }
  | { kind: "error"; message: string };

let browserAuthClient: OwnerAuthClient | undefined;

function createBrowserAuthClient(): OwnerAuthClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase browser configuration is missing.");
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return {
    async getClaims() {
      const { data, error } = await supabase.auth.getClaims();
      return { claims: data?.claims ?? null, error };
    },
    onAuthStateChange(callback) {
      const { data } = supabase.auth.onAuthStateChange(() => callback());
      return { unsubscribe: () => data.subscription.unsubscribe() };
    },
    async signInWithMagicLink({ email, redirectTo, shouldCreateUser }) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo, shouldCreateUser },
      });
      return { error };
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };
}

function getBrowserAuthClient() {
  browserAuthClient ??= createBrowserAuthClient();
  return browserAuthClient;
}

function authCallback() {
  if (typeof window === "undefined") return { present: false, errorCode: null, errorDescription: null };
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const callbackKeys = ["access_token", "code", "error", "error_code", "expires_in", "refresh_token", "token_type", "type"];
  return {
    present: callbackKeys.some((key) => query.has(key) || fragment.has(key)),
    errorCode: query.get("error_code") ?? fragment.get("error_code") ?? query.get("error") ?? fragment.get("error"),
    errorDescription: query.get("error_description") ?? fragment.get("error_description"),
  };
}

function isExpiredError(error: { message?: string } | null, code?: string | null) {
  return /expired|otp_expired/i.test(`${code ?? ""} ${error?.message ?? ""}`);
}

function isMissingSession(error: { message?: string; name?: string } | null) {
  return error?.name === "AuthSessionMissingError" || /session missing/i.test(error?.message ?? "");
}

function cleanAuthCallbackUrl() {
  if (typeof window === "undefined") return;
  window.history.replaceState(window.history.state, "", window.location.pathname);
}

export function OwnerLoginPage({ client: suppliedClient }: { client?: OwnerAuthClient } = {}) {
  const [state, setState] = useState<LoginState>({ kind: "initializing" });
  const clientRef = useRef<OwnerAuthClient | null>(null);

  useEffect(() => {
    let active = true;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const callback = authCallback();

    try {
      clientRef.current = suppliedClient ?? getBrowserAuthClient();
    } catch {
      setState({ kind: "error", message: "Login is not configured for this deployment." });
      if (callback.present) cleanAuthCallbackUrl();
      return;
    }

    const auth = clientRef.current;
    const restoreSession = async () => {
      let result: Awaited<ReturnType<OwnerAuthClient["getClaims"]>>;
      try {
        result = await auth.getClaims();
      } catch {
        if (active) setState({ kind: "error", message: "We could not verify this login. Please request a new link." });
        return;
      }
      if (!active) return;
      const { claims, error } = result;

      if (claims) {
        const email = typeof claims.email === "string" ? claims.email : "";
        if (email.toLowerCase() !== OWNER_EMAIL) {
          await auth.signOut();
          if (active) setState({ kind: "error", message: "This login is restricted to the site owner." });
          return;
        }
        setState({ kind: "authenticated", email });
        return;
      }

      if (!error || isMissingSession(error)) {
        setState({ kind: "signed-out" });
      } else if (callback.present && isExpiredError(error, callback.errorCode)) {
        setState({ kind: "expired-link" });
      } else {
        setState({ kind: "error", message: "We could not verify this login. Please request a new link." });
      }
    };

    if (callback.errorCode) {
      setState(isExpiredError({ message: callback.errorDescription ?? "" }, callback.errorCode)
        ? { kind: "expired-link" }
        : { kind: "error", message: "This login link could not be used. Please request a new one." });
      cleanAuthCallbackUrl();
      return () => {
        active = false;
      };
    }

    void restoreSession().finally(() => {
      if (callback.present) cleanAuthCallbackUrl();
    });

    const subscription = auth.onAuthStateChange(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void restoreSession(), 0);
    });

    return () => {
      active = false;
      clearTimeout(refreshTimer);
      subscription.unsubscribe();
    };
  }, [suppliedClient]);

  const requestMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = clientRef.current;
    if (!auth) return;
    setState({ kind: "sending" });
    try {
      const { error } = await auth.signInWithMagicLink({
        email: OWNER_EMAIL,
        redirectTo: `${window.location.origin}/login`,
        shouldCreateUser: false,
      });
      setState(error
        ? { kind: "error", message: "The magic link could not be sent. Please try again." }
        : { kind: "sent" });
    } catch {
      setState({ kind: "error", message: "The magic link could not be sent. Please try again." });
    }
  };

  const signOut = async () => {
    const auth = clientRef.current;
    if (!auth) return;
    try {
      const { error } = await auth.signOut();
      setState(error
        ? { kind: "error", message: "Sign out failed. Please try again." }
        : { kind: "signed-out" });
    } catch {
      setState({ kind: "error", message: "Sign out failed. Please try again." });
    }
  };

  const isSending = state.kind === "sending";
  const canRequestLink = state.kind !== "initializing" && state.kind !== "authenticated";

  return (
    <main className="owner-login" aria-labelledby="owner-login-title">
      <section className="owner-login__panel">
        <p className="eyebrow">Private access</p>
        <h1 id="owner-login-title">Owner login</h1>

        {state.kind === "initializing" && <p role="status">Checking your session…</p>}
        {state.kind === "signed-out" && <p>Send a passwordless sign-in link to the owner account.</p>}
        {state.kind === "sending" && <p role="status">Requesting a secure sign-in link…</p>}
        {state.kind === "sent" && (
          <p role="status">Link sent. Check {OWNER_EMAIL} and open it in this browser.</p>
        )}
        {state.kind === "expired-link" && (
          <p className="owner-login__notice" role="alert">That link has expired. Request a fresh one below.</p>
        )}
        {state.kind === "error" && <p className="owner-login__notice" role="alert">{state.message}</p>}
        {state.kind === "authenticated" && (
          <p role="status">Signed in as <strong>{state.email}</strong>.</p>
        )}

        {canRequestLink && (
          <form className="owner-login__form" onSubmit={requestMagicLink}>
            <label htmlFor="owner-login-email">Owner account</label>
            <input id="owner-login-email" type="email" value={OWNER_EMAIL} readOnly />
            <button type="submit" disabled={isSending}>
              {isSending ? "Sending…" : state.kind === "sent" ? "Send another link" : "Email me a magic link"}
            </button>
          </form>
        )}

        {state.kind === "authenticated" && (
          <button className="owner-login__sign-out" type="button" onClick={signOut}>Sign out</button>
        )}
      </section>
    </main>
  );
}

export const Route = createLazyFileRoute("/login")({ component: OwnerLoginPage });
