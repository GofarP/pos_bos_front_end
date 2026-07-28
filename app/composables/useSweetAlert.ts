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

  const showConfirm = async (title: string, text: string, confirmButtonText: string = 'Ya') => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText: 'Batal'
    })
    return result.isConfirmed
  }

  return {
    Toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  }
}
