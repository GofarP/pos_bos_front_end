import { ref, reactive, watch } from 'vue'
import { userService } from '~/utils/user.service'
import type { User, PaginationMeta, Role } from '~/types/user.type'
import { useSweetAlert } from '~/composables/useSweetAlert'
import { useRuntimeConfig } from '#imports'

export function useUsers() {
  const swal = useSweetAlert()
  const config = useRuntimeConfig()

  // State Data
  const users = ref<User[]>([])
  const meta = ref<PaginationMeta>({ page: 1, limit: 10, total_records: 0, total_pages: 1 })
  const searchQuery = ref('')
  const isLoading = ref(false)

  // State Form Modal
  const isModalOpen = ref(false)
  const isEdit = ref(false)
  const isSaving = ref(false)
  const selectedUserId = ref<number | null>(null)

  const form = reactive({
    name: '',
    email: '',
    password: '',
    roles: [] as Role[],
    photo: null as File | null
  })

  const formErrors = ref({ name: '', email: '', password: '', photo: '', roles: '' })

  // URL Resolver untuk Foto
  const getPhotoUrl = (path: string) => {
    // Jika path sudah valid URL HTTP, kembalikan langsung
    if (path.startsWith('http')) return path
    // Jika belum, gabungkan dengan API Base URL
    return `${config.public.apiBase}/${path}`
  }

  // Fetch Data
  const fetchUsers = async (page = 1) => {
    isLoading.value = true
    try {
      const response = await userService.getUsers(page, meta.value.limit, searchQuery.value)
      users.value = response.data.data
      meta.value = response.data.meta
    } catch (error) {
      swal.showError('Gagal mengambil data pengguna' + error)
    } finally {
      isLoading.value = false
    }
  }

  // Debounced Search
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  watch(searchQuery, () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Beri jeda waktu 500ms agar tidak berulang kali hit API saat mengetik cepat
    searchTimeout = setTimeout(() => {
      fetchUsers(1)
    }, 500)
  })

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.value.total_pages) {
      fetchUsers(newPage)
    }
  }

  // Form Handlers
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      form.photo = target.files[0] || null
    } else {
      form.photo = null
    }
  }

  const openAddModal = () => {
    isEdit.value = false
    selectedUserId.value = null
    form.name = ''
    form.email = ''
    form.password = ''
    form.roles = []
    form.photo = null
    formErrors.value = { name: '', email: '', password: '', photo: '', roles: '' }
    isModalOpen.value = true
  }

  const openEditModal = (user: User) => {
    isEdit.value = true
    selectedUserId.value = user.id
    form.name = user.name
    form.email = user.email
    form.password = '' // Kosongkan password saat diedit
    form.roles = user.roles || []
    form.photo = null
    formErrors.value = { name: '', email: '', password: '', photo: '', roles: '' }
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const saveUser = async () => {
    isSaving.value = true
    try {
      // Siapkan FormData karena backend butuh Multipart untuk file upload
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)

      // Password (wajib jika tambah, opsional jika edit)
      if (form.password) {
        formData.append('password', form.password)
      }

      // Append roles (as JSON string or multiple fields depending on backend expectation)
      // Since backend might not support it yet, we just append it as JSON string
      if (form.roles && form.roles.length > 0) {
        const roleIds = form.roles.map(r => r.id)
        roleIds.forEach(id => formData.append('role_ids[]', id.toString()))
      }

      // Photo (opsional)
      if (form.photo) {
        formData.append('photo', form.photo)
      }

      if (isEdit.value && selectedUserId.value) {
        await userService.updateUser(selectedUserId.value, formData)
        swal.showSuccess('Pengguna berhasil diperbarui')
      } else {
        await userService.createUser(formData)
        swal.showSuccess('Pengguna berhasil ditambahkan')
      }

      closeModal()
      fetchUsers(meta.value.page) // Refresh data
    } catch (error: any) {
      const data = error.response?.data
      if (data?.errors) {
        // Bersihkan error lama
        formErrors.value = { name: '', email: '', password: '', photo: '', roles: '' }
        // Masukkan error baru dari backend
        Object.assign(formErrors.value, data.errors)
      } else {
        swal.showError(data?.error || 'Gagal menyimpan data pengguna')
      }
    } finally {
      isSaving.value = false
    }
  }

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await userService.deleteUser(id)
        swal.showSuccess('Pengguna berhasil dihapus')

        // Jika hapus di halaman terakhir dan sisa 1, balik ke halaman sebelumnya
        if (users.value.length === 1 && meta.value.page > 1) {
          fetchUsers(meta.value.page - 1)
        } else {
          fetchUsers(meta.value.page)
        }
      } catch (error: any) {
        swal.showError(error.response?.data?.error || 'Gagal menghapus pengguna')
      }
    }
  }

  return {
    users,
    meta,
    searchQuery,
    isLoading,
    isModalOpen,
    isEdit,
    isSaving,
    form,
    formErrors,
    getPhotoUrl,
    fetchUsers,
    changePage,
    handleFileUpload,
    openAddModal,
    openEditModal,
    closeModal,
    saveUser,
    handleDelete
  }
}
