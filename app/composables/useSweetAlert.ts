import Swal from 'sweetalert2'

export function useSweetAlert() {
  // Konfigurasi khusus untuk Toast (pojok kanan atas)
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  // Fungsi-fungsi modular yang bisa langsung dipanggil
  const showSuccess = (title: string) => {
    return Toast.fire({
      icon: 'success',
      title
    })
  }

  const showError = (title: string) => {
    return Toast.fire({
      icon: 'error',
      title
    })
  }

  const showWarning = (title: string) => {
    return Toast.fire({
      icon: 'warning',
      title
    })
  }

  const showInfo = (title: string) => {
    return Toast.fire({
      icon: 'info',
      title
    })
  }

  return {
    Toast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
