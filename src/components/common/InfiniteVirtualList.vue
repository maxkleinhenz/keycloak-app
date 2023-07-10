<template>
  <div v-bind="containerProps">
    <div v-bind="wrapperProps">
      <slot :list="list"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useVirtualList,
  useInfiniteScroll,
  UseVirtualListOptions,
} from '@vueuse/core';
import { onMounted, PropType, ref, watch } from 'vue';

const props = defineProps({
  virtualOptions: {
    type: Object as PropType<UseVirtualListOptions>,
    required: true,
  },
  loadMore: {
    type: Function as PropType<(skip: number) => Promise<unknown[]>>,
    required: true,
  },
  maxCount: {
    type: Number,
    required: true,
  },
});

const data = ref<unknown[]>([]);

const initData = async () => {
  data.value = await props.loadMore(0);
};

onMounted(async () => {
  await initData();
});

watch(
  () => props.maxCount,
  async () => {
    await initData();
  }
);

const { list, containerProps, wrapperProps } = useVirtualList(
  data,
  props.virtualOptions
);

useInfiniteScroll(
  containerProps.ref,
  async () => {
    if (data.value.length >= props.maxCount) return;

    const newData = await props.loadMore(data.value.length);
    data.value = [...data.value, ...newData];
  },
  { distance: 10 }
);
</script>

<style lang="scss" scoped></style>
