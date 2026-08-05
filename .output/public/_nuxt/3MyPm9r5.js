var e=e=>new Intl.NumberFormat(`id-ID`,{style:`currency`,currency:`IDR`,minimumFractionDigits:0}).format(e),t=e=>{if(!e)return`-`;let t=new Date(e);return new Intl.DateTimeFormat(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}).format(t)};function n(n,r=`80mm`){if(!n)return;let i=r===`58mm`,a=i?`58mm 160mm`:`80mm 180mm`,o=i?`52mm`:`72mm`,s=i?`10px`:`11px`,c=i?`14px`:`16px`,l=(n.items||[]).map(t=>`
    <div style="margin-bottom: 4px;">
      <div style="font-weight: bold; font-size: ${s};">${t.product_name||`Produk #`+t.product_id}</div>
      <div style="display: flex; justify-content: space-between; font-size: ${i?`9px`:`10px`}; color: #111;">
        <span>${t.quantity} x ${e(t.price)}</span>
        <span style="font-weight: bold;">${e(t.subtotal)}</span>
      </div>
    </div>
  `).join(``),u=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Struk #${n.invoice_number}</title>
        <style>
          @page {
            size: ${a};
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
          html, body {
            width: ${o};
            margin: 0 auto;
            padding: 4px 2px;
            font-family: 'Courier New', Courier, monospace;
            font-size: ${s};
            line-height: 1.3;
            color: #000;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 6px;
          }
          .store-name {
            font-size: ${c};
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
            font-size: ${i?`12px`:`13px`};
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
          <span style="font-weight: bold;">${n.invoice_number}</span>
        </div>
        <div class="info-row">
          <span>Tanggal:</span>
          <span>${t(n.created_at)}</span>
        </div>
        <div class="info-row">
          <span>Kasir:</span>
          <span>${n.user_name||`Kasir`}</span>
        </div>

        <div class="divider"></div>

        <div>${l}</div>

        <div class="divider"></div>

        <div class="total-row">
          <span>TOTAL</span>
          <span>${e(n.total_amount)}</span>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p style="margin: 2px 0;">Terima Kasih Atas Kunjungan Anda</p>
          <p style="margin: 2px 0;">Barang yang sudah dibeli tidak dapat dikembalikan</p>
        </div>
      </body>
    </html>
  `,d=document.createElement(`iframe`);d.style.position=`fixed`,d.style.right=`0`,d.style.bottom=`0`,d.style.width=`0`,d.style.height=`0`,d.style.border=`0`,document.body.appendChild(d);let f=d.contentWindow?.document||d.contentDocument;if(!f||!d.contentWindow){document.body.removeChild(d);return}f.open(),f.write(u),f.close(),setTimeout(()=>{d.contentWindow?.focus(),d.contentWindow?.print(),setTimeout(()=>{document.body.contains(d)&&document.body.removeChild(d)},1e3)},200)}export{n as t};