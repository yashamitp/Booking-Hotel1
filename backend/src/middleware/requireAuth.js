const { requireAuth } = require("@clerk/express");

/**
 * Middleware that verifies the Clerk JWT token from the Authorization header.
 * Usage: router.post("/", requireClerkAuth, handler)
 *
 * Returns 401 if no valid session token is present.
 */
const requireClerkAuth = requireAuth({
  // signInUrl is optional — where to redirect on browser-based flows
  // For a pure API, the 401 JSON response is sufficient
});

module.exports = { requireClerkAuth };
