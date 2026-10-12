"use client";

/**
 * Last-resort boundary, used when the root layout itself fails. It has to
 * render its own <html>, so it stays small and self-contained (EN + FR).
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#FAFAFD",
          color: "#14141A",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.1, margin: "0 0 1rem" }}>
            Something went wrong.
          </h1>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6, color: "#3A3A44" }}>
            An unexpected problem occurred. Please try again, or write to{" "}
            <a href="mailto:contact@levelup-ecosystem.com" style={{ color: "#5B21B6" }}>
              contact@levelup-ecosystem.com
            </a>
            .
          </p>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6, color: "#3A3A44" }}>
            Une erreur inattendue est survenue. Veuillez réessayer, ou écrire à
            l&apos;adresse ci-dessus.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: 0,
              borderRadius: 999,
              padding: "0.75rem 1.5rem",
              background: "#14141A",
              color: "#fff",
              fontSize: "1rem"
            }}
          >
            Try again / Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
