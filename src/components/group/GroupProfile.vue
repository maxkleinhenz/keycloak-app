<template>
  <div class="row">
    <div class="col-12">
      <q-field borderless label="Id" stack-label>
        <template v-slot:control>
          <div class="text-content full-width no-outline" tabindex="0">
            {{ group?.id ?? '-' }}
          </div>
        </template>
      </q-field>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-sm-6">
      <q-field borderless label="Name" stack-label>
        <template v-slot:control>
          <div class="text-content full-width no-outline" tabindex="0">
            {{ group?.name ?? '-' }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-12 col-sm-6">
      <q-field borderless label="Pfad" stack-label>
        <template v-slot:control>
          <div class="text-content full-width no-outline" tabindex="0">
            {{ group?.path ?? '-' }}
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">import { QField } from 'quasar';
import { KeycloakGroup } from 'src/models/KeycloakGroup';
import { toRefs } from 'vue';

export interface Props {
  group?: KeycloakGroup
}
const props = defineProps<Props>()
const { group } = toRefs(props);
</script>

<style scoped>

</style>