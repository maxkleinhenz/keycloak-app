<template>
  <q-card class="flex column no-wrap no-scroll">
    <q-card-section>
      <div class="text-h6">{{ props.title }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        rounded
        outlined
        dense
        v-model="searchText"
        placeholder="Nach Namen oder E-Mail-Adressen suchen"
        @keydown.enter="search"
      >
        <template v-slot:append>
          <q-btn
            v-if="searchText !== ''"
            icon="close"
            @click="resetSearch"
            class="cursor-pointer"
            flat
            round
            dense
          />
          <q-btn
            icon="search"
            @click="search"
            class="cursor-pointer"
            flat
            round
            dense
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <InfiniteVirtualList
        :virtual-options="{ itemHeight: 44 }"
        :load-more="(skip) => loadMore(skip)"
        :max-count="maxCount"
        v-slot="slotProps"
      >
        <div v-for="{ index, data } in slotProps.list" :key="index">
          <q-item :key="(data as KeycloakUser).id" dense v-ripple tag="label">
            <q-item-section side top>
              <q-checkbox
                v-model="selectedUsers"
                :val="(data as KeycloakUser).id"
                :toggle-indeterminate="false"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label
                >{{ (data as KeycloakUser).firstName }}
                {{ (data as KeycloakUser).lastName }}</q-item-label
              >
              <q-item-label caption
                >{{ (data as KeycloakUser).username }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </InfiniteVirtualList>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Abbrechen" @click="onCancel" />
      <q-btn
        flat
        :label="props.okButtonLabel"
        color="primary"
        @click="onSelect"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { onMounted, ref, PropType } from 'vue';
import InfiniteVirtualList from './InfiniteVirtualList.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  preselectedUser: {
    type: Object as PropType<string[]>,
    required: false,
  },
  okButtonLabel: {
    type: String,
    default: 'Übernehmen',
    required: false,
  },
});

onMounted(async () => {
  await initUserList();
  selectedUsers.value = props.preselectedUser ?? [];
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'selectedUsers', member: string[]): void;
}>();

let abortController = new AbortController();
const resetAbortController = () => {
  abortController.abort();
  abortController = new AbortController();
};

const store = useKeyCloakStore();
const selectedUsers = ref<string[]>([]);

const searchText = ref<string | undefined>(undefined);
const search = async () => {
  resetAbortController();

  await initUserList(searchText.value);
};
const resetSearch = async () => {
  searchText.value = undefined;
  await search();
};

const maxPage = ref(0);
const resultSize = 10;
const maxCount = ref(0);

const initUserList = async (search?: string | undefined) => {
  maxCount.value = await store.getUsersCount(
    abortController.signal,
    searchText.value
  );
  maxPage.value = Math.ceil(maxCount.value / resultSize);
};

const loadMore = (skip: number) => {
  return store.getUsers(
    abortController.signal,
    skip,
    resultSize,
    searchText.value
  );
};

const onSelect = () => {
  emit('selectedUsers', selectedUsers.value);
};

const onCancel = () => {
  emit('cancel');
};
</script>

<style scoped></style>
