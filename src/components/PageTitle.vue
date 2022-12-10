<template>
  <div class="column q-my-xl">
    <p v-if="props.tagline" class="col text-uppercase text-grey-8 q-mb-xs">
      {{ props.tagline }}
    </p>
    <div class="row q-gutter-y-md q-gutter-x-xl">
      <div class="col-auto">
        <h1 class="q-my-none">
          {{ props.headline ?? '-' }}
        </h1>
      </div>

      <div v-if="showEditButton" class="col-auto">
        <div class="q-gutter-md">
          <q-btn
            v-if="!isEditMode"
            class="col-auto"
            outline
            rounded
            color="primary"
            :label="props.editButtonLabel"
            :icon="props.editButtonIcon"
            @click="setEditMode"
          />
          <q-btn
            v-if="isEditMode"
            class="col-auto"
            outline
            rounded
            color="grey-7"
            :label="props.cancelButtonLabel"
            :icon="props.cancelButtonIcon"
            @click="cancelEdit"
          />
          <q-btn
            v-if="isEditMode"
            class="col-auto"
            type="submit"
            outline
            rounded
            color="primary"
            :label="props.saveButtonLabel"
            :icon="props.saveButtonIcon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  headline: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: false,
  },
  showEditButton: {
    type: Boolean,
    required: true,
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
  (e: 'onEditClick'): void;
  (e: 'onEditCancelClick'): void;
  (e: 'onEditSaveClick'): void;
}>();

const isEditMode = ref(false);

const setEditMode = () => {
  isEditMode.value = true;
  emit('onEditClick');
};

const cancelEdit = () => {
  isEditMode.value = false;
  emit('onEditCancelClick');
};
</script>
