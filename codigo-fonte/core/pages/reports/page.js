import { i18n } from '../../i18n/i18n.js';
import toast from '../../services/toast.js';
// import { loaderService } from '../../services/loader.js';
import { generateReport, generateQuickReport, subscribeToReports, unsubscribeFromReports } from '../../store/reportsStore.js';
import ReportSummaryCard from '../../components/report-summary-card/report-summary-card.js';
import ReportChart from '../../components/report-chart/report-chart.js';

class ReportsPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this._reportState = null;

  }

  connectedCallback() {

    this.render();


    this.setupEventListeners();


    this._i18nUnsubscribe = i18n.addObserver(() => {

      this.render();
      this.setupEventListeners();
    });

    this._reportsUnsubscribe = subscribeToReports((state) => {

      this._reportState = state;
      this.render();
      this.setupEventListeners();
    });

  }

  disconnectedCallback() {

    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
    if (this._reportsUnsubscribe) {
      unsubscribeFromReports(this._reportsUnsubscribe);
    }

  }

  setupEventListeners() {


    // Adiciona listeners para os botões de geração rápida
    const quickButtons = this.shadowRoot.querySelectorAll('.quick-report-button');


    quickButtons.forEach(button => {

      button.addEventListener('click', () => {

        this.generateQuickReport(button.dataset.type);
      });
    });

    // Adiciona listener para o botão de gerar relatório
    const generateButton = this.shadowRoot.querySelector('#generateReport');


    if (generateButton) {

      generateButton.addEventListener('click', () => {

        this.handleGenerateReport();
      });
    }

    // Adiciona validação de datas
    const startDateInput = this.shadowRoot.getElementById('startDate');
    const endDateInput = this.shadowRoot.getElementById('endDate');


    if (startDateInput && endDateInput) {

      startDateInput.addEventListener('change', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
          this.setError(endDateInput, i18n.getTranslation('reports.form.endDate.error'));
        } else {
          this.clearError(endDateInput);
        }
      });

      endDateInput.addEventListener('change', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
          this.setError(endDateInput, i18n.getTranslation('reports.form.endDate.error'));
        } else {
          this.clearError(endDateInput);
        }
      });
    }

  }

  setError(input, message) {
    if (input && typeof input.setError === 'function') {
      input.setError(message);
    }
  }

  clearError(input) {
    if (input && typeof input.clearError === 'function') {
      input.clearError();
    }
  }

  async generateQuickReport(type) {
    try {

      const report = await generateQuickReport(type);


      this._reportState = report;


      this.render();
      this.setupEventListeners();


      if (!report.items.receitas.length &&
          !report.items.despesas.length &&
          !report.items.investimentos.length) {

        toast.info(i18n.getTranslation('reports.empty.noData'));
      } else {

        toast.success(i18n.getTranslation('reports.success'));
      }
    } catch (error) {
      console.error('[generateQuickReport] Erro:', error);
      toast.error(i18n.getTranslation('reports.error'));
    }
  }

  async handleGenerateReport() {


    const startDate = this.shadowRoot.getElementById('startDate').value;
    const endDate = this.shadowRoot.getElementById('endDate').value;
    const reportType = this.shadowRoot.getElementById('reportType').value;



    if (!startDate || !endDate) {

      if (!startDate) {
        this.setError(this.shadowRoot.getElementById('startDate'), 'Data inicial é obrigatória');
      }
      if (!endDate) {
        this.setError(this.shadowRoot.getElementById('endDate'), 'Data final é obrigatória');
      }
      toast.error(i18n.getTranslation('reports.dateRangeRequired'));
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {

      this.setError(this.shadowRoot.getElementById('endDate'), 'A data final deve ser maior que a data inicial');
      return;
    }

    try {

      const report = await generateReport(reportType, startDate, endDate);


      this._reportState = report;


      this.render();
      this.setupEventListeners();


      if (!report.items.receitas.length &&
          !report.items.despesas.length &&
          !report.items.investimentos.length) {

        toast.info(i18n.getTranslation('reports.empty.noData'));
      } else {

        toast.success(i18n.getTranslation('reports.success'));
      }
    } catch (error) {
      console.error('[handleGenerateReport] Erro:', error);
      toast.error(i18n.getTranslation('reports.error'));
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
          margin-bottom: 1.5rem;
          margin-top: 0;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quick-reports {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .quick-report-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-report-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .quick-report-button app-icon {
          font-size: 2rem;
          color: var(--primary-color);
        }

        .quick-report-button span {
          font-size: 0.9rem;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .date-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        app-button {
          align-self: flex-end;
          margin-top: 1rem;
        }

        .report-summary {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
        }

        .summary-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

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

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .chart-container {
          background-color: var(--surface-color);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
          padding: 1rem;
        }

        .chart-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-color);
          text-align: center;
        }

        .chart {
          width: 100%;
          height: 300px;
        }

        .chart-center-text {
          font-size: 1rem;
          font-weight: 500;
          fill: var(--text-color);
        }

        .bar-value {
          font-size: 0.8rem;
          fill: var(--text-color);
        }

        .bar-label {
          font-size: 0.9rem;
          fill: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          background-color: var(--background-card-color);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
          margin-top: 2rem;
        }

        .empty-state app-icon {
          font-size: 3rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 1rem 0;
          color: var(--text-color);
        }

        .empty-state p {
          margin: 0 0 1.5rem 0;
          color: var(--text-secondary);
        }

        .empty-state app-button {
          margin: 0 0.5rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .date-range {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="container">
        <h1 class="page-title">
          <app-icon aria-hidden="true">assessment</app-icon>
          ${i18n.getTranslation('reports.title')}
        </h1>

        <div class="quick-reports">
          <button class="quick-report-button" data-type="expenses">
            <app-icon>trending_down</app-icon>
            <span>${i18n.getTranslation('reports.quick.expenses')}</span>
          </button>
          <button class="quick-report-button" data-type="income">
            <app-icon>trending_up</app-icon>
            <span>${i18n.getTranslation('reports.quick.income')}</span>
          </button>
          <button class="quick-report-button" data-type="investments">
            <app-icon>account_balance</app-icon>
            <span>${i18n.getTranslation('reports.quick.investments')}</span>
          </button>
          <button class="quick-report-button" data-type="summary">
            <app-icon>summarize</app-icon>
            <span>${i18n.getTranslation('reports.quick.summary')}</span>
          </button>
        </div>

        <div class="report-form">
          <div class="date-range">
            <app-input
              id="startDate"
              type="date"
              label="${i18n.getTranslation('reports.form.startDate.label')}"
            ></app-input>

            <app-input
              id="endDate"
              type="date"
              label="${i18n.getTranslation('reports.form.endDate.label')}"
            ></app-input>
          </div>

          <app-select
            id="reportType"
            label="${i18n.getTranslation('reports.form.type.label')}"
            value="summary"
            options='[
              {"value": "summary", "label": "${i18n.getTranslation('reports.form.type.options.summary')}"},
              {"value": "expenses", "label": "${i18n.getTranslation('reports.form.type.options.expenses')}"},
              {"value": "income", "label": "${i18n.getTranslation('reports.form.type.options.income')}"},
              {"value": "investments", "label": "${i18n.getTranslation('reports.form.type.options.investments')}"}
            ]'
          ></app-select>

          <app-button id="generateReport">
            <app-icon>download</app-icon>
            ${i18n.getTranslation('reports.form.generate')}
          </app-button>
        </div>

        ${this._reportState ? `
          <div class="report-summary">
            <h2 class="summary-title">${i18n.getTranslation('reports.summary.title')}</h2>
            ${(!this._reportState.items.receitas.length &&
               !this._reportState.items.despesas.length &&
               !this._reportState.items.investimentos.length) ? `
              <div class="empty-state">
                <app-icon>assessment</app-icon>
                <h3>${i18n.getTranslation('reports.empty.title')}</h3>
                <p>${i18n.getTranslation('reports.empty.description')}</p>
                <div>
                  <app-button href="/receitas">
                    <app-icon>add</app-icon>
                    ${i18n.getTranslation('reports.empty.addIncome')}
                  </app-button>
                  <app-button href="/despesas">
                    <app-icon>add</app-icon>
                    ${i18n.getTranslation('reports.empty.addExpense')}
                  </app-button>
                  <app-button href="/investimentos">
                    <app-icon>add</app-icon>
                    ${i18n.getTranslation('reports.empty.addInvestment')}
                  </app-button>
                </div>
              </div>
            ` : `
              <div class="summary-grid">
                ${(this._reportState.type === 'summary' || this._reportState.type === 'income') && this._reportState.items.receitas.length > 0 ? `
                  <report-summary-card
                    title="${i18n.getTranslation('reports.summary.income')}"
                    value="${this._reportState.items.receitas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)}"
                    type="positive"
                    items="${this._reportState.items.receitas.length}"
                    recurring="${this._reportState.items.receitas.filter(item => item.isRecurring).length}"
                  ></report-summary-card>
                ` : ''}
                ${(this._reportState.type === 'summary' || this._reportState.type === 'expenses') && this._reportState.items.despesas.length > 0 ? `
                  <report-summary-card
                    title="${i18n.getTranslation('reports.summary.expenses')}"
                    value="${this._reportState.items.despesas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)}"
                    type="negative"
                    items="${this._reportState.items.despesas.length}"
                    recurring="${this._reportState.items.despesas.filter(item => item.isRecurring).length}"
                  ></report-summary-card>
                ` : ''}
                ${(this._reportState.type === 'summary' || this._reportState.type === 'investments') && this._reportState.items.investimentos.length > 0 ? `
                  <report-summary-card
                    title="${i18n.getTranslation('reports.summary.investments')}"
                    value="${this._reportState.items.investimentos.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)}"
                    type="positive"
                    items="${this._reportState.items.investimentos.length}"
                    recurring="0"
                  ></report-summary-card>
                ` : ''}
                ${this._reportState.type === 'summary' && (this._reportState.items.receitas.length > 0 ||
                   this._reportState.items.despesas.length > 0 ||
                   this._reportState.items.investimentos.length > 0) ? `
                  <report-summary-card
                    title="${i18n.getTranslation('reports.summary.balance')}"
                    value="${this._reportState.summary.saldo || 0}"
                    type="${(this._reportState.summary.saldo || 0) >= 0 ? 'positive' : 'negative'}"
                    items="${this._reportState.items.receitas.length + this._reportState.items.despesas.length + this._reportState.items.investimentos.length}"
                    recurring="0"
                  ></report-summary-card>
                ` : ''}
              </div>

              <div class="charts-container">
                ${(this._reportState.type === 'summary' || this._reportState.type === 'income' || this._reportState.type === 'expenses') &&
                  (this._reportState.items.receitas.length > 0 || this._reportState.items.despesas.length > 0) ? `
                  <report-chart
                    title="${i18n.getTranslation('reports.charts.incomeVsExpenses')}"
                    type="bar"
                    data='${JSON.stringify([
                      this._reportState.items.receitas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0),
                      -this._reportState.items.despesas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)
                    ])}'
                    labels='${JSON.stringify([
                      i18n.getTranslation('reports.summary.income'),
                      i18n.getTranslation('reports.summary.expenses')
                    ])}'
                    colors='${JSON.stringify(['var(--color-success)', 'var(--color-danger)'])}'
                  ></report-chart>
                ` : ''}

                ${(this._reportState.type === 'summary' || this._reportState.type === 'investments') && this._reportState.items.investimentos.length > 0 ? `
                  <report-chart
                    title="${i18n.getTranslation('reports.charts.investments')}"
                    type="pie"
                    data='${JSON.stringify([
                      this._reportState.items.investimentos.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)
                    ])}'
                    colors='${JSON.stringify(['var(--color-primary)'])}'
                  ></report-chart>
                ` : ''}

                ${this._reportState.type === 'summary' && (this._reportState.items.receitas.length > 0 ||
                   this._reportState.items.despesas.length > 0 ||
                   this._reportState.items.investimentos.length > 0) ? `
                  <report-chart
                    title="${i18n.getTranslation('reports.charts.distribution')}"
                    type="pie"
                    data='${JSON.stringify([
                      this._reportState.items.receitas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0),
                      Math.abs(this._reportState.items.despesas.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)),
                      this._reportState.items.investimentos.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)
                    ])}'
                    colors='${JSON.stringify(['var(--color-success)', 'var(--color-danger)', 'var(--color-primary)'])}'
                  ></report-chart>
                ` : ''}
              </div>
            `}
          </div>
        ` : ''}
      </div>
    `;

  }
}

if (!customElements.get('reports-page')) {
  customElements.define('reports-page', ReportsPage);
}

export default ReportsPage;
