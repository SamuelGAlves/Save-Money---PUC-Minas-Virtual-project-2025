import { i18n } from '../../i18n/i18n.js';

class TeamSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.teamMembers = [
      {
        name: 'Thais Lellis Moreira',
        photo: './codigo-fonte/core/components/team-section/imagens/thais.jpg',
        github: 'https://github.com/thaislellis',
        linkedin: 'http://www.linkedin.com/in/thais-l-bb1a36164',
        email: 'thais@savemoney.app.br'
      },
      {
        name: 'Matheus Carlos de S. B. de Oliveira',
        photo: 'https://www.gravatar.com/avatar/?d=mp&s=150',
        github: 'https://github.com/matheuscarlos443',
        linkedin: 'https://linkedin.com/in/matheus-carlos-9842271b5',
        email: 'matheus@savemoney.app.br'
      },
      {
        name: 'Breno Eller A. M',
        photo: 'https://www.gravatar.com/avatar/?d=mp&s=150',
        github: 'https://github.com/BrenoEller',
        email: 'breno@savemoney.app.br'
      },
      {
        name: 'Samuel Gomes Alves',
        photo: 'https://www.gravatar.com/avatar/?d=mp&s=150',
        github: 'https://github.com/SamuelGAlves',
        email: 'samuel@savemoney.app.br'
      },
      {
        name: 'Vitor Reck Tavares',
        photo: 'https://www.gravatar.com/avatar/?d=mp&s=150',
        github: 'https://github.com/vitor-reck',
        email: 'vitor@savemoney.app.br'
      },
      {
        name: 'Lucas Ferreira de Lima',
        photo: './codigo-fonte/core/components/team-section/imagens/lucas.jpg',
        github: 'https://github.com/lucasferreiralimax',
        linkedin: 'https://www.linkedin.com/in/lucasferreiralimax',
        portfolio: 'https://lucasfront.dev.br/about',
        email: 'lucas@savemoney.app.br'
      },
    ];
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

  renderTeamMember(member) {
    return `
      <div class="team-member">
        <img src="${member.photo}" alt="${member.name}" class="member-photo">
        <h3>${member.name}</h3>
        <div class="member-social">
          ${member.linkedin ? `
            <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de ${member.name}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
            </a>
          ` : ''}
          ${member.portfolio ? `
            <a href="${member.portfolio}" target="_blank" rel="noopener noreferrer" aria-label="Portfólio de ${member.name}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </a>
          ` : ''}
          <a href="${member.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub de ${member.name}">
            <svg height="24" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="24" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
              <path fill="currentColor" d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z"></path>
            </svg>
          </a>
        </div>
        <a href="mailto:${member.email}" class="member-email" aria-label="Email de ${member.name}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          ${member.email}
        </a>
      </div>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
          width: 100%;
        }

        .team-section {
          margin: 2rem 0;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          width: 100%;
        }

        .team-title {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: var(--text-color);
          text-align: center;
        }

        .team-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          padding: 0 1rem;
          width: 100%;
          margin: 0 auto;
          gap: 2rem;
        }

        .team-member {
          text-align: center;
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          flex: 0 1 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease;
        }

        .team-member:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        .member-photo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 3px solid var(--primary-color);
        }
        .team-member h3 {
          margin: 0.5rem 0;
          color: var(--text-color);
          font-size: 1.2rem;
          line-height: 1.4;
          word-wrap: break-word;
          max-width: 100%;
        }

        .member-social {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          width: 100%;
        }

        .member-social a {
          color: var(--text-color);
          transition: all 0.3s ease;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .member-social a:hover {
          color: var(--primary-color);
          background-color: var(--background-hover-color);
          transform: scale(1.1);
        }

        .member-social svg {
          width: 24px;
          height: 24px;
        }

        .member-email {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-color);
          text-decoration: none;
          margin-top: 1rem;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .member-email:hover {
          color: var(--primary-color);
        }

        .member-email svg {
          width: 16px;
          height: 16px;
        }

        /* Breakpoints responsivos */
        @media (max-width: 1200px) {
          .team-grid {
            max-width: 1000px;
            gap: 2rem;
          }
        }

        @media (max-width: 992px) {
          .team-grid {
            max-width: 800px;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .team-section {
            margin: 2rem 0;
            padding: 1.5rem 0;
          }

          .team-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .team-grid {
            gap: 1.5rem;
            padding: 0 1rem;
            max-width: 500px;
          }

          .team-member {
            flex: 0 1 100%;
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .team-section {
            margin: 1.5rem 0;
            padding: 1rem 0;
          }

          .team-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
          }

          .team-grid {
            gap: 1rem;
            padding: 0 0.5rem;
            max-width: 100%;
          }
        }
      </style>

      <div class="team-section">
        <div class="team-grid">
          ${this.teamMembers.map(member => this.renderTeamMember(member)).join('')}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('team-section')) {
  customElements.define('team-section', TeamSection);
}

export default TeamSection;
