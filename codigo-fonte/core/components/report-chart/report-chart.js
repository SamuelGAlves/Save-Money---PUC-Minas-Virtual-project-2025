import { i18n } from '../../i18n/i18n.js';

class ReportChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'type', 'data', 'labels', 'colors'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  _createPieChart(data, colors) {
    const total = Math.abs(data.reduce((sum, value) => sum + value, 0));
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const paths = data.map((value, index) => {
      const percentage = Math.abs(value) / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (startAngle + angle - 90) * Math.PI / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      return `
        <path
          d="M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z"
          fill="${colors[index]}"
          stroke="white"
          stroke-width="2"
        />
      `;
    }).join('');

    return `
      <svg viewBox="0 0 300 300" class="chart">
        ${paths}
        <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.6}" fill="white" />
        <text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle" class="chart-center-text">
          ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </text>
      </svg>
    `;
  }

  _createBarChart(data, labels, colors) {
    const maxValue = Math.max(...data.map(Math.abs));
    const barWidth = 40;
    const barSpacing = 40;
    const chartHeight = 200;
    const chartWidth = (barWidth + barSpacing) * data.length;
    const padding = 60;
    const textPadding = 30;

    const bars = data.map((value, index) => {
      const height = (Math.abs(value) / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = chartHeight - height + padding;
      const color = value >= 0 ? colors[0] : colors[1];

      const formattedValue = Math.abs(value) >= 1000
        ? `R$ ${(Math.abs(value)/1000).toFixed(1)}k`
        : Math.abs(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      return `
        <g>
          <rect
            x="${x}"
            y="${y}"
            width="${barWidth}"
            height="${height}"
            fill="${color}"
            stroke="white"
            stroke-width="1"
          />
          <text
            x="${x + barWidth/2}"
            y="${y - 25}"
            text-anchor="middle"
            class="bar-value"
          >
            ${formattedValue}
          </text>
          <text
            x="${x}"
            y="${chartHeight + padding + textPadding}"
            text-anchor="${index === 0 ? 'end' : 'start'}"
            class="bar-label"
            transform="translate(${index === 0 ? 35 : 5}, 0)"
          >
            ${labels[index]}
          </text>
        </g>
      `;
    }).join('');

    return `
      <svg viewBox="0 0 ${chartWidth + padding * 2} ${chartHeight + padding * 2 + textPadding * 2}" class="chart">
        ${bars}
      </svg>
    `;
  }

  render() {
    const title = this.getAttribute('title');
    const type = this.getAttribute('type');
    const data = JSON.parse(this.getAttribute('data') || '[]');
    const labels = JSON.parse(this.getAttribute('labels') || '[]');
    const colors = JSON.parse(this.getAttribute('colors') || '[]');

    let chartContent = '';
    if (type === 'pie') {
      chartContent = this._createPieChart(data, colors);
    } else if (type === 'bar') {
      chartContent = this._createBarChart(data, labels, colors);
    }

    this.shadowRoot.innerHTML = `
      <style>
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
      </style>

      <div class="chart-container">
        <h3 class="chart-title">${title}</h3>
        ${chartContent}
      </div>
    `;
  }
}

if (!customElements.get('report-chart')) {
  customElements.define('report-chart', ReportChart);
}

export default ReportChart;
