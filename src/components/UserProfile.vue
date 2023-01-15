<template>
  <div class="items-center">
    <div class="row items-center">
      <div class="col-12">
        <q-field borderless label="Benutzername" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ value.username ?? '-' }}
            </div>
          </template>
        </q-field>
      </div>
    </div>
    <div class="row items-center q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <InlineEditableField label="Vorname" v-model="value.firstName" :edit-mode="editMode" />
      </div>
      <div class="col-12 col-sm-6">
        <InlineEditableField label="Nachname" v-model="value.lastName" :edit-mode="editMode" />
      </div>
    </div>
    <div class="row items-center q-col-gutter-x-md">
      <div class="col-12 col-sm-6">
        <q-field borderless label="E-Mail-Adresse" stack-label>
          <template v-slot:control>
            <div class="text-content full-width no-outline" tabindex="0">
              {{ value.email ?? '-' }}
            </div>
          </template>
        </q-field>
      </div>
      <div class="col-12 col-sm-6">
        <q-field borderless label="E-Mail-Adresse bestätigt" stack-label>
          <template v-slot:control>
            <q-checkbox label="Bestätigt" :model-value="value.emailVerified ?? false" />
          </template>
        </q-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeycloakProfile } from 'keycloak-js';
import { QField, QCheckbox } from 'quasar';
import { computed, PropType } from 'vue';
import InlineEditableField from './common/InlineEditableField.vue';

const props = defineProps({
  modelValue: {
    type: Object as PropType<KeycloakProfile>,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: KeycloakProfile): void;
}>();

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

</script>
