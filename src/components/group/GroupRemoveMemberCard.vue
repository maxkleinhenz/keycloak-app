<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="o_person_remove" color="primary" text-color="white" />
      <span>
        <strong
          v-if="
            props.memberToRemove?.firstName && props.memberToRemove?.lastName
          "
          class="q-ml-sm"
          >{{ props.memberToRemove?.firstName }}
          {{ props.memberToRemove?.lastName }}
        </strong>
        <strong v-else class="text-bold q-ml-sm">{{
          props.memberToRemove?.username
        }}</strong>
        von der Gruppe
        <strong>{{ props.group?.path }}</strong> entfernen?</span
      >
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Abbrechen" v-close-popup />
      <q-btn flat label="Entfernen" color="primary" @click="onRemove" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { QCard, QCardSection, QAvatar, QCardActions, QBtn } from 'quasar';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { PropType } from 'vue';

const props = defineProps({
  group: {
    type: Object as PropType<KeycloakGroup | undefined>,
    default: undefined,
    required: true,
  },
  memberToRemove: {
    type: Object as PropType<KeycloakGroupMember | undefined>,
    default: undefined,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'remove', member: KeycloakGroupMember | undefined): void;
}>();

const onRemove = () => {
  emit('remove', props.memberToRemove);
};
</script>

<style scoped></style>
