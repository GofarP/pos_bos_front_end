<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white sm:px-6">
    <div class="flex flex-col sm:flex-row sm:flex-1 sm:items-center sm:justify-between w-full gap-4 sm:gap-0">
      <!-- Info Teks (Hanya Desktop) -->
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700" v-if="totalItems !== undefined">
          Menampilkan
          <span class="font-medium">{{ startIndex }}</span>
          sampai
          <span class="font-medium">{{ endIndex }}</span>
          dari
          <span class="font-medium">{{ totalItems }}</span>
          hasil
        </p>
        <p class="text-sm text-gray-700" v-else>
          Halaman <span class="font-medium">{{ currentPage }}</span> dari <span class="font-medium">{{ totalPages }}</span>
        </p>
      </div>

      <!-- Tombol Navigasi (Mobile & Desktop) -->
      <div class="flex justify-center w-full sm:w-auto">
        <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- First Page -->
          <button 
            @click="goToPage(1)"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">First</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Previous Page -->
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Numbered Pages -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage 
                ? 'relative z-10 inline-flex items-center bg-emerald-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            ]"
          >
            {{ page }}
          </button>

          <!-- Next Page -->
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Last Page -->
          <button 
            @click="goToPage(totalPages)"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Last</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.21 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 01-.02-1.06zm6 0a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L14.168 10l-3.938-3.71a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
}>();

const startIndex = computed(() => {
  if (!props.totalItems || props.totalItems === 0) return 0;
  return (props.currentPage - 1) * (props.itemsPerPage || 10) + 1;
});

const endIndex = computed(() => {
  if (!props.totalItems) return 0;
  return Math.min(props.currentPage * (props.itemsPerPage || 10), props.totalItems);
});

// Menampilkan maksimal 5 tombol halaman di pagination
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) pages.push(i);
  } else {
    let start = Math.max(1, props.currentPage - 2);
    let end = Math.min(props.totalPages, props.currentPage + 2);
    
    if (start === 1) end = maxVisible;
    if (end === props.totalPages) start = props.totalPages - maxVisible + 1;
    
    for (let i = start; i <= end; i++) pages.push(i);
  }
  
  return pages;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:page', page);
  }
};
</script>
