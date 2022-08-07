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
          <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
          <q-btn
            class="gt-xs"
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
</template>

<script setup lang="ts">
import { KeycloakGroupMember } from 'src/models/KeycloackGroupMember';
import { PropType } from 'vue';
const props = defineProps({
  members: {
    type: Object as PropType<KeycloakGroupMember[] | undefined>,
  },
});
</script>

<style lang="scss" scoped></style>
