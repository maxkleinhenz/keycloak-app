<template>
  <q-dialog v-model="showDialog">
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
        <q-btn flat label="Abbrechen" color="primary" v-close-popup />
        <q-btn flat label="Entfernen" @click="deleteMember" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QDialog,
  QCard,
  QCardSection,
  QAvatar,
  QCardActions,
  QBtn,
} from 'quasar';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { PropType, ref, watch } from 'vue';

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
  (e: 'onMemberRemoved', member: KeycloakGroupMember): void;
}>();

const store = useKeyCloakStore();
const showDialog = ref(false);

watch(
  () => props.memberToRemove,
  (value) => {
    showDialog.value = !!value;
  }
);

const deleteMember = async () => {
  if (props.group?.id && props.memberToRemove?.id) {
    await store.RemoveUserFromGroup(props.group.id, props.memberToRemove.id);
    emit('onMemberRemoved', props.memberToRemove);
  }
  showDialog.value = false;
};
</script>

<style scoped></style>
