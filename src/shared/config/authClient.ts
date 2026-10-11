import { getAuth } from "firebase/auth";
import { getFirebaseApp, getFirebaseMissingEnv } from "./firebase";
import { setAuthToken } from "../lib/authToken";

export const getAuthClient = () => {
  const app = getFirebaseApp();
  if (!app) {
    const missing = getFirebaseMissingEnv();
    throw new Error(`Firebase env is missing: ${missing.join(", ")}`);
  }
  return getAuth(app);
};

/**
 * Waits until Firebase has restored the persisted session (IndexedDB) and
 * stores a valid ID token for it via `authToken`. `auth.currentUser` is
 * `null` until restoration finishes, so anything that decides "logged in or
 * not" on app start must await this first. `getIdToken()` transparently
 * refreshes an expired token via the refresh token. Returns `null` (and
 * clears the cached token) if there is no persisted Firebase session.
 */
export const restoreAuthSession = async (): Promise<string | null> => {
  try {
    const auth = getAuthClient();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) {
      setAuthToken(null);
      return null;
    }

    const token = await user.getIdToken();
    setAuthToken(token);
    return token;
  } catch {
    return null;
  }
};

/**
 * Forces Firebase to mint a brand new ID token for the current user and
 * stores it via `authToken`. Used as the reactive fallback when the API
 * rejects a request with 401 because the cached token has expired.
 * Returns `null` if there is no signed-in user or the refresh fails.
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const auth = getAuthClient();
    // On a cold page load currentUser is still null until Firebase
    // restores the persisted session; without this wait the retry is
    // skipped and an expired cached token ends the session.
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) return null;

    const token = await user.getIdToken(true);
    setAuthToken(token);
    return token;
  } catch {
    return null;
  }
};
