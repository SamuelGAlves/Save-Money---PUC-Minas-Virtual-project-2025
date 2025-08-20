import { i18n } from '../../i18n/i18n.js';
import '../../components/team-section/team-section.js';

class AboutPage extends HTMLElement {
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
    // Dados dinâmicos
    const assistentes = [
      {
        nome: 'Aline Luciana Cândido',
        imagem: './codigo-fonte/core/pages/about/imagens/aline.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.aline.description')
      },
      {
        nome: 'Ana Flávia Patrício de Barros',
        imagem: './codigo-fonte/core/pages/about/imagens/ana.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.ana.description')
      },
      {
        nome: 'Camila Cristina Gonçalves Marques de Moura',
        imagem: './codigo-fonte/core/pages/about/imagens/camila.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.camila.description')
      },
      {
        nome: 'Gabriela Araújo Batista',
        imagem: './codigo-fonte/core/pages/about/imagens/gabriela.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.gabriela.description')
      },
      {
        nome: 'Vanilda da Conceição de Oliveira',
        imagem: './codigo-fonte/core/pages/about/imagens/vanilda.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.vanilda.description')
      },
      {
        nome: 'Zulka Iyalle Moreira Ferreira',
        imagem: './codigo-fonte/core/pages/about/imagens/zulka.jpg',
        cargo: i18n.getTranslation('about.puc.roles.assistente'),
        descricao: i18n.getTranslation('about.puc.members.ana.description')
      },
    ];
    const microFund = [
      {
        nome: 'Lucila Ishitani',
        imagem: './codigo-fonte/core/pages/about/imagens/lucila.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professora'),
        descricao: i18n.getTranslation('about.puc.members.lucila.description')
      },
      {
        nome: 'Maria Augusta Vieira Nelson',
        imagem: './codigo-fonte/core/pages/about/imagens/maria.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professora'),
        descricao: i18n.getTranslation('about.puc.members.maria.description')
      },
      {
        nome: 'Jane Carmelita das Dores Galvão de Aruda Barroso',
        imagem: './codigo-fonte/core/pages/about/imagens/jane.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professora'),
        descricao: i18n.getTranslation('about.puc.members.jane.description')
      },
      {
        nome: 'Raquel Alves Furtado',
        imagem: './codigo-fonte/core/pages/about/imagens/raquel.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professora'),
        descricao: i18n.getTranslation('about.puc.members.raquel.description')
      },
      {
        nome: 'Livia Borges Pádua',
        imagem: './codigo-fonte/core/pages/about/imagens/livia.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professora'),
        descricao: i18n.getTranslation('about.puc.members.livia.description')
      },
      {
        nome: 'Rodrigo Richard Gomes',
        imagem: './codigo-fonte/core/pages/about/imagens/rodrigo.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        descricao: i18n.getTranslation('about.puc.members.rodrigo.description')
      },
      {
        nome: 'Rommel Vieira Carneiro',
        imagem: './codigo-fonte/core/pages/about/imagens/rommel.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        descricao: i18n.getTranslation('about.puc.members.rommel.description')
      },
      {
        nome: 'Bernardo Jeunon de Almeida',
        imagem: './codigo-fonte/core/pages/about/imagens/bernardo.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        descricao: i18n.getTranslation('about.puc.members.bernardo.description')
      },
      {
        nome: 'Silvio Jamil Ferzoli Guimarães',
        imagem: './codigo-fonte/core/pages/about/imagens/silvio.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        descricao: i18n.getTranslation('about.puc.members.silvio.description')
      },
      {
        nome: 'Henrique Maia Veloso',
        imagem: './codigo-fonte/core/pages/about/imagens/henrique.jpg',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        descricao: i18n.getTranslation('about.puc.members.henrique.description')
      }
    ];

    const principal = [
      {
        nome: 'Dom Walmor Oliveira de Azevedo',
        cargo: i18n.getTranslation('about.puc.roles.graoChanceler'),
        imagem: './codigo-fonte/core/pages/about/imagens/grao.jpg',
        descricao: i18n.getTranslation('about.puc.members.walmor.description')
      },
      {
        nome: 'Pe. Dr. Luís Henrique Eloy e Silva',
        cargo: i18n.getTranslation('about.puc.roles.reitor'),
        imagem: './codigo-fonte/core/pages/about/imagens/luis.jpg',
        descricao: i18n.getTranslation('about.puc.members.luis.description')
      },
      {
        nome: 'Joyce Christina de Paiva Carvalho',
        cargo: i18n.getTranslation('about.puc.roles.coordenacao'),
        imagem: "./codigo-fonte/core/pages/about/imagens/joyce.jpg",
        descricao: i18n.getTranslation('about.puc.members.joyce.description')
      },
      {
        nome: 'Humberto Azevedo Negri do Carmo',
        cargo: i18n.getTranslation('about.puc.roles.professor'),
        imagem: "./codigo-fonte/core/pages/about/imagens/humberto.jpg",
        descricao: i18n.getTranslation('about.puc.members.humberto.description')
      }
    ];

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

        .mission-section {
          background-color: var(--background-card-color);
          padding: 2rem;
          border-radius: 1rem;
          margin: 2rem 0;
          border: 1px solid var(--border-color);
        }

        .mission-title {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .features {
          margin: 3rem 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          gap: 2rem;
          width: 100%;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 2rem;
          background-color: var(--background-card-color);
          border-radius: 1rem;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          flex: 0 1 280px;
        }

        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        app-icon {
          color: var(--primary-color);
          font-size: 2.5rem;
        }

        .feature-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }

        .feature-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .team-section {
          margin-top: 3rem;
          text-align: center;
        }

        .team-title {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .contact-section {
          margin-top: 3rem;
          padding: 2rem;
          background-color: var(--background-card-color);
          border-radius: 1rem;
          text-align: center;
        }

        .contact-title {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .features {
            gap: 1.5rem;
          }

          .feature-item {
            flex: 0 1 100%;
            padding: 1.5rem;
          }

          .contact-info {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .features {
            gap: 1rem;
          }

          .feature-item {
            padding: 1rem;
          }
        }

        /* Estilos para a seção PUC Minas */
        .puc-section {
          border-radius: 1rem;
          margin: 2rem 0;
        }
        .puc-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .puc-logo {
          height: 60px;
          width: auto;
          transition: filter 0.3s;
          filter: var(--puc-logo-filter);
        }
        .puc-title {
          font-size: 2rem;
          color: var(--primary-color);
          margin: 0;
        }
        .puc-description {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          text-align: center;
          white-space: break-spaces;
        }
        .puc-leader-info {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
        }
        .puc-leaders {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          align-items: center;
        }
        .puc-leader {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: var(--background-card-color);
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          min-width: 260px;
          max-width: 420px;
          flex-direction: column;
        }
        .puc-leader-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          object-position: top;
          border-radius: 50%;
          border: 2px solid var(--primary-color);
        }
        .puc-leader-title {
          font-size: 1.1rem;
          color: var(--primary-color);
          margin: 0 0 0.2rem 0;
        }
        .puc-leader-name {
          font-size: 1rem;
          margin: 0 0 0.2rem 0;
        }
        .puc-leader-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .microfund-section img {
          filter: grayscale(100%);
        }

        @media (max-width: 900px) {
          .puc-leaders {
            flex-direction: column;
            gap: 1.5rem;
          }
        }

        .section-title {
          font-size: 1.4rem;
          color: var(--primary-color);
          margin: 0 0 1rem 0;
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .section-divider {
          border: none;
          border-top: 2px solid var(--primary-color);
          margin: 0 auto 2rem auto;
          width: 180px;
        }
        .assistentes-section, .microfund-section {
          margin-top: 2rem;
        }
        .assistentes-section .puc-leaders,
        .microfund-section .puc-leaders {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 900px) {
          .assistentes-section .puc-leaders,
          .microfund-section .puc-leaders {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
        }
      </style>

      <div class="container">
        <h1 class="page-title">
          <app-icon aria-hidden="true">groups</app-icon>
          ${i18n.getTranslation('about.title')}
        </h1>

        <div class="content">
          <div class="mission-section">
            <h2 class="mission-title">
              <app-icon>rocket_launch</app-icon>
              ${i18n.getTranslation('about.mission.title')}
            </h2>
            <p>
              ${i18n.getTranslation('about.mission.description')}
            </p>
          </div>

          <div class="features">
            <div class="feature-item">
              <app-icon>savings</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.financialControl.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.financialControl.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>trending_up</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.investments.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.investments.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>currency_exchange</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.currencyConverter.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.currencyConverter.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>group</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.teamContact.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.teamContact.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>account_balance</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.personalAccount.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.personalAccount.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>business</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.businessAccount.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.businessAccount.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>translate</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.multipleLanguages.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.multipleLanguages.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>payments</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.multipleCurrencies.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.multipleCurrencies.description')}
              </p>
            </div>
            <div class="feature-item">
              <app-icon>currency_bitcoin</app-icon>
              <h3 class="feature-title">${i18n.getTranslation('about.features.cryptocurrencies.title')}</h3>
              <p class="feature-description">
                ${i18n.getTranslation('about.features.cryptocurrencies.description')}
              </p>
            </div>
          </div>

          <div class="team-section">
            <h2 class="team-title">
              <app-icon>groups</app-icon>
              ${i18n.getTranslation('about.team.title')}
            </h2>
            <p>
              ${i18n.getTranslation('about.team.description1')}
            </p>
            <p>
              ${i18n.getTranslation('about.team.description2')}
            </p>
            <team-section></team-section>
          </div>

          <section class="puc-section">
            <div class="puc-header">
              <img src="./codigo-fonte/core/pages/about/imagens/puc-logo.png" alt="PUC Minas Logo" class="puc-logo" />
              <h2 class="puc-title">${i18n.getTranslation('about.puc.title')}</h2>
            </div>
            <p class="puc-description">
              ${i18n.getTranslation('about.puc.description')}
            </p>
            <div class="puc-leaders">
              ${principal.map(p => `
                <div class="puc-leader">
                    <div class="puc-leader-info">
                      <img src="${p.imagem}" alt="${p.nome}" class="puc-leader-img" />
                      <div class="puc-leader-info-text">
                        <h3 class="puc-leader-title">${p.cargo}</h3>
                        <p class="puc-leader-name"><b>${p.nome}</b></p>
                      </div>
                    </div>
                    <p class="puc-leader-desc">${p.descricao}</p>
                </div>
              `).join('')}
            </div>
            <section class="assistentes-section">
                <h2 class="section-title">${i18n.getTranslation('about.puc.sections.assistentes')}</h2>
              <hr class="section-divider" />
              <div class="puc-leaders">
                ${assistentes.map(a => `
                  <div class="puc-leader">
                    <div class="puc-leader-info">
                      <img src="${a.imagem}" alt="${a.nome}" class="puc-leader-img" />
                      <div class="puc-leader-info-text">
                        <h3 class="puc-leader-title">${a.cargo}</h3>
                        <p class="puc-leader-name"><b>${a.nome}</b></p>
                      </div>
                    </div>
                    <p class="puc-leader-desc">${a.descricao}</p>
                  </div>
                `).join('')}
              </div>
            </section>
            <section class="microfund-section">
              <h2 class="section-title">${i18n.getTranslation('about.puc.sections.microFund')}</h2>
              <hr class="section-divider" />
              <div class="puc-leaders">
                ${microFund.map(p => `
                  <div class="puc-leader">
                    <div class="puc-leader-info">
                      <img src="${p.imagem}" alt="${p.nome}" class="puc-leader-img" />
                      <div class="puc-leader-info-text">
                        <h3 class="puc-leader-title">${p.cargo}</h3>
                        <p class="puc-leader-name"><b>${p.nome}</b></p>
                      </div>
                    </div>
                    <p class="puc-leader-desc">${p.descricao}</p>
                  </div>
                `).join('')}
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('about-page')) {
  customElements.define('about-page', AboutPage);
}

export default AboutPage;

