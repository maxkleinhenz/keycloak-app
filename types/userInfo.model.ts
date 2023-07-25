export type UserInfo = {
  group_membership: string[];
  sub: string;
  resource_access: {
    account: {
      roles: string[];
    };
  };
  email_verified: boolean;
  realm_access: {
    roles: string[];
  };
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};
