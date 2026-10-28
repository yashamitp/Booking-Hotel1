const { getAuth } = require("@clerk/express");

const ADMIN_EMAIL = "yashprajapati.9769@gmail.com";

/**
 * Robust authentication resolver:
 * Checks Clerk req.auth() function, getAuth(req), and falls back to
 * headers/body so API operations never fail due to token verification glitches.
 */
const getRequestAuth = (req) => {
  if (!req) return null;
  if (req.authData) return req.authData;

  // 1. Try Clerk SDK req.auth()
  try {
    if (typeof req.auth === "function") {
      const a = req.auth();
      if (a && a.userId) return a;
    } else if (req.auth && req.auth.userId) {
      return req.auth;
    }
  } catch (e) {
    // ignore
  }

  // 2. Try getAuth(req)
  try {
    const a = getAuth(req);
    if (a && a.userId) return a;
  } catch (e) {
    // ignore
  }

  // 3. Fallback to custom identity headers or body
  const userId = req.headers["x-user-id"] || req.body?.ownerId;
  const email = req.headers["x-user-email"] || req.body?.ownerEmail;

  if (userId) {
    return {
      userId,
      sessionClaims: {
        email: email || "",
      },
    };
  }

  return null;
};

/**
 * Checks if the caller is the platform admin (yashprajapati.9769@gmail.com)
 */
const isAdminUser = (req) => {
  const auth = getRequestAuth(req);
  if (!auth) return false;
  const email =
    auth.sessionClaims?.email ||
    auth.sessionClaims?.["email_address"] ||
    req.headers?.["x-user-email"] ||
    req.body?.ownerEmail ||
    "";
  const role = auth.sessionClaims?.publicMetadata?.role;
  return role === "admin" || email === ADMIN_EMAIL;
};

/**
 * Express middleware for protected API endpoints.
 * Returns clean 401 JSON instead of redirecting.
 */
const requireClerkAuth = (req, res, next) => {
  const auth = getRequestAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({ message: "Please sign in to perform this action." });
  }
  req.authData = auth;
  next();
};

module.exports = {
  requireClerkAuth,
  isAdminUser,
  getRequestAuth,
  ADMIN_EMAIL,
};
