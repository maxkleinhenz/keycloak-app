// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export default NuxtAuthHandler({
  pages: {
    signIn: '/',
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    KeycloakProvider.default({
      clientId: process.env.AUTH_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH_SECRET,
      //authorization: process.env.AUTH_AUTHORIZATION ?? '',
      issuer: process.env.AUTH_ISSUER ?? '',
      idToken: true,

      //wellKnown: process.env.AUTH_WELLKNOWN ?? '',
      //requestTokenUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/auth",
      // accessTokenUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/token",
      // profileUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/userinfo",
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      const myToken = token as Token;

      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          access_token: account.access_token,
          expires_at: Math.floor(
            Date.now() / 1000 + (account.expires_in as number)
          ),
          //exp: Math.floor(Date.now() / 1000 + (account.exp as number)),
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < myToken.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch(
            `${process.env.AUTH_ISSUER}/protocol/openid-connect/token`,
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                client_id: process.env.AUTH_CLIENT_ID ?? '',
                client_secret: process.env.AUTH_SECRET ?? '',
                grant_type: 'refresh_token',
                refresh_token: myToken.refresh_token,
              }),
              method: 'POST',
            }
          );

          const refreshResponse = await response.json();
          if (!response.ok) throw refreshResponse;

          const result = {
            ...token, // Keep the previous token properties
            access_token: refreshResponse.access_token,
            exp: Math.floor(Date.now() / 1000 + refreshResponse.exp),
            expires_at: Math.floor(
              Date.now() / 1000 + refreshResponse.expires_in
            ),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: refreshResponse.refresh_token ?? token.refresh_token,
          };
          return result;
        } catch (error) {
          console.error('Error refreshing access token', error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token,
      };
      return session;
    },
  },
});

type Token = {
  access_token: string;
  iat: Date;
  exp: Date;
  jti: number;
  refresh_token: string;
  refresh_expires_in: number;
  name: string;
  email: string;
  sub: string;
  id: string;
  provider: string;
  type: string;
  providerAccountId: string;
  expires_at: number;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
};
