import { i18n } from '../../i18n/i18n.js';

class ReportSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'value', 'type', 'items', 'recurring'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title');
    const value = this.getAttribute('value');
    const type = this.getAttribute('type');
    const items = this.getAttribute('items') || '0';
    const recurring = this.getAttribute('recurring') || '0';

    this.shadowRoot.innerHTML = `
      <style>
        .summary-item {
          padding: 1rem;
          background-color: var(--surface-color);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
        }

        .summary-item-title {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .summary-item-value {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .summary-item-value.positive {
          color: var(--color-success);
        }

        .summary-item-value.negative {
          color: var(--color-danger);
        }

        .summary-item-details {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .summary-item-detail {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .summary-item-detail i {
          font-size: 0.9rem;
        }
      </style>

      <div class="summary-item">
        <div class="summary-item-title">${title}</div>
        <div class="summary-item-value ${type}">R$ ${parseFloat(value).toFixed(2)}</div>
        <div class="summary-item-details">
          <div class="summary-item-detail">
            <app-icon>list</app-icon>
            ${items} ${i18n.getTranslation('reports.items')}
          </div>
          <div class="summary-item-detail">
            <app-icon>sync</app-icon>
            ${recurring} ${i18n.getTranslation('reports.recurring')}
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('report-summary-card')) {
  customElements.define('report-summary-card', ReportSummaryCard);
}

export default ReportSummaryCard;
