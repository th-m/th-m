import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OWNER_EMAIL, OwnerLoginPage, type OwnerAuthClient } from "../src/routes/login.lazy";

function missingSession() {
  const error = new Error("Auth session missing");
  error.name = "AuthSessionMissingError";
  return error;
}

function authClient(overrides: Partial<OwnerAuthClient> = {}): OwnerAuthClient {
  return {
    getClaims: vi.fn().mockResolvedValue({ claims: null, error: missingSession() }),
    onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    signInWithMagicLink: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    ...overrides,
  };
}

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("owner login", () => {
  it("requests a magic link for only the fixed owner without creating a user", async () => {
    let finishRequest!: (value: { error: Error | null }) => void;
    const signInWithMagicLink = vi.fn().mockReturnValue(new Promise((resolve) => {
      finishRequest = resolve;
    }));
    const client = authClient({ signInWithMagicLink });
    const user = userEvent.setup();
    render(<OwnerLoginPage client={client} />);

    const button = await screen.findByRole("button", { name: "Email me a magic link" });
    expect(screen.getByDisplayValue(OWNER_EMAIL)).toHaveAttribute("readonly");
    await user.click(button);
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    expect(signInWithMagicLink).toHaveBeenCalledWith({
      email: "thomvaladez@gmail.com",
      redirectTo: `${window.location.origin}/login`,
      shouldCreateUser: false,
    });

    finishRequest({ error: null });
    expect(await screen.findByText(/Link sent/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send another link" })).toBeEnabled();
  });

  it("restores and verifies an owner session from an authentication callback", async () => {
    window.history.replaceState({}, "", "/login#access_token=fake&type=magiclink");
    const getClaims = vi.fn().mockResolvedValue({ claims: { email: OWNER_EMAIL }, error: null });
    render(<OwnerLoginPage client={authClient({ getClaims })} />);

    expect(await screen.findByText(/Signed in as/)).toHaveTextContent(OWNER_EMAIL);
    expect(getClaims).toHaveBeenCalledOnce();
    await waitFor(() => expect(window.location.href).not.toContain("access_token"));
    expect(window.location.pathname).toBe("/login");
  });

  it("reports an expired callback and removes its parameters from the address bar", async () => {
    window.history.replaceState({}, "", "/login?error_code=otp_expired&error_description=expired");
    render(<OwnerLoginPage client={authClient()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("link has expired");
    expect(window.location.search).toBe("");
    expect(screen.getByRole("button", { name: "Email me a magic link" })).toBeEnabled();
  });

  it("shows a generic verification error without exposing provider details", async () => {
    const providerError = new Error("internal provider detail");
    render(<OwnerLoginPage client={authClient({
      getClaims: vi.fn().mockRejectedValue(providerError),
    })} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("could not verify this login");
    expect(alert).not.toHaveTextContent(providerError.message);
  });

  it("recovers from a failed magic-link request", async () => {
    const client = authClient({
      signInWithMagicLink: vi.fn().mockRejectedValue(new Error("SMTP unavailable")),
    });
    const user = userEvent.setup();
    render(<OwnerLoginPage client={client} />);

    await user.click(await screen.findByRole("button", { name: "Email me a magic link" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("magic link could not be sent");
    expect(alert).not.toHaveTextContent("SMTP unavailable");
  });

  it("signs out an authenticated owner", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    const client = authClient({
      getClaims: vi.fn().mockResolvedValue({ claims: { email: OWNER_EMAIL }, error: null }),
      signOut,
    });
    const user = userEvent.setup();
    render(<OwnerLoginPage client={client} />);

    await user.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalledOnce();
    expect(await screen.findByRole("button", { name: "Email me a magic link" })).toBeEnabled();
  });
});
