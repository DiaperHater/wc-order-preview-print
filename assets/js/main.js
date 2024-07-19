(() => {
  let observer = new MutationObserver((mutationList, observer) => {

    for (const mutation of mutationList) {

      if (noAddedNodes(mutation)) {
        continue
      }

      const modal = findModal(mutation)
      if (!modal) {
        continue
      }

      modalFieldsJson = modalToJson(modal)
      const contentEl = modal.querySelector('article')
      if (!contentEl) {
        continue
      }

      let products = ""
      modalFieldsJson.products.forEach(product => {

        product.item = product.item.replace(/(<a href="(.+\.(jpg|jpeg|png))">.+\.(jpg|jpeg|png))/, "$1<img src='$2' style='max-width: 100%'>")

        products += `        
        <div>
          <p><strong>Товар:</strong> ${product.item}</p>
          <p><strong>Кол-во:</strong> ${product.quantity}</p>
          <p><strong>Сумма:</strong> ${product.total}</p>
        </div>
        <hr/>
      `
      })

      contentEl.innerHTML = `
      <style>
        .wc-backbone-modal .wc-backbone-modal-content {
          min-width: 240px;
          max-width: 320px;
          padding: 32px 8px;
        }

        .wc-order-preview-print-container * {
            display: block;
            margin-top: 8px;
            margin-bottom: 8px;
        }
      </style>

      <div class="wc-order-preview-print-container">
        <h2>${modalFieldsJson.orderId}</h2>
        <div>
          ${modalFieldsJson.billingDetails}
        </div>
        <div>
          ${modalFieldsJson.shippingDetails}
        </div>
        <div>
          <h2>Products:</h2>
          ${products}
        </div>
        <button onclick="window.printOrderPreview()">Печать</button>
      </div>
    `
    }
  })
  observer.observe(document.body, { childList: true, subtree: true, characterDataOldValue: true })


  function noAddedNodes(mutation) {
    return mutation.type != "childList" || !mutation.addedNodes
  }

  function findModal(mutation) {
    return Array.from(mutation.addedNodes).find(element => element.id == "wc-backbone-modal-dialog")
  }

  function modalToJson(modal) {
    let data = {}
    let element = undefined

    if (element = modal.querySelector('h1')) {
      data['orderId'] = element.innerText.match(/(\d+)/)[0]
    }
    if (element = modal.querySelector('.wc-order-preview-address')) {
      data['billingDetails'] = element.innerHTML
    }
    if (element = modal.querySelector('.wc-order-preview-address:nth-child(2)')) {
      data['shippingDetails'] = element.innerHTML.replace(/\s{2,}/g, '')
    }
    if (element = modal.querySelector('.wc-order-preview-table')) {
      const items = element.querySelectorAll('.wc-order-preview-table__item')
      data['products'] = []
      items.forEach((item, index) => {
        data['products'][index] = []
        let productEl = item.querySelector('.wc-order-preview-table__column--product')
        if (productEl) {
          data['products'][index]['item'] = productEl.innerHTML
        }
        let quantityEl = item.querySelector('.wc-order-preview-table__column--quantity')
        if (quantityEl) {
          data['products'][index]['quantity'] = quantityEl.innerText
        }
        let totalEl = item.querySelector('.wc-order-preview-table__column--total')
        if (totalEl) {
          data['products'][index]['total'] = totalEl.innerText.match(/\d{1,2},\d{2}/)[0]
        }
      })
    }

    return data
  }

  window.printOrderPreview = () => {

    const style = `
    <style>      
      .wc-order-preview-print-container {        
        width: 100%
        padding: 32px 8px;
      }
      .wc-order-preview-print-container * {
        display: block;          
        margin-top: 8px;
        margin-bottom: 8px;
      }
      .wc-order-preview-print-container button {
        display: none;
      }
    </style>
  `
    const html = document.querySelector(".wc-order-preview-print-container").outerHTML
    w = window.open()
    w.document.write(style + html)
    w.print()
    w.close()
  }

})()