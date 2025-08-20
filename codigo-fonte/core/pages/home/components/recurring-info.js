import { i18n } from '../../../i18n/i18n.js';

class RecurringInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 2rem 0;
        }

        .recurring-info {
          background: var(--background-card-color, #f8f9fa);
          padding: 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          max-width: 800px;
          margin: 0 auto;
        }

        .recurring-info h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .recurring-info p {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: var(--text-color-secondary);
          line-height: 1.5;
        }

        .recurring-info p:last-child {
          margin-bottom: 0;
        }

        .recurring-info .details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color, #eee);
        }

        .recurring-info .detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-color-secondary);
        }

        .recurring-info .detail app-icon {
          font-size: 1.1rem;
          color: var(--text-color-secondary);
        }

        @media (max-width: 480px) {
          .recurring-info {
            padding: 1rem;
          }

          .recurring-info h4 {
            font-size: 0.95rem;
          }

          .recurring-info p {
            font-size: 0.85rem;
          }

          .recurring-info .detail {
            font-size: 0.85rem;
          }
        }
      </style>

      <div class="recurring-info">
        <h4>
          <app-icon>info</app-icon>
          ${i18n.getTranslation('home.recurring.title')}
        </h4>
        <p>${i18n.getTranslation('home.recurring.info')}</p>
        <div class="details">
          <div class="detail">
            <app-icon>trending_up</app-icon>
            ${i18n.getTranslation('home.recurring.investments')}
          </div>
          <div class="detail">
            <app-icon>calendar_month</app-icon>
            ${i18n.getTranslation('home.recurring.expenses')}
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }
}

if (!customElements.get('app-recurring-info')) {
  customElements.define('app-recurring-info', RecurringInfo);
}

export default RecurringInfo;
