<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" :class="{ 'pointer-events-none': !modelValue }">
        
        <!-- Background backdrop -->
        <Transition
          enter-active-class="transition-opacity ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="modelValue" class="fixed inset-0 bg-gray-900/40 pointer-events-auto" @click="closeModal"></div>
        </Transition>

        <div class="fixed inset-0 z-10 overflow-y-auto pointer-events-none">
          <div class="flex min-h-full items-end justify-center p-0 text-center md:items-center md:p-4">
            
            <!-- Modal panel -->
            <Transition
              enter-active-class="transition-all ease-out duration-300"
              enter-from-class="opacity-0 translate-y-full md:translate-y-4 md:scale-95"
              enter-to-class="opacity-100 translate-y-0 md:scale-100"
              leave-active-class="transition-all ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 md:scale-100"
              leave-to-class="opacity-0 translate-y-full md:translate-y-4 md:scale-95"
            >
              <div 
                v-if="modelValue" 
                class="relative mx-auto w-full rounded-t-2xl md:rounded-2xl bg-white text-left shadow-xl md:my-8 md:max-w-lg flex flex-col max-h-[90vh] pointer-events-auto"
                :style="{
                  transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : '',
                  transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }"
              >
                
                <!-- Handlebar for mobile -->
                <div 
                  class="w-full flex justify-center pt-3 pb-2 md:hidden bg-white rounded-t-2xl cursor-grab active:cursor-grabbing touch-none"
                  @touchstart="onTouchStart"
                  @touchmove="onTouchMove"
                  @touchend="onTouchEnd"
                >
                  <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                <!-- Content wrapper (scrollable) -->
                <div class="bg-white px-4 pt-2 pb-4 md:p-6 md:pb-4 overflow-y-auto flex-1">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    class="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
                    title="Tutup"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <h3 v-if="title" class="text-lg leading-6 font-bold text-gray-900 mb-4 text-center md:text-left pr-0 md:pr-8">
                    {{ title }}
                  </h3>
                  
                  <div class="text-left pb-4 md:pb-0">
                    <slot />
                  </div>
                </div>
                
                <!-- Footer -->
                <div v-if="$slots.footer" class="bg-gray-50 px-4 py-4 pb-8 md:pb-4 md:px-6 flex flex-col md:flex-row-reverse gap-3 mt-auto border-t border-gray-100 md:border-t-0 md:rounded-b-2xl">
                  <slot name="footer" />
                </div>
              </div>
            </Transition>

          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}

// === Swipe to Close Logic ===
const swipeOffset = ref(0)
const isSwiping = ref(false)
let touchStartY = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
  isSwiping.value = true
}

const onTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) return
  const currentY = e.touches[0].clientY
  const diff = currentY - touchStartY
  
  // Hanya izinkan swipe ke bawah
  if (diff > 0) {
    swipeOffset.value = diff
    // Prevent default untuk menghentikan scroll halaman saat handlebar ditarik
    e.preventDefault() 
  }
}

const onTouchEnd = () => {
  if (!isSwiping.value) return
  isSwiping.value = false
  
  if (swipeOffset.value > 100) {
    // Jika ditarik ke bawah lebih dari 100px, tutup modal
    swipeOffset.value = window.innerHeight // Teruskan animasi ke dasar layar
    closeModal()
    
    // Reset state setelah animasi selesai
    setTimeout(() => {
      swipeOffset.value = 0
    }, 300)
  } else {
    // Jika tidak cukup jauh, kembalikan ke posisi semula (memantul balik)
    swipeOffset.value = 0
  }
}
</script>
