import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'profile/:userId?',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'groups/:groupId',
        name: 'groups',
        component: () => import('pages/GroupPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'unauthorized',
        name: 'unauthorized',
        component: () => import('pages/UnauthorizedPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

export default routes;
