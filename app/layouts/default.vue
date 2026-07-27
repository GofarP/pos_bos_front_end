<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Wrapper -->
    <div class="flex-1 lg:pl-64 flex flex-col min-h-screen">
      <!-- Main Content Area -->
      <!-- Added pt-20 for mobile because the mobile header is 16 (4rem) -->
      <main class="flex-1 p-6 pt-20 lg:pt-6 overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
