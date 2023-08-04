<template>
  <div class="grid grid-cols-1 mx-auto max-w-5xl p-5 gap-4">
    <AppPageTitle class :headline="pageHeader" tagline="Gruppe" :enable-edit="true" v-model:edit="editMode">
    </AppPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInputField label="Id" class="md:col-span-2">
        <AppInlineEditableField label="Id" :model-value="group?.id" :edit-mode="false" />
      </AppInputField>

      <AppInputField label="Name">
        <AppInlineEditableField label="Name" :model-value="group?.name" :edit-mode="editMode" />
      </AppInputField>
      <AppInputField label="Pfad">
        <AppInlineEditableField label="Pfad" :model-value="group?.path" :edit-mode="editMode" />
      </AppInputField>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const groupId = route.params.groupId.toString();
const { fetchGroups } = useKeycloakApi();
const { data: group } = await fetchGroups(groupId);

const editMode = ref(false);

const pageHeader = computed(() => {
  return group.value?.name ?? '-';
});
</script>

