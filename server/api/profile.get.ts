import { getServerSession } from '#auth';
import { Session } from '../../types/session.model';
import { UserInfo } from '../../types/userInfo.model';

export default defineEventHandler(async (event) => {
  const sessionResult = await getServerSession(event);
  const session = sessionResult as never as Session;

  if (!session) return { status: 'unauthenticated!' };

  const response = await $fetch(
    'https://login.rote.tools/realms/test/protocol/openid-connect/userinfo',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.user.access_token,
      },
    }
  );

  return response as UserInfo;
});
