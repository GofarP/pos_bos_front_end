<template>
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto mt-10">
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
        <svg class="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-emerald-900 mb-2">Login ke PosBos</h1>
      <p class="text-sm text-gray-500">Masukkan email dan password Anda untuk masuk.</p>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
      <!-- Email Input -->
      <Input 
        id="email"
        v-model="form.email"
        label="Alamat Email"
        type="email"
        placeholder="nama@email.com"
        :error="errors.email"
      />

      <!-- Password Input -->
      <Input 
        id="password"
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
      />

      <!-- <div class="flex items-center justify-between mt-1">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded">
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Ingat saya
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500">
            Lupa password?
          </a>
        </div>
      </div> -->

      <div class="mt-4">
        <!-- Tampilkan Error Server (dari API) -->
        <div v-if="errors.server" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ errors.server }}
        </div>

        <Button type="submit" color="green" class="w-full" :disabled="isLoading">
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Masuk Sekarang</span>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

// Clean Code: Semua logika form ditarik dari composables!
// File ini sekarang murni hanya untuk UI.
const { form, errors, isLoading, handleLogin } = useAuth()
</script>
