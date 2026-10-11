import { createSafeActionClient } from "next-safe-action";

import { FormError, GENERIC_FORM_ERROR } from "@/lib/form-guard";

/**
 * Server actions never leak internals: only messages deliberately thrown as
 * `FormError` reach the visitor, everything else (database, e-mail provider,
 * stack traces) is logged on the server and answered with a generic message.
 */
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof FormError) return error.message;
    // eslint-disable-next-line no-console
    console.error("[server-action]", error);
    return GENERIC_FORM_ERROR;
  },
});
