<template>
  <div v-if="loading">
    <q-spinner color="primary" size="2em" /> Gruppen werden geladen
  </div>
  <template v-else>
    <div v-if="!groups?.length ?? 0"><q-icon name="close" color="primary" size="2em" /> Keine Gruppen</div>
    <template v-else>
      <q-list v-if="clickable">
        <q-item v-for="group in groups" :key="group.id" clickable v-ripple :title="group.path + ' anzeigen'" :to="{
          name: 'groups',
          params: { groupId: group.id },
        }">
          <q-item-section>{{ group.path }}</q-item-section>
          <q-item-section side>
            <q-btn size="12px" flat dense round icon="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-if="!clickable">
        <q-item v-for="group in groups" :key="group.id">
          <q-item-section>{{ group.path }}</q-item-section>
        </q-item>
      </q-list>
    </template>
  </template>

</template>

<script setup lang="ts">
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { toRefs } from 'vue';

export interface Props {
  loading: boolean,
  clickable?: boolean,
  groups?: KeycloakGroup[]
}
const props = defineProps<Props>()
const { loading, clickable, groups } = toRefs(props);

</script>

<style scoped>

</style>
