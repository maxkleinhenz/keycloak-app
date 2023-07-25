export type Session = {
  user: {
    name: string;
    email: string;
    sub: string;
    id: string;
    provider: string;
    type: string;
    providerAccountId: string;
    access_token: string;
    expires_at: Date;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
    iat: Date;
    exp: Date;
    jti: string;
  };
};
