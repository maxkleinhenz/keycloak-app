<template>
  <div class="items-center">
    <q-form @submit="onSubmit" class="items-center">
      <div v-if="props.enableEdit" class="row q-gutter-md q-mb-md">
        <q-btn
          v-if="!editUser"
          class="col-auto"
          outline
          rounded
          color="primary"
          label="Bearbeiten"
          icon="o_edit"
          @click="setEditMode(true)"
        />
        <q-btn
          v-if="editUser"
          class="col-auto"
          outline
          rounded
          color="grey-7 col-auto"
          label="Abbrechen"
          icon="close"
          @click="setEditMode(false)"
        />
        <q-btn
          v-if="editUser"
          class="col-auto"
          type="submit"
          outline
          rounded
          color="primary"
          label="Speichern"
          icon="done"
        />
      </div>
      <div class="row items-center">
        <div class="col-12">
          <q-field borderless label="Benutzername" stack-label>
            <template v-slot:control>
              <div class="text-content full-width no-outline" tabindex="0">
                {{ props.user?.username ?? '-' }}
              </div>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-sm-6">
          <q-field v-if="!editUser" borderless label="Vorname" stack-label>
            <template v-slot:control>
              <div class="text-content full-width no-outline" tabindex="0">
                {{ props.user?.firstName ?? '-' }}
              </div>
            </template>
          </q-field>
          <q-input
            v-if="editUser"
            v-model="editUser.firstName"
            class="full-width"
            label="Vorname"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-field v-if="!editUser" borderless label="Nachname" stack-label>
            <template v-slot:control>
              <div class="text-content full-width no-outline" tabindex="0">
                {{ props.user?.lastName ?? '-' }}
              </div>
            </template>
          </q-field>
          <q-input
            v-if="editUser"
            v-model="editUser.lastName"
            class="full-width"
            label="Nachname"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-sm-6">
          <q-field v-if="!editUser" borderless label="E-Mail" stack-label>
            <template v-slot:control>
              <div class="text-content full-width no-outline" tabindex="0">
                {{ props.user?.email ?? '-' }}
              </div>
            </template>
          </q-field>
          <q-input
            v-if="editUser"
            v-model="editUser.email"
            class="full-width"
            label="E-Mail"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-field borderless label="" stack-label>
            <template v-slot:control>
              <q-checkbox
                label="E-Mail bestätigt"
                :model-value="props.user?.emailVerified ?? false"
              />
            </template>
          </q-field>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { QAvatar, QField, QCheckbox } from 'quasar';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { PropType, ref } from 'vue';

const props = defineProps({
  user: {
    type: Object as PropType<KeycloakUser | undefined>,
  },
  enableEdit: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const emit = defineEmits<{
  (e: 'updatedUser', user: KeycloakUser): void;
}>();

const store = useKeyCloakStore();

const editUser = ref<KeycloakUser | undefined>(undefined);

const setEditMode = (mode: boolean) => {
  if (mode) editUser.value = { ...props.user } as KeycloakUser;
  else editUser.value = undefined;
};

const onSubmit = async () => {
  if (!props.enableEdit) return;

  if (props.user?.id && editUser.value) {
    const updatedUser = await store.updateUser(props.user.id, editUser.value);
    emit('updatedUser', updatedUser);
  }
  setEditMode(false);
};
</script>

<style scoped></style>
