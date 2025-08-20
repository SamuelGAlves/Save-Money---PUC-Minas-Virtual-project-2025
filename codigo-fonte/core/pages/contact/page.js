import toast from '../../services/toast.js';
import { i18n } from '../../i18n/i18n.js';
import { loaderService } from '../../services/loader.js';
import authService from '../../services/auth.js';

class ContactPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupForm();
    this.loadUserData();
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
      this.setupForm();
      this.loadUserData();
    });
  }

  disconnectedCallback() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  async loadUserData() {
    try {
      const session = await authService.getLoggedUser();
      if (session?.user) {
        if (session.user.email) {
          const emailInput = this.shadowRoot.getElementById('email');
          if (emailInput) {
            emailInput.value = session.user.email;
            emailInput.setAttribute('readonly', '');
          }
        }
        if (session.user.nome) {
          const nameInput = this.shadowRoot.getElementById('name');
          if (nameInput) {
            nameInput.value = session.user.nome;
            nameInput.setAttribute('readonly', '');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  setupForm() {
    const form = this.shadowRoot.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Limpa erros ao digitar
      ['name', 'email', 'subject', 'message'].forEach((id) => {
        const input = this.shadowRoot.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            const inputElement = input.shadowRoot.querySelector('input, textarea');
            if (inputElement) {
              inputElement.classList.remove('error');
              const errorElement = input.shadowRoot.querySelector('.error-message');
              if (errorElement) {
                errorElement.textContent = '';
              }
            }
          });
        }
      });
    }
  }

  setError(input, message) {
    if (input) {
      const inputElement = input.shadowRoot.querySelector('input, textarea');
      if (inputElement) {
        inputElement.classList.add('error');
        const errorElement = input.shadowRoot.querySelector('.error-message');
        if (errorElement) {
          errorElement.textContent = message;
        }
      }
    }
  }

  clearErrors() {
    ['name', 'email', 'subject', 'message'].forEach((id) => {
      const input = this.shadowRoot.getElementById(id);
      if (input) {
        const inputElement = input.shadowRoot.querySelector('input, textarea');
        if (inputElement) {
          inputElement.classList.remove('error');
          const errorElement = input.shadowRoot.querySelector('.error-message');
          if (errorElement) {
            errorElement.textContent = '';
          }
        }
      }
    });
  }

  getInputValue(id) {
    const input = this.shadowRoot.getElementById(id);
    if (input) {
      if (input.tagName.toLowerCase() === 'app-select') {
        return input.value || '';
      }
      const inputElement = input.shadowRoot.querySelector('input, textarea');
      return inputElement?.value?.trim() || '';
    }
    return '';
  }

  validateFields(name, email, subject, message) {
    let isValid = true;

    if (!name) {
      this.setError(this.shadowRoot.getElementById('name'), i18n.getTranslation('contact.form.name.error'));
      isValid = false;
    }

    if (!email) {
      this.setError(this.shadowRoot.getElementById('email'), i18n.getTranslation('contact.form.email.error'));
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      this.setError(this.shadowRoot.getElementById('email'), i18n.getTranslation('contact.form.email.invalid'));
      isValid = false;
    }

    if (!subject) {
      this.setError(this.shadowRoot.getElementById('subject'), i18n.getTranslation('contact.form.subject.error'));
      isValid = false;
    }

    if (!message) {
      this.setError(this.shadowRoot.getElementById('message'), i18n.getTranslation('contact.form.message.error'));
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearForm() {
    ['name', 'email', 'subject', 'message'].forEach((id) => {
      const input = this.shadowRoot.getElementById(id);
      if (input) {
        const inputElement = input.shadowRoot.querySelector('input, textarea');
        if (inputElement) {
          inputElement.value = '';
        }
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const name = this.getInputValue('name');
    const email = this.getInputValue('email');
    const subject = this.getInputValue('subject');
    const message = this.getInputValue('message');
    const recipient = this.getInputValue('recipient');

    this.clearErrors();

    if (!this.validateFields(name, email, subject, message)) {
      return;
    }

    loaderService.show('...');
    try {
      const response = await fetch('https://savemoney-api.onrender.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://savemoney.app.br'
        },
        body: JSON.stringify({
          name,
          email,
          message: `${subject}\n\n${message}`,
          cc: recipient
        }),
      });

      const result = await response.json();

      if (result.message && result.message.includes('sucesso')) {
        toast.success(i18n.getTranslation('contact.form.success'));
        this.clearForm();
      } else {
        toast.error(i18n.getTranslation('contact.form.error'));
      }
    } catch (error) {
      toast.error(i18n.getTranslation('contact.form.error'));
    } finally {
      loaderService.hide();
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

        .content {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        p {
          margin: 0 0 1.5rem;
          font-size: 1rem;
          word-break: break-all;
        }

        form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        app-input, app-select {
          width: 100%;
        }

        app-textarea {
          grid-column: 1 / -1;
          width: 100%;
        }

        app-button {
          grid-column: 2;
          justify-self: end;
          margin-top: 1rem;
        }

        .contact-info {
          margin-top: 2rem;
          padding-top: 2rem;
          margin-bottom: 2rem;
          border-top: 1px solid var(--border-color);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border-radius: 0.5rem;
          transition: transform 0.2s;
          border: 1px solid var(--border-color);
          p {
            margin: 0;
          }
        }

        .contact-item:hover {
          transform: translateY(-2px);
        }

        app-icon {
          color: var(--primary-color);
          font-size: 2rem;
        }

        @media (max-width: 768px) {
          form {
            grid-template-columns: 1fr;
          }

          app-button {
            grid-column: 1;
            justify-self: stretch;
          }

          .container {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .contact-info {
            grid-template-columns: 1fr;
          }
        }

        .contact-item a {
          color: var(--color-primary);
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .contact-item a:hover {
          color: var(--color-secondary);
        }

        .contact-item a::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--color-primary);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }

        .contact-item a:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .contact-item app-icon {
          color: var(--primary-color);
        }

        .contact-item p {
          margin: 0;
          font-size: 1.1rem;
        }
      </style>

      <div class="container">
        <h1 class="page-title">
          <app-icon aria-hidden="true">contact_mail</app-icon>
          ${i18n.getTranslation('contact.title')}
        </h1>

        <div class="content">
          <div class="contact-info">
            <div class="contact-item">
              <app-icon>email</app-icon>
              <p><a href="mailto:contato@savemoney.app.br">contato@savemoney.app.br</a></p>
            </div>
            <div class="contact-item">
              <app-icon>phone</app-icon>
              <p><a href="https://wa.me/5582999319097" target="_blank" rel="noopener noreferrer">(82) 99931-9097</a></p>
            </div>
            <div class="contact-item">
              <app-icon>location_on</app-icon>
              <p>${i18n.getTranslation('contact.info.location')}</p>
            </div>
          </div>

          <p>
            ${i18n.getTranslation('contact.description')}
          </p>

          <form>
            <app-input
              id="name"
              label="${i18n.getTranslation('contact.form.name.label')}"
              name="name"
              maxlength="30"
              minlength="3"
              required
              placeholder="${i18n.getTranslation('contact.form.name.placeholder')}"
              autocomplete="name"
            ></app-input>
            <app-input
              id="email"
              label="${i18n.getTranslation('contact.form.email.label')}"
              name="email"
              type="email"
              maxlength="50"
              minlength="5"
              required
              placeholder="${i18n.getTranslation('contact.form.email.placeholder')}"
              autocomplete="email"
            ></app-input>
            <app-select
              id="recipient"
              label="${i18n.getTranslation('contact.form.recipient.label')}"
              name="recipient"
              required
              autocomplete="off"
              options='[
                {"value": "contato@savemoney.app.br", "label": "${i18n.getTranslation('contact.form.recipient.options.general')} - contato@savemoney.app.br", "selected": true},
                {"value": "samuel@savemoney.app.br", "label": "Samuel - samuel@savemoney.app.br"},
                {"value": "matheus@savemoney.app.br", "label": "Matheus - matheus@savemoney.app.br"},
                {"value": "breno@savemoney.app.br", "label": "Breno - breno@savemoney.app.br"},
                {"value": "thais@savemoney.app.br", "label": "Thais - thais@savemoney.app.br"},
                {"value": "vitor@savemoney.app.br", "label": "Vitor - vitor@savemoney.app.br"},
                {"value": "lucas@savemoney.app.br", "label": "Lucas - lucas@savemoney.app.br"}
              ]'
            ></app-select>
            <app-input
              id="subject"
              label="${i18n.getTranslation('contact.form.subject.label')}"
              name="subject"
              maxlength="40"
              minlength="5"
              required
              placeholder="${i18n.getTranslation('contact.form.subject.placeholder')}"
              autocomplete="off"
            ></app-input>
            <app-textarea
              id="message"
              label="${i18n.getTranslation('contact.form.message.label')}"
              name="message"
              maxlength="400"
              minlength="10"
              required
              placeholder="${i18n.getTranslation('contact.form.message.placeholder')}"
              rows="5"
            ></app-textarea>
            <app-button type="submit">
              <app-icon>send</app-icon>
              ${i18n.getTranslation('contact.form.submit')}
            </app-button>
          </form>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('contact-page')) {
  customElements.define('contact-page', ContactPage);
}

export default ContactPage;
