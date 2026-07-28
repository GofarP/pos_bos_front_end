<template>
  <div class="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 shadow-sm transition-all duration-200">
    <!-- Toolbar -->
    <div class="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
      
      <!-- Text formatting -->
      <div class="flex gap-1 items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm">
        <button type="button" @click="format('bold')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </button>
        <button type="button" @click="format('italic')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Italic">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </button>
        <button type="button" @click="format('underline')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Underline">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </button>
      </div>

      <!-- Headings -->
      <div class="flex gap-1 items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm ml-1">
        <button type="button" @click="format('formatBlock', 'H1')" class="px-2 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors font-bold text-xs" title="Heading 1">H1</button>
        <button type="button" @click="format('formatBlock', 'H2')" class="px-2 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors font-bold text-xs" title="Heading 2">H2</button>
        <button type="button" @click="format('formatBlock', 'P')" class="px-2 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors font-bold text-xs" title="Paragraph">P</button>
      </div>

      <!-- Lists -->
      <div class="flex gap-1 items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm ml-1">
        <button type="button" @click="format('insertUnorderedList')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Bullet List">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button type="button" @click="format('insertOrderedList')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Numbered List">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>
      </div>

      <!-- History and clear -->
      <div class="flex gap-1 items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm ml-auto">
        <button type="button" @click="format('undo')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button type="button" @click="format('redo')" class="p-1.5 text-gray-700 hover:bg-gray-100 hover:text-emerald-600 rounded transition-colors" title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>
        <div class="w-px h-4 bg-gray-200 mx-1"></div>
        <button type="button" @click="clearFormatting" class="p-1.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors" title="Clear Formatting">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
      </div>

    </div>

    <!-- Editor Area -->
    <div 
      ref="editor"
      class="p-4 min-h-[250px] outline-none editor-content max-w-none w-full text-gray-800 bg-white"
      contenteditable="true"
      :placeholder="placeholder"
      @input="onInput"
      @blur="onBlur"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue: string,
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = ref<HTMLElement | null>(null)
let isUpdatingFromProp = false

const format = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  editor.value?.focus()
  updateModel()
}

const clearFormatting = () => {
  document.execCommand('removeFormat', false)
  editor.value?.focus()
  updateModel()
}

const updateModel = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}

const onInput = () => {
  updateModel()
}

const onBlur = () => {
  updateModel()
}

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = props.modelValue || ''
    
    // Setup default paragraph behavior instead of div
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.innerHTML) {
    isUpdatingFromProp = true
    editor.value.innerHTML = newValue || ''
    isUpdatingFromProp = false
  }
})
</script>

<style scoped>
/* Styling for the editor content specifically */
.editor-content {
  font-family: inherit;
  line-height: 1.6;
}
.editor-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #111827;
}
.editor-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}
.editor-content :deep(p) {
  margin-bottom: 0.75rem;
}
.editor-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
.editor-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
.editor-content :deep(b), .editor-content :deep(strong) {
  font-weight: 600;
}
.editor-content :deep(i), .editor-content :deep(em) {
  font-style: italic;
}
.editor-content :deep(u) {
  text-decoration: underline;
}
.editor-content:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; 
  color: #9ca3af;
}
</style>
