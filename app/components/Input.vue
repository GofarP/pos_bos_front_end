<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full py-2.5 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none',
          type === 'password' ? 'pl-4 pr-12' : 'px-4',
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20',
          disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
            : 'text-gray-900 hover:border-gray-400'
        ]"
        v-bind="$attrs"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none rounded-r-xl"
        title="Toggle Password Visibility"
      >
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 font-medium">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useId, ref, computed } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = withDefaults(defineProps<{
  modelValue?: string | number;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}>(), {
  modelValue: '',
  type: 'text',
  disabled: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const id = useId();

const showPassword = ref(false);
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});
</script>
