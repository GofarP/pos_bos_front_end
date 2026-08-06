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

      <div class="relative mt-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Atau masuk dengan</span>
        </div>
      </div>

      <div class="mt-2">
        <a :href="googleLoginUrl" class="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const config = useRuntimeConfig()
const googleLoginUrl = `${config.public.apiBase}/auth/google/login`

// Clean Code: Semua logika form ditarik dari composables!
// File ini sekarang murni hanya untuk UI.
const { form, errors, isLoading, handleLogin } = useAuth()

useHead({
  title: 'Masuk'
})
</script>
