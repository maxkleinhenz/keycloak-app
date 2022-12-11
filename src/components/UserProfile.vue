<template>
  <div class="items-center">
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
    <div class="row items-center q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <q-field v-if="!editMode" borderless label="Vorname" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ props.user?.firstName ?? '-' }}
            </div>
          </template>
        </q-field>
        <q-input
          v-if="editMode"
          v-model="props.user!.firstName"
          class="full-width"
          label="Vorname"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-field v-if="!editMode" borderless label="Nachname" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ props.user?.lastName ?? '-' }}
            </div>
          </template>
        </q-field>
        <q-input
          v-if="editMode"
          v-model="props.user!.lastName"
          class="full-width"
          label="Nachname"
        />
      </div>
    </div>
    <div class="row items-center q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <q-field v-if="!editMode" borderless label="E-Mail-Adresse" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ props.user?.email ?? '-' }}
            </div>
          </template>
        </q-field>
        <q-input
          v-if="editMode"
          v-model="props.user!.email"
          class="full-width"
          label="E-Mail-Adresse"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-field borderless label="E-Mail-Adresse bestätigt" stack-label>
          <template v-slot:control>
            <q-checkbox
              label="Bestätigt"
              :model-value="props.user?.emailVerified ?? false"
            />
          </template>
        </q-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QField, QCheckbox } from 'quasar';
import { KeycloakUser } from 'src/models/KeycloakUser';
import { PropType } from 'vue';

const props = defineProps({
  user: {
    type: Object as PropType<KeycloakUser | undefined>,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped></style>
