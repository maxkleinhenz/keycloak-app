<template>
  <InputText v-if="editMode" :id="label" v-model="value" :size="'small'" class="rounded-full" />
  <p v-else :id="label">{{ value }}</p>
</template>

<script setup lang="ts">

const props = defineProps<{
  label: string
  modelValue?: string
  editMode: boolean,
}>()

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