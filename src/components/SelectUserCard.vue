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
        ref="searchInputRef"
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
    <q-card-section class="overflow-auto">
      <!-- <q-scroll-area class="full-height"> -->
      <q-list class="full-width">
        <q-item v-for="user in users" :key="user.id" dense v-ripple tag="label">
          <q-item-section side top>
            <q-checkbox
              v-model="selectedUsers"
              :val="user.id"
              :toggle-indeterminate="false"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label
              >{{ user.firstName }} {{ user.lastName }}</q-item-label
            >
            <q-item-label caption>{{ user.username }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- </q-scroll-area> -->
    </q-card-section>
    <q-card-section>
      <div class="flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="maxPage"
          direction-links
          outline
          rounded
          flat
        />
      </div>
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
import { debounce } from 'quasar';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { onMounted, ref, computed, PropType } from 'vue';

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
    default: 'Auswählen',
    required: false,
  },
});

onMounted(async () => {
  await initUserList();
  selectedUsers.value = props.preselectedUser ?? [];
  currentPage.value = 1;

  searchInputRef.value?.focus();
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'selectedUsers', member: string[]): void;
}>();

const searchInputRef = ref<HTMLElement | undefined>(undefined);

let abortController = new AbortController();
const resetAbortController = () => {
  abortController.abort();
  abortController = new AbortController();
};

const store = useKeyCloakStore();
const users = ref<KeycloakUser[]>([]);
const selectedUsers = ref<string[]>([]);

const searchText = ref<string | undefined>(undefined);
const search = async () => {
  resetAbortController();

  await initUserList();
  await loadPage(currentPage.value, searchText.value);
};
const resetSearch = async () => {
  searchText.value = undefined;
  await search();
};

const minPage = 1;
const maxPage = ref(0);
const resultSize = ref(10);
const maxCount = ref(0);

const currentPageValue = ref(0);
const currentPage = computed({
  get() {
    return currentPageValue.value;
  },
  async set(value: number) {
    resetAbortController();

    // clamp
    currentPageValue.value = Math.min(Math.max(value, minPage), maxPage.value);
    await loadPage(currentPageValue.value, searchText.value);
  },
});

const initUserList = async () => {
  maxCount.value = await store.getUsersCount(
    abortController.signal,
    searchText.value
  );
  maxPage.value = Math.ceil(maxCount.value / resultSize.value);
};

const loadPage = async (page: number, search?: string | undefined) => {
  const offset = Math.min((page - 1) * resultSize.value);
  users.value = await store.getUsers(
    abortController.signal,
    offset,
    resultSize.value,
    search
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
