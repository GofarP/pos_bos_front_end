<template>
  <div>
    <!-- Mobile overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
      @click="isOpen = false"
    ></div>

    <!-- Sidebar component -->
    <aside 
      :class="[
        'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="flex items-center gap-3 text-emerald-600 font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PosBos
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem-5rem)]">
        <div v-for="group in visibleMenuGroups" :key="group.title">
          <!-- Section Title -->
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {{ group.title }}
          </h3>
          
          <!-- Menu Items -->
          <div class="space-y-1">
            <template v-for="item in group.items" :key="item.name">
              
              <!-- Menu Parent dengan Dropdown (jika memiliki child) -->
              <div v-if="item.children">
                <button 
                  @click="toggleMenu(item.name)"
                  class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div class="flex items-center gap-3">
                    <div v-html="item.icon" class="w-5 h-5"></div>
                    {{ item.name }}
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="2" 
                    stroke="currentColor" 
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': openMenus[item.name] }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                <!-- Child Items -->
                <div 
                  v-show="openMenus[item.name]" 
                  class="mt-1 space-y-1 pl-11 pr-3"
                >
                  <NuxtLink 
                    v-for="child in item.children" 
                    :key="child.path"
                    :to="child.path"
                    class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="[
                      route.path === child.path 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                    @click="isOpen = false"
                  >
                    {{ child.name }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Menu Biasa (Tanpa Dropdown) -->
              <NuxtLink 
                v-else
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  route.path === item.path 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
                @click="isOpen = false"
              >
                <div v-html="item.icon" class="w-5 h-5"></div>
                {{ item.name }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>

      <!-- Logout Button (Bottom) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Header (Visible only on small screens) -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-30">
      <div class="flex items-center gap-2 text-emerald-600 font-bold text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        PosBos
      </div>
      <button 
        @click="isOpen = true"
        class="p-2 -mr-2 text-gray-500 hover:text-gray-900 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import { authService } from '~/utils/auth.service'
import { useUser } from '~/composables/useUser'

const isOpen = ref(false)
const route = useRoute()
const router = useRouter()
const swal = useSweetAlert()

const { fetchCurrentUser, hasPermission } = useUser()

onMounted(() => {
  fetchCurrentUser()
})

const openMenus = ref<Record<string, boolean>>({})

const toggleMenu = (menuName: string) => {
  openMenus.value[menuName] = !openMenus.value[menuName]
}

const handleLogout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Logout error', error)
  } finally {
    authService.removeToken()
    swal.showSuccess('Logout berhasil')
    router.push('/login')
  }
}

interface MenuItem {
  name: string
  path: string
  icon: string
  permission?: string | string[]
  children?: MenuItem[]
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const rawMenuGroups: MenuGroup[] = [
  {
    title: 'Main',
    items: [
      {
        name: 'Dashboard',
        path: '/',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`
      }
    ]
  },
  {
    title: 'Master Data',
    items: [
      {
        name: 'Kategori',
        path: '/category',
        permission: 'view.category',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`
      },
      {
        name: 'Produk',
        path: '/products',
        permission: 'create.product',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`
      }
    ]
  },
  {
    title: 'Transaksi',
    items: [
      {
        name: 'Kasir (POS)',
        path: '/pos',
        permission: 'create.transaction',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>`
      },
      {
        name: 'Riwayat Transaksi',
        path: '/transactions',
        permission: 'view.transaction',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
      }
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      {
        name: 'Pengguna',
        path: '/users',
        permission: 'view.user',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`
      }
    ]
  },
  {
    title: 'Role & Permission',
    items: [
      {
        name: 'Role',
        path: '/roles',
        permission: 'view.role',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>`
      },
      {
        name: 'Permission',
        path: '/permissions',
        permission: 'view.permission',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`
      }
    ]
  }
]

const visibleMenuGroups = computed(() => {
  return rawMenuGroups
    .map(group => {
      const items = group.items.filter(item => {
        if (!item.permission) return true
        return hasPermission(item.permission)
      })
      return { ...group, items }
    })
    .filter(group => group.items.length > 0)
})
</script>
