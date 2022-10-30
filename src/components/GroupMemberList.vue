<template>
  <div class="flex justify-end q-mb-md">
    <q-btn
      outline
      rounded
      color="grey-7"
      label="Hinzufügen"
      icon="o_person_add"
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
            @click.prevent="memberToRemove = member"
          />
          <q-btn size="12px" flat dense round icon="chevron_right" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <GroupRemoveMember
    :member-to-remove="memberToRemove"
    :group="group"
    @on-member-removed="handleOnMemberRemoved"
  ></GroupRemoveMember>
</template>

<script setup lang="ts">
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { PropType, ref } from 'vue';
import GroupRemoveMember from './GroupRemoveMember.vue';
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
  (e: 'onMemberRemoved', member: KeycloakGroupMember): void;
}>();

const memberToRemove = ref<KeycloakGroupMember | undefined>();

const handleOnMemberRemoved = (member: KeycloakGroupMember) => {
  emit('onMemberRemoved', member);
};
</script>

<style lang="scss" scoped></style>
