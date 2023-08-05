export const useKeycloakHelper = () => {
  const userName = ({
    username,
    firstName,
    lastName,
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
  }) =>
    computed(() => {
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return username ?? '-';
    });

  return { userName };
};
