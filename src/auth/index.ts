export interface AuthParams {
  clientId: string;
  authUrl: string;
  scopes: string[];
}

export const CALLBACK_PATH = "/auth-callback";

export const AUTH_PARAMS = {
  twitch: {
    clientId: "2i3u6olpyofmt8tyg6c47esph0io2e",
    authUrl: "https://id.twitch.tv/oauth2/authorize",
    scopes: [
      "user:write:chat",
      "channel:read:redemptions",
      "channel:manage:redemptions",
    ],
  },
  spotify: {
    clientId: "1357399c6d9e4c389b07dc9659da8621",
    authUrl: "https://accounts.spotify.com/authorize",
    scopes: ["user-read-playback-state", "user-modify-playback-state"],
  },
} satisfies Record<string, AuthParams>;

export type Service = keyof typeof AUTH_PARAMS;

export function getImplicitGrantUrl(service: Service): string {
  const params = AUTH_PARAMS[service];
  return (
    params.authUrl +
    "?" +
    new URLSearchParams({
      client_id: params.clientId,
      redirect_uri: window.location.origin + CALLBACK_PATH,
      response_type: "token",
      scope: params.scopes.join(" "),
      state: new URLSearchParams({
        service,
      }).toString(),
    })
  );
}

export function refreshAuthToken(service: Service) {
  // @ts-expect-error It is possible to assign a string to window.location
  window.location = getImplicitGrantUrl(service);
}
