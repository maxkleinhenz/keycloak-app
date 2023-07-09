// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
export default NuxtAuthHandler({
  //secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    KeycloakProvider.default({
      clientId: process.env.AUTH_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH_SECRET,
      //authorization: process.env.AUTH_AUTHORIZATION ?? '',
      issuer: process.env.AUTH_ISSUER ?? '',
      idToken: true,
      //wellKnown: process.env.AUTH_WELLKNOWN ?? '',
      // requestTokenUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/auth",
      // accessTokenUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/token",
      // profileUrl: "http://localhost:8080/auth/realms/vue/protocol/openid-connect/userinfo",
    }),
  ],
  callbacks: {
    session: (data) => {
      return data.session;
    },
  },
});
