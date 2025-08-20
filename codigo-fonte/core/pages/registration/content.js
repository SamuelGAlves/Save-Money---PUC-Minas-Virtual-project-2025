import authService from '../../services/auth.js';
import toast from '../../services/toast.js';
import { validarCPF, validarCNPJ, validarEmail, validarSenha } from '../../utils/validators.js';
import { loaderService } from '../../services/loader.js';
import { i18n } from '../../i18n/i18n.js';

class RegistrationContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.documentType = 'cpf';
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Botão de cadastro
    this.shadowRoot
      .getElementById('registration-button')
      ?.addEventListener('click', () => this.handleRegister());

    // Limpa erros ao digitar
    ['nome', 'email', 'documento', 'senha', 'confirme-senha'].forEach((id) => {
      const input = this.shadowRoot.getElementById(id);
      input?.addEventListener('input', () => input.clearError());
    });

    // Segmentação CPF/CNPJ
    const btnCPF = this.shadowRoot.querySelector('.segment-cpf');
    const btnCNPJ = this.shadowRoot.querySelector('.segment-cnpj');
    const documentoInput = this.shadowRoot.getElementById('documento');

    if (btnCPF && btnCNPJ && documentoInput) {
      btnCPF.addEventListener('click', () => {
        btnCPF.classList.add('active');
        btnCNPJ.classList.remove('active');
        documentoInput.setAttribute(
          'placeholder',
          i18n.getTranslation('registration.document.cpf.placeholder')
        );
        documentoInput.setAttribute('type', 'cpf');
        this.documentType = 'cpf';
      });
      btnCNPJ.addEventListener('click', () => {
        btnCNPJ.classList.add('active');
        btnCPF.classList.remove('active');
        documentoInput.setAttribute(
          'placeholder',
          i18n.getTranslation('registration.document.cnpj.placeholder')
        );
        documentoInput.setAttribute('type', 'cnpj');
        this.documentType = 'cnpj';
      });
    }
  }

  connectedCallback() {
    // Observa mudanças no idioma
    i18n.addObserver(() => {
      this.render();
      this.setupEventListeners();
    });
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.render());
  }

  setError(input, message) {
    if (input && typeof input.setError === 'function') {
      input.setError(message);
    }
  }

  clearErrors() {
    ['nome', 'email', 'documento', 'senha', 'confirme-senha'].forEach((id) => {
      const input = this.shadowRoot.getElementById(id);
      input?.clearError();
    });
    // Limpa erro visual do checkbox de termos
    const termosLabel = this.shadowRoot.querySelector('label[for="termos"]');
    if (termosLabel) termosLabel.style.color = '';
  }

  getInputValue(id) {
    const input = this.shadowRoot.getElementById(id);
    return input?.value?.trim() || '';
  }

  async handleRegister() {
    this.clearErrors();

    const nome = this.getInputValue('nome');
    const email = this.getInputValue('email');
    const documento = this.getInputValue('documento');
    const senha = this.getInputValue('senha');
    const confirmeSenha = this.getInputValue('confirme-senha');
    const termos = this.shadowRoot.getElementById('termos')?.checked;

    const camposVazios = !nome && !email && !documento && !senha && !confirmeSenha && !termos;
    let isValid = true;

    if (camposVazios) {
      toast.error(i18n.getTranslation('registration.fillFields'));
      isValid = false;
      return;
    }

    if (!nome) {
      this.setError(
        this.shadowRoot.getElementById('nome'),
        i18n.getTranslation('registration.name.required')
      );
      isValid = false;
    }
    if (!email) {
      this.setError(
        this.shadowRoot.getElementById('email'),
        i18n.getTranslation('registration.email.required')
      );
      isValid = false;
    } else if (!validarEmail(email)) {
      this.setError(
        this.shadowRoot.getElementById('email'),
        i18n.getTranslation('registration.email.invalid')
      );
      toast.error(i18n.getTranslation('registration.email.invalid'));
      isValid = false;
    }
    if (!documento) {
      this.setError(
        this.shadowRoot.getElementById('documento'),
        i18n.getTranslation('registration.document.required')
      );
      isValid = false;
    } else {
      if (this.documentType === 'cpf') {
        if (!validarCPF(documento)) {
          this.setError(
            this.shadowRoot.getElementById('documento'),
            i18n.getTranslation('registration.document.cpf.invalid')
          );
          toast.error(i18n.getTranslation('registration.document.cpf.invalid'));
          isValid = false;
        }
      } else {
        if (!validarCNPJ(documento)) {
          this.setError(
            this.shadowRoot.getElementById('documento'),
            i18n.getTranslation('registration.document.cnpj.invalid')
          );
          toast.error(i18n.getTranslation('registration.document.cnpj.invalid'));
          isValid = false;
        }
      }
    }
    if (!senha) {
      this.setError(
        this.shadowRoot.getElementById('senha'),
        i18n.getTranslation('registration.password.required')
      );
      isValid = false;
    } else {
      const validacaoSenha = validarSenha(senha);
      if (!validacaoSenha.valida) {
        this.setError(this.shadowRoot.getElementById('senha'), validacaoSenha.mensagens.join('\n'));
        toast.error(i18n.getTranslation('registration.password.requirements.title'));
        isValid = false;
      }
    }
    if (!confirmeSenha) {
      this.setError(
        this.shadowRoot.getElementById('confirme-senha'),
        i18n.getTranslation('registration.confirmPassword.required')
      );
      isValid = false;
    }
    if (senha && confirmeSenha && senha !== confirmeSenha) {
      this.setError(
        this.shadowRoot.getElementById('confirme-senha'),
        i18n.getTranslation('registration.confirmPassword.mismatch')
      );
      toast.error(i18n.getTranslation('registration.confirmPassword.mismatch'));
      isValid = false;
    }
    if (!termos) {
      const termosCheckbox = this.shadowRoot.getElementById('termos');
      if (termosCheckbox && typeof termosCheckbox.setError === 'function') {
        termosCheckbox.setError(i18n.getTranslation('registration.terms.required'));
      }
      toast.error(i18n.getTranslation('registration.terms.required'));
      isValid = false;
    }

    if (!isValid) return;

    const id = crypto.randomUUID();

    try {
      loaderService.show(i18n.getTranslation('registration.loading'));
      await authService.saveUser({
        id,
        nome,
        email,
        documento,
        termos,
        senha,
        tipoDocumento: this.documentType,
      });

      // Dispara o e-mail de boas-vindas, mas não espera a resposta
      fetch('https://savemoney-api.onrender.com/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://savemoney.app.br'
        },
        body: JSON.stringify({
          email,
          name: nome,
          locale: i18n.currentLanguage
        })
      }).catch(error => {
        console.error('Erro ao enviar email de boas-vindas:', error);
        // Não interrompe o fluxo se falhar o envio do email
      });

      toast.success(i18n.getTranslation('registration.success'));
      loaderService.show(i18n.getTranslation('login.loading'));

      // Adiciona um delay mínimo de 1.5 segundos para melhor UX durante o login
      const [result] = await Promise.all([
        authService.login(email, senha),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (result && result.success) {
        toast.success(i18n.getTranslation('login.success'));
        history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        toast.error(i18n.getTranslation('login.error'));
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      if (error.message && error.message.includes('Email já cadastrado')) {
        this.setError(
          this.shadowRoot.getElementById('email'),
          i18n.getTranslation('registration.email.alreadyExists')
        );
        toast.error(i18n.getTranslation('registration.email.alreadyExists'));
      } else {
        toast.error(i18n.getTranslation('registration.error'));
      }
    } finally {
      loaderService.hide();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.registration-content {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          color: var(--color-text);
          width: 100%;
          max-width: 400px;
          margin: auto;
          h1 {
            margin-top: 0;
          }
        }
        .segment-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .segment-button {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid var(--button-secondary-border);
          background: var(--button-secondary-bg);
          color: var(--button-secondary-text-color);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .segment-button:hover {
          background: var(--button-secondary-hover-bg);
          border-color: var(--button-secondary-hover-border);
        }
        .segment-button.active {
          background: var(--button-primary-bg);
          color: var(--button-primary-text-color);
          border-color: var(--button-primary-border);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .terms-container {
          margin: 1rem 0;
        }
        .terms-container label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .terms-container input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
        }
      </style>
      <section class="registration-content">
        <h1>${i18n.getTranslation('registration.title')}</h1>

        <app-input
          type="text"
          placeholder="${i18n.getTranslation('registration.name.placeholder')}"
          label="${i18n.getTranslation('registration.name.label')}"
          id="nome"
          required
          minlength="2"
          maxlength="40"
        ></app-input>

        <app-input
          type="email"
          placeholder="${i18n.getTranslation('registration.email.placeholder')}"
          label="${i18n.getTranslation('registration.email.label')}"
          id="email"
          required
          minlength="6"
          maxlength="100"
        ></app-input>

        <div class="segment-container">
          <button class="segment-button segment-cpf active">CPF</button>
          <button class="segment-button segment-cnpj">CNPJ</button>
        </div>

        <app-input
          type="${this.documentType}"
          placeholder="${i18n.getTranslation('registration.document.cpf.placeholder')}"
          label="${i18n.getTranslation('registration.document.label')}"
          id="documento"
          required
        ></app-input>

        <app-input
          type="password"
          placeholder="${i18n.getTranslation('registration.password.placeholder')}"
          label="${i18n.getTranslation('registration.password.label')}"
          id="senha"
          required
          show-requirements
          minlength="8"
          maxlength="20"
        ></app-input>

        <app-input
          type="password"
          placeholder="${i18n.getTranslation('registration.confirmPassword.placeholder')}"
          label="${i18n.getTranslation('registration.confirmPassword.label')}"
          id="confirme-senha"
          prevent-copy-paste
          required
          minlength="8"
          maxlength="20"
        ></app-input>

        <div class="terms-container">
          <app-checkbox
            id="termos"
            label="${i18n.getTranslation('registration.terms.label')}"
          ></app-checkbox>
        </div>

        <app-button
          id="registration-button"
          fullWidth="true"
        ><app-icon>person_add</app-icon>${i18n.getTranslation('registration.button')}</app-button>
      </section>
    `;
  }
}

if (!customElements.get('registration-content')) {
  customElements.define('registration-content', RegistrationContent);
}

export default RegistrationContent;
