class ShoppingList {
  constructor() {
      this.items = JSON.parse(localStorage.getItem('shoppingList')) || [];
      this.init();
  }

  init() {
      this.setupEventListeners();
      this.renderItems();
      this.updateStats();
  }

  setupEventListeners() {
      const form = document.getElementById('shopping-form');
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  handleFormSubmit(e) {
      e.preventDefault();
      
      const productName = document.getElementById('product-name').value.trim();
      const quantity = parseInt(document.getElementById('product-quantity').value);
      
      if (productName && quantity > 0) {
          this.addItem(productName, quantity);
          e.target.reset();
          document.getElementById('product-quantity').value = 1;
      }
  }

  addItem(name, quantity) {
      const item = {
          id: Date.now(),
          name: name,
          quantity: quantity,
          dateAdded: new Date().toLocaleDateString('pt-PT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })
      };

      this.items.push(item);
      this.saveToLocalStorage();
      this.renderItems();
      this.updateStats();
      this.showNotification('Item adicionado com sucesso!');
  }

  removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveToLocalStorage();
      this.renderItems();
      this.updateStats();
      this.showNotification('Item removido da lista!');
  }

  renderItems() {
      const container = document.getElementById('items-container');
      const emptyMessage = document.getElementById('empty-message');

      if (this.items.length === 0) {
          container.innerHTML = '';
          emptyMessage.style.display = 'block';
          return;
      }

      emptyMessage.style.display = 'none';
      
      container.innerHTML = this.items.map(item => `
          <div class="item" data-id="${item.id}">
              <div class="item-info">
                  <div class="item-name">${this.escapeHtml(item.name)}</div>
                  <div class="item-details">Adicionado em: ${item.dateAdded}</div>
              </div>
              <div class="item-quantity">${item.quantity}</div>
              <button class="btn-remove" onclick="shoppingList.removeItem(${item.id})">
                  Remover
              </button>
          </div>
      `).join('');
  }

  updateStats() {
      const totalItems = this.items.length;
      const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
      
      document.getElementById('total-items').textContent = totalItems;
      document.getElementById('total-quantity').textContent = totalQuantity;
  }

  saveToLocalStorage() {
      localStorage.setItem('shoppingList', JSON.stringify(this.items));
  }

  escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
  }

  showNotification(message) {
      // Criar uma notificação temporária
      const notification = document.createElement('div');
      notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: slideIn 0.3s ease;
      `;
      notification.textContent = message;
      
      // Adicionar CSS para animação
      if (!document.getElementById('notification-styles')) {
          const style = document.createElement('style');
          style.id = 'notification-styles';
          style.textContent = `
              @keyframes slideIn {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
              }
          `;
          document.head.appendChild(style);
      }
      
      document.body.appendChild(notification);
      
      // Remover após 3 segundos
      setTimeout(() => {
          notification.remove();
      }, 3000);
  }
}

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.shoppingList = new ShoppingList();
});