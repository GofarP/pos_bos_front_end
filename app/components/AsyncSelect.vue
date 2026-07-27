<template>
  <div class="flex flex-col gap-1.5 w-full relative" ref="containerRef">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        type="text"
        v-model="query"
        @focus="openDropdown"
        @input="onSearch"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full py-2.5 px-4 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none pr-10',
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20',
          disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
            : 'text-gray-900 hover:border-gray-400'
        ]"
      />
      
      <!-- Icons (Spinner / Chevron) -->
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
            class="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors flex items-center"
          >
            {{ getDisplayValue(option) }}
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
  modelValue?: any;
  label?: string;
  placeholder?: string;
  fetchOptions: (query: string) => Promise<any[]>;
  displayKey?: string;
  valueKey?: string;
  error?: string;
  disabled?: boolean;
}>(), {
  displayKey: 'label',
  valueKey: 'value',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change', option: any): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const query = ref('');
const isOpen = ref(false);
const options = ref<any[]>([]);
const loading = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const getDisplayValue = (option: any) => {
  return typeof option === 'object' && option !== null ? option[props.displayKey] : option;
};

const getValue = (option: any) => {
  return typeof option === 'object' && option !== null ? option[props.valueKey] : option;
};

watch(() => props.modelValue, (newVal) => {
  if (newVal === null || newVal === undefined || newVal === '') {
    query.value = '';
    return;
  }
  
  if (typeof newVal === 'object') {
    query.value = getDisplayValue(newVal);
  } else {
    const opt = options.value.find(o => getValue(o) === newVal);
    if (opt) {
      query.value = getDisplayValue(opt);
    } else {
      // Jika value-nya primitif dan opsi belum ada, kita tampilkan value-nya sementara.
      // Sebaiknya parent mengirim objek atau opsi sudah di-load.
      query.value = String(newVal);
    }
  }
}, { immediate: true });

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

const selectOption = (option: any) => {
  query.value = getDisplayValue(option);
  isOpen.value = false;
  emit('update:modelValue', getValue(option));
  emit('change', option);
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    
    if (props.modelValue) {
      if (typeof props.modelValue === 'object') {
        query.value = getDisplayValue(props.modelValue);
      } else {
        const opt = options.value.find(o => getValue(o) === props.modelValue);
        query.value = opt ? getDisplayValue(opt) : String(props.modelValue);
      }
    } else {
      query.value = '';
    }
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
