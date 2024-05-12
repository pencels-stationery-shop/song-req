import { UserIdResolvable } from "@twurple/api";
import { AccessTokenWithUserId, StaticAuthProvider } from "@twurple/auth";
import { refreshAuthToken } from ".";

export class TwitchAuthProvider extends StaticAuthProvider {
  async refreshAccessTokenForUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _user: UserIdResolvable
  ): Promise<AccessTokenWithUserId> {
    // We redirect to refresh the auth token so this function never returns.
    refreshAuthToken("twitch");
    return null as unknown as AccessTokenWithUserId;
  }
}
