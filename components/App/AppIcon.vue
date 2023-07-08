<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const iconClass = cva("", {
  variants: {
    intent: {
      primary: "",
      secondary: "secondary",
    },
    size: {
      xs: "h-5 w-5",
      small: "h-5 w-5 sm:h-6 sm:w-6 ",
      medium: "text-base",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

type IconProps = Required<VariantProps<typeof iconClass>>;
withDefaults(
  defineProps<{
    name: string;
    intent?: IconProps["intent"];
    size?: IconProps["size"];
  }>(),
  {
    intent: "primary",
    size: "medium",
  }
);
</script>

<template>
  <Icon :name="name" :class="iconClass({ intent, size })">
    <slot />
  </Icon>
</template>