<template>
  <div class="flex flex-col gap-1.5 w-full relative" ref="containerRef">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    
    <div 
      class="relative flex flex-wrap items-center gap-2 p-2 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none pr-10"
      :class="[
        error 
          ? 'border-red-500 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/20' 
          : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20',
        disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-text'
      ]"
      @click="focusInput"
    >
      <!-- Selected Pills -->
      <span 
        v-for="(item, index) in selectedOptions" 
        :key="index"
        class="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm transition-transform hover:scale-105"
      >
        {{ getDisplayValue(item) }}
        <button 
          v-if="!disabled"
          type="button" 
          @click.stop="removeItem(index)"
          class="text-blue-400 hover:text-blue-600 focus:outline-none rounded-full hover:bg-blue-100 p-0.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>

      <!-- Search Input -->
      <input
        ref="inputRef"
        type="text"
        v-model="query"
        @focus="openDropdown"
        @input="onSearch"
        @keydown.delete="onBackspace"
        :placeholder="selectedOptions.length === 0 ? placeholder : ''"
        :disabled="disabled"
        class="flex-1 min-w-[120px] py-0.5 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
      />
      
      <!-- Icons -->
      <div class="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none text-gray-400">
        <svg v-if="loading" class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-transform duration-200" :class="{'rotate-180': isOpen}">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="absolute z-50 w-full mt-2 top-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto py-1"
      >
        <div v-if="!query" class="px-4 py-3 text-sm text-gray-500 text-center">
          Ketik untuk mencari...
        </div>
        <div v-else-if="loading && options.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
          Mencari...
        </div>
        <div v-else-if="options.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
          Data tidak ditemukan
        </div>
        <ul v-else>
          <li 
            v-for="(option, index) in options" 
            :key="index"
            @click="selectOption(option)"
            class="px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center"
            :class="isSelected(option) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'"
          >
            {{ getDisplayValue(option) }}
            <svg v-if="isSelected(option)" class="ml-auto h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
        </ul>
      </div>
    </transition>
    
    <p v-if="error" class="text-sm text-red-500 font-medium">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: any[];
  label?: string;
  placeholder?: string;
  fetchOptions: (query: string) => Promise<any[]>;
  displayKey?: string;
  valueKey?: string;
  error?: string;
  disabled?: boolean;
}>(), {
  modelValue: () => [],
  displayKey: 'label',
  valueKey: 'value',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
  (e: 'change', options: any[]): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const query = ref('');
const isOpen = ref(false);
const options = ref<any[]>([]);
const loading = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const selectedOptions = ref<any[]>([...props.modelValue]);

const getDisplayValue = (option: any) => {
  return typeof option === 'object' && option !== null ? option[props.displayKey] : option;
};

const getValue = (option: any) => {
  return typeof option === 'object' && option !== null ? option[props.valueKey] : option;
};

const isSelected = (option: any) => {
  const val = getValue(option);
  return selectedOptions.value.some(item => getValue(item) === val);
};

// Sync internal state with external v-model if it changes from outside
watch(() => props.modelValue, (newVal) => {
  if (Array.isArray(newVal)) {
    selectedOptions.value = [...newVal];
  }
}, { deep: true });

const emitUpdate = () => {
  emit('update:modelValue', selectedOptions.value);
  emit('change', selectedOptions.value);
};

const fetchResults = async (searchQuery: string) => {
  if (!searchQuery) {
    options.value = [];
    return;
  }
  
  loading.value = true;
  try {
    options.value = await props.fetchOptions(searchQuery);
  } catch (err) {
    console.error('Failed to fetch options', err);
    options.value = [];
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  isOpen.value = true;
  if (searchTimeout) clearTimeout(searchTimeout);
  
  if (!query.value) {
    options.value = [];
    return;
  }
  
  searchTimeout = setTimeout(() => {
    fetchResults(query.value);
  }, 300);
};

const openDropdown = () => {
  if (props.disabled) return;
  isOpen.value = true;
  if (query.value && options.value.length === 0) {
    fetchResults(query.value);
  }
};

const focusInput = () => {
  if (!props.disabled && inputRef.value) {
    inputRef.value.focus();
  }
};

const selectOption = (option: any) => {
  if (isSelected(option)) {
    selectedOptions.value = selectedOptions.value.filter(item => getValue(item) !== getValue(option));
  } else {
    selectedOptions.value.push(option);
  }
  
  query.value = '';
  options.value = [];
  emitUpdate();
  focusInput();
};

const removeItem = (index: number) => {
  selectedOptions.value.splice(index, 1);
  emitUpdate();
};

const onBackspace = () => {
  if (query.value === '' && selectedOptions.value.length > 0) {
    selectedOptions.value.pop();
    emitUpdate();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    query.value = '';
    options.value = [];
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
