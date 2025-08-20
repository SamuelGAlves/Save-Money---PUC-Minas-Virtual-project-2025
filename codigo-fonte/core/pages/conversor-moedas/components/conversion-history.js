import { i18n } from '../../../i18n/i18n.js';
import { formatCurrencyCode } from '../../../utils/currency.js';
import secureStorage from '../../../services/secure-storage.js';

export class ConversionHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.history = [];
    this.maxHistoryItems = 10;
  }

  async connectedCallback() {
    await this.loadHistory();
    this.render();
    this.setupEventListeners();
  }

  async loadHistory() {
    try {
      const storedHistory = await secureStorage.getItem(localStorage, 'converter_history');
      this.history = storedHistory || [];
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      this.history = [];
    }
  }

  async addToHistory(conversion) {
    try {
      // Carrega o histórico atual antes de adicionar
      await this.loadHistory();

      // Verifica se já existe uma conversão idêntica nos últimos 5 segundos
      const now = new Date();
      const fiveSecondsAgo = new Date(now.getTime() - 5000);

      const isDuplicate = this.history.some(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate > fiveSecondsAgo &&
               item.fromAmount === conversion.fromAmount &&
               item.toAmount === conversion.toAmount &&
               item.fromCurrency === conversion.fromCurrency &&
               item.toCurrency === conversion.toCurrency;
      });

      if (isDuplicate) {
        return; // Não adiciona se for uma duplicata recente
      }

      // Cria um novo array com a nova conversão no início
      const newHistory = [
        {
          ...conversion,
          timestamp: new Date().toISOString()
        },
        ...this.history
      ];

      // Limita o histórico ao número máximo de itens
      if (newHistory.length > this.maxHistoryItems) {
        this.history = newHistory.slice(0, this.maxHistoryItems);
      } else {
        this.history = newHistory;
      }

      // Salva o histórico atualizado no secureStorage
      await secureStorage.setItem(localStorage, 'converter_history', this.history);

      // Atualiza a interface
      this.render();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }

  async clearHistory() {
    try {
      this.history = [];
      await secureStorage.removeItem(localStorage, 'converter_history');
      this.render();
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  setupEventListeners() {
    const clearButton = this.shadowRoot.getElementById('clearHistoryButton');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearHistory();
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .history-section {
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .history-section:empty {
          display: none;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .history-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: var(--background-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);
          transition: transform 0.2s ease;
        }

        .history-item:hover {
          transform: translateX(5px);
        }

        .history-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .history-item-amount {
          font-weight: 500;
        }

        .history-item-date {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .history-item-rate {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .clear-history-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .clear-history-button:hover {
          color: var(--error-color);
        }

        .empty-history {
          text-align: center;
          color: var(--text-secondary);
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .history-section {
            padding: 1rem;
          }

          .history-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .history-item-rate {
            align-self: flex-end;
          }
        }
      </style>

      ${this.history.length > 0 ? `
        <div class="history-section">
          <div class="history-header">
            <div class="history-title">
              <app-icon>history</app-icon>
              ${i18n.getTranslation('converter.history')}
            </div>
            <button class="clear-history-button" id="clearHistoryButton">
              <app-icon>delete</app-icon>
              ${i18n.getTranslation('converter.clearHistory')}
            </button>
          </div>
          <div class="history-list">
            ${this.history.map(item => `
              <div class="history-item">
                <div class="history-item-info">
                  <div class="history-item-amount">
                    ${formatCurrencyCode(item.fromAmount, item.fromCurrency)} → ${formatCurrencyCode(item.toAmount, item.toCurrency)}
                  </div>
                  <div class="history-item-date">
                    ${new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div class="history-item-rate">
                  1 ${item.fromCurrency} = ${formatCurrencyCode(item.rate, item.toCurrency)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('conversion-history', ConversionHistory);
