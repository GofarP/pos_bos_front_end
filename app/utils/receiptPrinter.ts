import type { Transaction } from '~/types/transaction.type'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function printThermalReceipt(transaction: Transaction | null, paperWidth: '58mm' | '80mm' = '80mm') {
  if (!transaction || !process.client) return

  const is58 = paperWidth === '58mm'
  const pageSize = is58 ? '58mm 160mm' : '80mm 180mm'
  const bodyWidth = is58 ? '52mm' : '72mm'
  const fontSize = is58 ? '10px' : '11px'
  const titleSize = is58 ? '14px' : '16px'

  const itemsHtml = (transaction.items || []).map(item => `
    <div style="margin-bottom: 4px;">
      <div style="font-weight: bold; font-size: ${fontSize};">${item.product_name || ('Produk #' + item.product_id)}</div>
      <div style="display: flex; justify-content: space-between; font-size: ${is58 ? '9px' : '10px'}; color: #111;">
        <span>${item.quantity} x ${formatCurrency(item.price)}</span>
        <span style="font-weight: bold;">${formatCurrency(item.subtotal)}</span>
      </div>
    </div>
  `).join('')

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Struk #${transaction.invoice_number}</title>
        <style>
          @page {
            size: ${pageSize};
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
          html, body {
            width: ${bodyWidth};
            margin: 0 auto;
            padding: 4px 2px;
            font-family: 'Courier New', Courier, monospace;
            font-size: ${fontSize};
            line-height: 1.3;
            color: #000;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 6px;
          }
          .store-name {
            font-size: ${titleSize};
            font-weight: bold;
            margin: 0 0 2px 0;
            text-transform: uppercase;
          }
          .store-sub {
            font-size: 9px;
            margin: 1px 0;
            color: #222;
          }
          .divider {
            border-bottom: 1px dashed #000;
            margin: 5px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            margin: 2px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: ${is58 ? '12px' : '13px'};
            font-weight: bold;
            margin: 4px 0;
          }
          .footer {
            text-align: center;
            font-size: 8.5px;
            margin-top: 8px;
            color: #222;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 class="store-name">POS BOS</h2>
          <p class="store-sub">Jl. Merdeka No. 123, Jakarta</p>
          <p class="store-sub">Telp: 0812-3456-7890</p>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span>No. Nota:</span>
          <span style="font-weight: bold;">${transaction.invoice_number}</span>
        </div>
        <div class="info-row">
          <span>Tanggal:</span>
          <span>${formatDate(transaction.created_at)}</span>
        </div>
        <div class="info-row">
          <span>Kasir:</span>
          <span>${transaction.user_name || 'Kasir'}</span>
        </div>

        <div class="divider"></div>

        <div>${itemsHtml}</div>

        <div class="divider"></div>

        <div class="total-row">
          <span>TOTAL</span>
          <span>${formatCurrency(transaction.total_amount)}</span>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p style="margin: 2px 0;">Terima Kasih Atas Kunjungan Anda</p>
          <p style="margin: 2px 0;">Barang yang sudah dibeli tidak dapat dikembalikan</p>
        </div>
      </body>
    </html>
  `

  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'fixed'
  printFrame.style.right = '0'
  printFrame.style.bottom = '0'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = '0'
  document.body.appendChild(printFrame)

  const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument
  if (!frameDoc || !printFrame.contentWindow) {
    document.body.removeChild(printFrame)
    return
  }

  frameDoc.open()
  frameDoc.write(printContent)
  frameDoc.close()

  setTimeout(() => {
    printFrame.contentWindow?.focus()
    printFrame.contentWindow?.print()
    setTimeout(() => {
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame)
      }
    }, 1000)
  }, 200)
}
