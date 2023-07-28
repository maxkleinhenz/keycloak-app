import { getServerSession } from '#auth';
import { Group } from '../../../../types/groups.model';
import { Session } from '../../../../types/session.model';

export default defineEventHandler(async (event) => {
  const sessionResult = await getServerSession(event);
  const session = sessionResult as never as Session;

  if (!session) return { status: 'unauthenticated!' };
  const userId = event.context.params?.userId;
  const url = `${process.env.KEYCLOAK_ADMIN_API}/users/${userId}/groups`;

  const response = await $fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session.user.access_token,
    },
  });

  return response as Group;
});
