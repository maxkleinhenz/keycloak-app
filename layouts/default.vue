<script lang="ts" setup>
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';

const { signOut } = useAuth();

const store = useKeycloakStore();
const { data: profile } = await store.getUserInfo();

const menuItems: MenuItem[] = [
  {
    label: 'Profil',
    icon: 'ic:baseline-account-circle',
    to: '/profil',
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'ic:baseline-logout',
    command: () => signOut(),
  },
];

const menu = ref<Menu>();
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="bg-juso-rot p-3 flex flex-row items-center shadow-lg">
      <AppButton to="/" intent="link" shape="default" class="text-white"
        >Gruppenverwaltung</AppButton
      >
      <div v-if="profile?.preferred_username" class="flex justify-end flex-1">
        <AppButton
          intent="tertiary"
          shape="pill"
          class="text-white hover:ring-white"
          @click="(e) => menu?.toggle(e)"
        >
          <AppIcon name="ic:baseline-account-circle" />
          <span class="hidden sm:inline">{{
            profile?.preferred_username
          }}</span>
        </AppButton>
        <!-- <Menu ref="menu" :model="menuItems" :popup="true" /> -->
        <Menu ref="menu" :model="menuItems" :popup="true">
          <template #item="{ item }">
            <template v-if="item.to" :id="id + '_' + i">
              <AppButton intent="default" :to="item.to">
                <AppIcon v-if="item.icon" :name="item.icon" /> {{ item.label }}
              </AppButton>
            </template>
            <template v-else-if="item.command" :id="id + '_' + i">
              <AppButton intent="default" @click="item.command">
                <AppIcon v-if="item.icon" :name="item.icon" /> {{ item.label }}
              </AppButton>
            </template>
            <template v-else-if="item.separator">
              <hr />
            </template>
          </template>
        </Menu>
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
