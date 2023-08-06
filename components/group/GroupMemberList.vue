<template>
  <div>

    <div class="p-2 w-full flex justify-end">
      <AppButton intent="secondary" shape="pill" size="small" @click="visibleAddMember = true">Mitglieder hinzufügen
      </AppButton>
    </div>

    <Listbox :options="members" class="w-full border-none !shadow-none">
      <template #option="slotProps">
        <GroupMemberListItem :member="slotProps.option" :navigable="true" />
      </template>
      <template #empty>
        <p>Keine Mitglieder</p>
      </template>
    </Listbox>

    <Dialog v-model:visible="visibleAddMember" modal header="Mitglieder hinzufügen" :style="{ width: '50vw' }">
      <!-- <DataTable :value="virtualCars" tableStyle="min-width: 50rem">
        <Column field="username" header="Username"></Column>
      </DataTable> -->
      <DataTable :value="virtualCars" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
        :virtualScrollerOptions="{ lazy: true, onLazyLoad: loadCarsLazy, itemSize: 46, delay: 200, showLoader: true, loading: lazyLoading, numToleratedItems: 2 }">
        <Column field="username" header="Username" style="width: 100%">
          <template #loading>
            <div class="flex align-items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
              <Skeleton width="60%" height="1rem" />
            </div>
          </template>
        </Column>
      </DataTable>
      <template #footer>
        <div class="flex justify-end">
          <AppButton intent="secondary" @click="visibleAddMember = false" text>Abbrechen</AppButton>
          <AppButton @click="visibleAddMember = false">Speichern</AppButton>
        </div>
      </template>

      <!-- <DataTable :value="virtualCars" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
        :virtualScrollerOptions="{ lazy: true, onLazyLoad: loadCarsLazy, itemSize: 46, delay: 200, showLoader: true, loading: lazyLoading, numToleratedItems: 10 }">
        <Column field="username" header="Username" style="width: 100%">
          <template #loading>
            <div class="flex align-items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
              <Skeleton width="60%" height="1rem" />
            </div>
          </template>
        </Column>
      </DataTable>
      <template #footer>
        <div class="flex justify-end">
          <AppButton intent="secondary" @click="visibleAddMember = false" text>Abbrechen</AppButton>
          <AppButton @click="visibleAddMember = false">Speichern</AppButton>
        </div>
      </template>-->
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import { User } from 'types/user.model';

const props = defineProps<{
  groupId: string;
  navigable?: boolean;
}>();

const visibleAddMember = ref(false);

const { fetchGroupMembers, fetchUserCount, fetchUsers } = useKeycloakApi();
const members = computedAsync(async () => {
  const { data: members } = await fetchGroupMembers(props.groupId);
  if (members.value) return members.value
  return undefined;
});

const { data: userCount } = await fetchUserCount();

const virtualCars = ref<User[]>(Array<User>(userCount.value ?? 0));
// const { data } = await fetchUsers(0, 10)
// virtualCars.value = data.value ?? [];

watchEffect(() => console.log("virtualCars", virtualCars.value))

const lazyLoading = ref(false);
const loadCarsLazy = async (event: VirtualScrollerLazyEvent) => {
  console.log("loadCarsLazy", event)
  !lazyLoading.value && (lazyLoading.value = true);

  let { first, last } = event;
  const { data: loadedCars } = await fetchUsers(first, last)

  //populate page of virtual cars
  const newCars = loadedCars.value ?? []
  virtualCars.value = virtualCars.value.splice(first, last, ...newCars)
  //virtualCars.value = newCars
  console.log("newcars", newCars)
  lazyLoading.value = false;
};
</script>
