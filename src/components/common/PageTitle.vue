<template>
  <div class="column q-mt-xl q-mb-lg">
    <p v-if="props.tagline" class="col text-uppercase text-grey-8 q-mb-xs">
      {{ props.tagline }}
    </p>
    <div class="row q-gutter-y-md q-gutter-x-xl">
      <div class="col-auto">
        <h1 class="q-my-none">
          {{ props.headline ?? '-' }}
        </h1>
      </div>

      <div v-if="props.enableEdit" class="col-auto">
        <div class="q-gutter-md">
          <q-btn v-if="!props.editMode" class="col-auto" outline rounded color="primary" :label="props.editButtonLabel"
            :icon="props.editButtonIcon" @click="setEditMode" />
          <q-btn v-if="editMode" class="col-auto" outline rounded color="grey-7" :label="props.cancelButtonLabel"
            :icon="props.cancelButtonIcon" @click="cancelEdit" />
          <q-btn v-if="editMode" class="col-auto" outline rounded color="primary" :label="props.saveButtonLabel"
            :icon="props.saveButtonIcon" @click="submit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  headline: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: false,
  },
  enableEdit: {
    type: Boolean,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: false,
  },
  editButtonLabel: {
    type: String,
    default: 'Bearbeiten',
  },
  editButtonIcon: {
    type: String,
    default: 'o_edit',
  },
  cancelButtonLabel: {
    type: String,
    default: 'Abbrechen',
  },
  cancelButtonIcon: {
    type: String,
    default: 'close',
  },
  saveButtonLabel: {
    type: String,
    default: 'Speichern',
  },
  saveButtonIcon: {
    type: String,
    default: 'done',
  },
});

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'cancel'): void;
  (e: 'save'): void;
}>();

const setEditMode = () => {
  emit('edit');
};

const cancelEdit = () => {
  emit('cancel');
};

const submit = () => {
  emit('save');
}
</script>
