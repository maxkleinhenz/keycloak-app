<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonClass = cva(
  'transform active:scale-95 transition-colors duration-300 flex items-center gap-2',
  {
    variants: {
      intent: {
        primary:
          'bg-juso-rot text-white hover:ring-juso-rot hover:ring-1 hover:ring-offset-1 hover:shadow-md',
        secondary: 'hover:ring-gray-400 hover:ring-1 hover:ring-offset-1',
        tertiary: 'hover:ring-gray-400 hover:ring-1 border-none',
        link: 'hover:underline underline-offset-4 p-2',
        default: '',
        white: 'bg-white hover:bg-gray-200',
        black: 'bg-black text-white hover:bg-neutral-700',
        gray: 'bg-gray-100 hover:bg-gray-200 hover:ring-gray-600 hover:ring-1 hover:ring-offset-1 border-none',
      },
      shape: {
        default: '',
        rounded: 'rounded-full aspect-square',
        pill: 'rounded-full border hover:shadow-md',
      },
      size: {
        xs: 'px-2 py-1 text-sm',
        small: 'p-3 ',
        medium: 'px-4 py-2 sm:py-3 sm:px-5 ',
        large: 'text-xl p-4 sm:p-5',
        hero: 'py-4 px-7',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
      shape: 'default',
    },
  }
);

type ButtonProps = Required<VariantProps<typeof buttonClass>>;
withDefaults(
  defineProps<{
    intent?: ButtonProps['intent'];
    shape?: ButtonProps['shape'];
    size?: ButtonProps['size'];
  }>(),
  {
    intent: 'primary',
    shape: 'default',
    size: 'medium',
  }
);

const attrs = useAttrs();
const component = computed(() => {
  if (attrs.to || attrs.href) return resolveComponent('NuxtLink');
  return 'button';
});
</script>

<template>
  <component
    :is="component"
    :class="twMerge(buttonClass({ intent, shape, size }))"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
