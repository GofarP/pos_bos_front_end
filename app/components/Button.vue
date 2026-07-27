<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out hover:tracking-wider',
      'focus:outline-none focus:ring-4',
      disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.97]',
      colorClasses
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset';
  color?: 'blue' | 'red' | 'green' | 'gray' | 'indigo' | 'dark';
  disabled?: boolean;
}>(), {
  type: 'button',
  color: 'blue',
  disabled: false
});

const colorClasses = computed(() => {
  const styles = {
    blue: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40 focus:ring-blue-500/30',
    red: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 focus:ring-red-500/30',
    green: 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/40 focus:ring-emerald-500/30',
    gray: 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-lg hover:shadow-gray-300/50 focus:ring-gray-400/30',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/40 focus:ring-indigo-500/30',
    dark: 'bg-gray-900 text-white hover:bg-black hover:shadow-lg hover:shadow-gray-900/40 focus:ring-gray-900/30',
  };
  
  return styles[props.color] || styles.blue;
});
</script>
