import './components/currency-converter.js';
import { i18n } from '../../i18n/i18n.js';

class ConversorMoedasPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
        }

        .container {
          padding: 2rem;
          border-radius: 1rem;
          width: 100%;
          background-color: var(--surface-color);
          box-shadow: var(--shadow-sm);
        }

        .page-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          margin-top: 0;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .content {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.1rem;
        }

        .converter-section {
          background-color: var(--background-card-color);
          padding: 2rem;
          border-radius: 1rem;
          margin: 2rem 0;
          border: 1px solid var(--border-color);
        }

        .converter-paragraph {
          margin-top: 0;
          text-align: center;
        }

        .section-title {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .info-section {
          margin: 3rem 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 2rem;
          background-color: var(--background-card-color);
          border-radius: 1rem;
          border: 1px solid var(--border-color);
        }

        .info-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        app-icon {
          color: var(--primary-color);
          font-size: 2.5rem;
        }

        .info-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }

        .info-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
        }

        currency-converter {
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .info-section {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="container">
        <h1 class="page-title">
          <app-icon aria-hidden="true">currency_exchange</app-icon>
          ${i18n.getTranslation('converter.title')}
        </h1>

        <div class="content">
          <div class="converter-section">
            <p class="converter-paragraph">
              ${i18n.getTranslation('converter.description')}
            </p>
            <currency-converter></currency-converter>
          </div>

          <div class="info-section">
            <div class="info-item">
              <app-icon>update</app-icon>
              <h3 class="info-title">${i18n.getTranslation('converter.features.rates.title')}</h3>
              <p class="info-description">
                ${i18n.getTranslation('converter.features.rates.description')}
              </p>
            </div>
            <div class="info-item">
              <app-icon>currency_bitcoin</app-icon>
              <h3 class="info-title">${i18n.getTranslation('converter.features.currencies.title')}</h3>
              <p class="info-description">
                ${i18n.getTranslation('converter.features.currencies.description')}
              </p>
            </div>
            <div class="info-item">
              <app-icon>history</app-icon>
              <h3 class="info-title">${i18n.getTranslation('converter.features.history.title')}</h3>
              <p class="info-description">
                ${i18n.getTranslation('converter.features.history.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('conversor-moedas-page')) {
  customElements.define('conversor-moedas-page', ConversorMoedasPage);
}

export default ConversorMoedasPage;
