import authService from '../../services/auth.js';
import './modais/confirm.js';
import { loaderService } from '../../services/loader.js';
import toast from '../../services/toast.js';
import { i18n } from '../../i18n/i18n.js';

class ProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentUser = null;
  }

  connectedCallback() {
    this.setupLanguageObserver();
    this.loadUserData();
  }

  setupLanguageObserver() {
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render(this.currentUser);
      this.setupModals();
      this.setupEventListeners(this.currentUser);
    });
  }

  disconnectedCallback() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  async loadUserData() {
    const session = await authService.getLoggedUser();
    this.currentUser = session?.user;
    this.render(this.currentUser);
    this.setupModals();
    this.setupEventListeners(this.currentUser);
  }

  getTipoConta(documento) {
    if (!documento) return i18n.getTranslation('profile.personalInfo.notInformed');
    // Remove caracteres não numéricos
    const doc = documento.replace(/\D/g, '');
    // CPF tem 11 dígitos, CNPJ tem 14
    return doc.length === 11 ? i18n.getTranslation('profile.personalInfo.physicalPerson') : i18n.getTranslation('profile.personalInfo.legalPerson');
  }

  setupModals() {
    this.confirmDeleteUserModal = this.shadowRoot.querySelector('confirm-delete-user-modal');
    this.logoutModal = this.shadowRoot.querySelector('logout-modal');
  }

  setupEventListeners(user) {
    const logoutBtn = this.shadowRoot.getElementById('logoutBtn');
    const deleteAccountBtn = this.shadowRoot.getElementById('deleteAccountBtn');

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        this.logoutModal.open(async () => {
          try {
            loaderService.show(i18n.getTranslation('modals.logout.message'));
            await authService.logout();
            history.pushState(null, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
          } catch (error) {
            console.error('Erro ao fazer logout:', error);
          } finally {
            loaderService.hide();
          }
        });
      };
    }

    if (deleteAccountBtn) {
      deleteAccountBtn.onclick = () => {
        this.confirmDeleteUserModal.open(async () => {
          try {
            loaderService.show(i18n.getTranslation('modals.deleteAccount.message'));

            await authService.deleteUser(user?.id);
            toast.success(i18n.getTranslation('modals.deleteAccount.success'));
            await authService.logout();
            history.pushState(null, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
          } catch (error) {
            console.error('Erro ao excluir usuário:', error);
          } finally {
            loaderService.hide();
          }
        });
      };
    }
  }

  render(user) {
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

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          min-width: 80px;
          border-radius: 50%;
          background-color: var(--color-gray-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text);
          font-size: 2rem;
        }

        .profile-title {
          margin: 0;
          font-size: 2rem;
          color: var(--text-color);
          word-break: break-all;
        }

        .profile-subtitle {
          margin: 0.5rem 0 0;
          color: var(--text-secondary);
          font-size: 1rem;
          word-break: break-all;
        }

        .info-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .info-section h2 {
          font-size: 1.5rem;
          margin: 0 0 1rem;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background-color: var(--background-card-color);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
        }

        .info-item:hover {
          background-color: var(--hover-color);
        }

        .info-icon {
          color: var(--primary-color);
          font-size: 1.5rem;
        }

        .info-content {
          flex: 1;
        }

        .info-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
          color: var(--text-color);
          font-weight: 500;
          word-break: break-all;
        }

        .actions-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 700px;
          margin-left: auto;
        }

        app-button {
          flex: 1;
          min-width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
          }

          .profile-title {
            font-size: 1.2rem;
            text-align: center;
          }

          .info-section h2 {
            font-size: 1rem;
          }

          .container {
            padding: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          app-button {
            width: 100%;
          }
        }
      </style>

      <div class="container">
        <div class="profile-header">
          <app-avatar></app-avatar>
          <div>
            <h1 class="profile-title">${user?.nome ?? i18n.getTranslation('profile.personalInfo.notInformed')}</h1>
            <p class="profile-subtitle">${user?.email ?? i18n.getTranslation('profile.personalInfo.notInformed')}</p>
          </div>
        </div>
        <div class="info-section">
          <h2>
            <app-icon>person</app-icon>
            ${i18n.getTranslation('profile.personalInfo.title')}
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <app-icon class="info-icon">badge</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.personalInfo.fullName')}</div>
                <div class="info-value">${user?.nome ?? i18n.getTranslation('profile.personalInfo.notInformed')}</div>
              </div>
            </div>

            <div class="info-item">
              <app-icon class="info-icon">account_circle</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.personalInfo.accountType')}</div>
                <div class="info-value">${this.getTipoConta(user?.documento)}</div>
              </div>
            </div>

            <div class="info-item">
              <app-icon class="info-icon">description</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.personalInfo.document')}</div>
                <div class="info-value">${user?.documento ?? i18n.getTranslation('profile.personalInfo.notInformed')}</div>
              </div>
            </div>

            ${user?.dataNascimento ? `
            <div class="info-item">
              <app-icon class="info-icon">calendar_today</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.personalInfo.birthDate')}</div>
                <div class="info-value">${new Date(user.dataNascimento).toLocaleDateString(i18n.currentLanguage)}</div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="info-section">
          <h2>
            <app-icon>contact_mail</app-icon>
            ${i18n.getTranslation('profile.contactInfo.title')}
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <app-icon class="info-icon">email</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.contactInfo.email')}</div>
                <div class="info-value">${user?.email ?? i18n.getTranslation('profile.personalInfo.notInformed')}</div>
              </div>
            </div>

            ${user?.telefone ? `
            <div class="info-item">
              <app-icon class="info-icon">phone</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.contactInfo.phone')}</div>
                <div class="info-value">${user.telefone}</div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        ${(user?.endereco || user?.cidade || user?.estado || user?.cep) ? `
        <div class="info-section">
          <h2>
            <app-icon>home</app-icon>
            ${i18n.getTranslation('profile.address.title')}
          </h2>
          <div class="info-grid">
            ${user?.endereco ? `
            <div class="info-item">
              <app-icon class="info-icon">location_on</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.address.street')}</div>
                <div class="info-value">${user.endereco}</div>
              </div>
            </div>
            ` : ''}

            ${user?.cidade ? `
            <div class="info-item">
              <app-icon class="info-icon">location_city</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.address.city')}</div>
                <div class="info-value">${user.cidade}</div>
              </div>
            </div>
            ` : ''}

            ${user?.estado ? `
            <div class="info-item">
              <app-icon class="info-icon">map</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.address.state')}</div>
                <div class="info-value">${user.estado}</div>
              </div>
            </div>
            ` : ''}

            ${user?.cep ? `
            <div class="info-item">
              <app-icon class="info-icon">local_post_office</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.address.zipCode')}</div>
                <div class="info-value">${user.cep}</div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <div class="info-section">
          <h2>
            <app-icon>security</app-icon>
            ${i18n.getTranslation('profile.accountSettings.title')}
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <app-icon class="info-icon">verified_user</app-icon>
              <div class="info-content">
                <div class="info-label">${i18n.getTranslation('profile.accountSettings.lgpdTerms')}</div>
                <div class="info-value">
                  ${user?.termos ?
                    `<span>${i18n.getTranslation('profile.accountSettings.accepted')}</span>` :
                    `<span>${i18n.getTranslation('profile.accountSettings.notAccepted')}</span>`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <app-button id="AlterarBtn" href="/user-edit" variant="primary" fullwidth="true">
            <app-icon>edit</app-icon>
            ${i18n.getTranslation('profile.actions.editData')}
          </app-button>

          <app-button id="deleteAccountBtn" variant="danger" fullwidth="true">
            <app-icon>delete</app-icon>
            ${i18n.getTranslation('profile.actions.deleteAccount')}
          </app-button>

          <app-button id="logoutBtn" variant="ghost" fullwidth="true">
            <app-icon>logout</app-icon>
            ${i18n.getTranslation('profile.actions.logout')}
          </app-button>
        </div>
      </div>

      <confirm-delete-user-modal></confirm-delete-user-modal>
      <logout-modal></logout-modal>
    `;
  }
}

if (!customElements.get('profile-page')) {
  customElements.define('profile-page', ProfilePage);
}

export default ProfilePage;
