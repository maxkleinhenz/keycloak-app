<template>
    <div class="pb-8">
        <p v-if="tagline" class="text-gray-500 text-sm">
            {{ tagline }}
        </p>
        <div class="flex flex-wrap gap-2 sm:gap-6">
            <h1 class="text-3xl">
                {{ headline ?? '-' }}
            </h1>

            <div v-if="enableEdit" class="flex flex-wrap gap-2">
                <AppButton v-if="!editMode" intent="secondary" shape="pill" @click="editMode = true">
                    <AppIcon v-if="editButtonIcon" :name="editButtonIcon" /> {{ editButtonLabel }}
                </AppButton>
                <AppButton v-if="editMode" intent="secondary" shape="pill" @click="editMode = false">
                    <AppIcon v-if="cancelButtonIcon" :name="cancelButtonIcon" /> {{ cancelButtonLabel }}
                </AppButton>
                <AppButton v-if="editMode" intent="primary" shape="pill" @click="emit('save')">
                    <AppIcon v-if="saveButtonIcon" :name="saveButtonIcon" /> {{ saveButtonLabel }}
                </AppButton>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
    defineProps<{
        headline: string;
        tagline?: string;
        edit?: boolean;
        enableEdit?: boolean;
        editButtonLabel?: string;
        editButtonIcon?: string;
        cancelButtonLabel?: string;
        cancelButtonIcon?: string;
        saveButtonLabel?: string;
        saveButtonIcon?: string;
    }>(),
    {
        edit: false,
        enableEdit: false,
        editButtonLabel: "Bearbeiten",
        editButtonIcon: "ic:baseline-edit",
        cancelButtonLabel: "Abbrechen",
        cancelButtonIcon: "ic:baseline-cancel",
        saveButtonLabel: "Speichern",
        saveButtonIcon: "ic:baseline-save"
    }
);


const emit = defineEmits<{
    "update:edit": [edit: boolean]
    save: []
    cancel: []
}>()

const editMode = useVModel(props, 'edit', emit)
</script>