<template>
  <div v-if="!props.members?.length ?? 0">no members</div>
  <q-list v-if="props.members">
    <q-item
      v-for="member in props.members"
      :key="member.id"
      clickable
      v-ripple
      :to="{
        name: 'profile',
        params: { username: member.username },
      }"
    >
      <q-item-section>
        <template v-if="member.firstName || member.lastName">
          <q-item-label
            >{{ member.firstName }} {{ member.lastName }}</q-item-label
          >
          <q-item-label caption lines="1">{{ member.username }}</q-item-label>
        </template>
        <template v-else>
          <q-item-label>{{ member.username }}</q-item-label>
        </template>
      </q-item-section>
      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click.prevent="openMemberDeleteConfirm(member)"
          />
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="chevron_right"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog v-model="showRemoveConfirm">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="primary" text-color="white" />
        <span>
          <strong
            v-if="memberToRemove?.firstName && memberToRemove?.lastName"
            class="q-ml-sm"
            >{{ memberToRemove?.firstName }} {{ memberToRemove?.lastName }}
          </strong>
          <strong v-else class="text-bold q-ml-sm">{{
            memberToRemove?.username
          }}</strong>
          von der Gruppe <strong>{{ group?.path }}</strong> entfernen?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Abbrechen" color="primary" v-close-popup />
        <q-btn flat label="Entfernen" @click="deleteMember()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { PropType, ref } from 'vue';
const props = defineProps({
  members: {
    type: Object as PropType<KeycloakGroupMember[] | undefined>,
    required: true,
  },
  group: {
    type: Object as PropType<KeycloakGroup | undefined>,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'removeUserFromGroup', userId: string): void;
}>();

const showRemoveConfirm = ref(false);
const memberToRemove = ref<KeycloakGroupMember | undefined>();

const openMemberDeleteConfirm = (member: KeycloakGroupMember) => {
  if (props.group?.id) {
    memberToRemove.value = member;
    showRemoveConfirm.value = true;
  }
};

const deleteMember = async () => {
  if (props.group?.id && memberToRemove.value?.id) {
    emit('removeUserFromGroup', memberToRemove.value.id);
  }

  showRemoveConfirm.value = false;
  memberToRemove.value = undefined;
};
</script>

<style lang="scss" scoped></style>
