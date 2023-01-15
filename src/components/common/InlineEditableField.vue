<template>
  <q-field v-if="!editMode" borderless :label="props.label" stack-label>
    <template v-slot:control>
      <div class="text-content full-width no-outline" tabindex="0">
        {{ value ?? '-' }}
      </div>
    </template>
  </q-field>
  <q-input v-if="editMode" v-model="value" class="full-width" :label="props.label" />
</template>

<script setup lang="ts">import { QField, QInput } from 'quasar';
import { computed, PropType } from 'vue';


export interface Props {
  label: string
  modelValue?: string
  editMode: boolean,
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void;
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