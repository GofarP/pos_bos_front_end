import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthUser } from '~/composables/useAuthUser'
import { authService } from '~/utils/auth.service'
import { useSweetAlert } from '~/composables/useSweetAlert'

export function useAuth() {
  const router = useRouter()
  const { fetchCurrentUser, clearUser } = useAuthUser()
  const swal = useSweetAlert()
  
  const form = ref({ email: '', password: '' })
  const errors = ref({ email: '', password: '', server: '' })
  const isLoading = ref(false)

  const handleLogin = async () => {
    errors.value = { email: '', password: '', server: '' }
    isLoading.value = true

    try {
      await authService.login(form.value)
      
      clearUser()
      await fetchCurrentUser(true)
      
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
