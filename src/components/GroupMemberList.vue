<template>
  <div class="q-mb-md">
    <q-btn
      outline
      rounded
      color="grey-7"
      label="Mitglieder auswählen"
      icon="o_how_to_reg"
      @click.prevent="showAddMemberDialog = true"
    />
  </div>
  <div v-if="!props.members?.length ?? 0">Noch keine Mitglieder</div>
  <q-list v-if="props.members">
    <q-item
      v-for="member in props.members"
      :key="member.id"
      clickable
      v-ripple
      :to="{
        name: 'profile',
        params: { userId: member.id },
      }"
      :title="member.firstName + ' ' + member.lastName + ' anzeigen'"
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
            icon="o_person_remove"
            @click.prevent="setMemberToRemove(member)"
            :title="
              member.firstName +
              ' ' +
              member.lastName +
              ' aus der Gruppe entfernen'
            "
          />
          <q-btn size="12px" flat dense round icon="chevron_right" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog v-model="showMemberRemoveDialog" no-backdrop-dismiss>
    <GroupRemoveMemberCard
      :group="group"
      :member-to-remove="memberToRemove"
      @remove="handleRemove"
    ></GroupRemoveMemberCard>
  </q-dialog>

  <q-dialog v-model="showAddMemberDialog" no-backdrop-dismiss>
    <SelectUserCard
      title="Benutzer:innen für die Gruppe auswählen"
      :preselected-user="members?.map((m) => m.id)"
      @cancel="showAddMemberDialog = false"
      @selected-users="handleSelectedUser"
    ></SelectUserCard>
  </q-dialog>
</template>

<script setup lang="ts">
import { QBtn, QList, QItem, QItemSection, QItemLabel, QDialog } from 'quasar';
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { useKeyCloakStore } from 'src/stores/keycloak-store';
import { PropType, ref } from 'vue';
import GroupRemoveMemberCard from './GroupRemoveMemberCard.vue';
import SelectUserCard from './SelectUserCard.vue';
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
  (e: 'refresh'): void;
}>();

const store = useKeyCloakStore();
const showMemberRemoveDialog = ref(false);
const memberToRemove = ref<KeycloakGroupMember | undefined>();
const setMemberToRemove = (member: KeycloakGroupMember) => {
  showMemberRemoveDialog.value = !!member;
  memberToRemove.value = member;
};
const handleRemove = async (member: KeycloakGroupMember | undefined) => {
  if (member?.id && props.group?.id) {
    await store.removeUserFromGroup(member.id, props.group?.id);
  }

  showMemberRemoveDialog.value = false;
  emit('refresh');
};

const showAddMemberDialog = ref(false);
const handleSelectedUser = async (userIds: string[]) => {
  const currentUsers = props.members?.map((m) => m.id);
  const newUsers = userIds.filter((u) => !currentUsers?.includes(u));
  const usersToRemove = currentUsers?.filter((u) => !userIds.includes(u));

  await Promise.all(
    newUsers.map(async (u) => {
      await store.addUserToGroup(u, props.group?.id);
    })
  );

  if (usersToRemove) {
    await Promise.all(
      usersToRemove.map(async (u) => {
        await store.removeUserFromGroup(u, props.group?.id);
      })
    );
  }

  showAddMemberDialog.value = false;
  emit('refresh');
};
</script>

<style lang="scss" scoped></style>
