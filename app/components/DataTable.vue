<template>
  <div class="w-full">
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-4 font-semibold whitespace-nowrap"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.label }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="(row, rowIndex) in data" 
            :key="rowIndex" 
            class="hover:bg-gray-50 transition-colors group"
          >
            <td 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-4 text-gray-700"
            >
              <slot :name="`cell-${col.key}`" :row="row" :column="col" :value="row[col.key]" :index="rowIndex">
                <template v-if="col.key === 'no'">
                  {{ pagination ? (pagination.currentPage - 1) * (pagination.itemsPerPage || 10) + rowIndex + 1 : rowIndex + 1 }}
                </template>
                <template v-else>
                  {{ row[col.key] }}
                </template>
              </slot>
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Tidak ada data</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden flex flex-col gap-4">
      <div 
        v-for="(row, rowIndex) in data" 
        :key="rowIndex" 
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <slot name="mobile-card" :row="row" :index="rowIndex">
          <div class="p-4 flex flex-col gap-3">
            <div 
              v-for="col in columns" 
              :key="col.key" 
              class="flex flex-col"
            >
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                <slot :name="`header-${col.key}`" :column="col">
                  {{ col.label }}
                </slot>
              </span>
              <div class="text-sm text-gray-900">
                <slot :name="`cell-${col.key}`" :row="row" :column="col" :value="row[col.key]" :index="rowIndex">
                  <template v-if="col.key === 'no'">
                    {{ pagination ? (pagination.currentPage - 1) * (pagination.itemsPerPage || 10) + rowIndex + 1 : rowIndex + 1 }}
                  </template>
                  <template v-else>
                    {{ row[col.key] }}
                  </template>
                </slot>
              </div>
            </div>
          </div>
        </slot>
      </div>
      <div v-if="data.length === 0" class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        <div class="flex flex-col items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <span>Tidak ada data</span>
        </div>
      </div>
    </div>

    <!-- Pagination Integration -->
    <div v-if="pagination" class="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Pagination 
        :current-page="pagination.currentPage" 
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :items-per-page="pagination.itemsPerPage"
        @update:page="$emit('page-change', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  key: string;
  label: string;
  [key: string]: any;
}

export interface PaginationOptions {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const props = defineProps<{
  data: any[];
  columns: TableColumn[];
  pagination?: PaginationOptions;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();
</script>
