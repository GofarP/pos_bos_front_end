import { ref } from 'vue'
import { useRouter, useCookie } from '#imports'

export function useAuth() {
  const router = useRouter()
  
  const form = ref({ email: '', password: '' })
  const errors = ref({ email: '', password: '', server: '' })
  const isLoading = ref(false)

  const handleLogin = async () => {
    errors.value = { email: '', password: '', server: '' }
    isLoading.value = true

    try {
      const response = await authService.login(form.value)
      
      // Cookie HttpOnly (access_token & refresh_token) otomatis dipasang oleh browser dari respon server
      // Kita tidak perlu menyimpan token secara manual di Javascript lagi.

      
      const swal = useSweetAlert()
      swal.showSuccess('Login berhasil!')
      
      router.push('/')

    } catch (err: any) {
      const data = err.response?.data

      if (data) {
        errors.value.server = data.error || ''
        Object.assign(errors.value, data.errors || {})
      } else {
        errors.value.server = 'Gagal terhubung ke server backend.'
      }
    } finally {
      isLoading.value = false
    }
  }

  return { form, errors, isLoading, handleLogin }
}
