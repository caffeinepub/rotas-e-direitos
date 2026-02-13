import { useInternetIdentity } from './useInternetIdentity';

export function useCurrentUser() {
  const { identity, clear } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString();
  const shortId = principalId ? principalId.slice(0, 8) : null;

  return {
    isAuthenticated,
    principalId,
    shortId,
    logout: clear,
  };
}
