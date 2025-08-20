import authService, { AUTH_KEY } from '../../services/auth.js';
import secureStorage from '../../services/secure-storage.js';
import toast from '../../services/toast.js';
import { loaderService } from '../../services/loader.js';
import { validarSenha } from '../../utils/validators.js';

class UserEditPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const session = await authService.getLoggedUser();
    const user = session?.user;
    this.render(user);
    this.initFormLogic();
  }

  initFormLogic() {
    // Preenche o formulário
    this.preencherFormularioUsuario();

    // Adiciona evento de clique para campos readonly
    const readonlyInputs = this.shadowRoot.querySelectorAll('app-input[readonly]');
    readonlyInputs.forEach(input => {
      input.addEventListener('click', () => {
        toast.warning('Este campo não pode ser alterado');
      });
    });

    // Validação reativa
    this.handleRealtimeValidation('#nome', {
      emptyMessage: 'O nome é obrigatório.',
    });
    this.handleRealtimeValidation('#senha', {
      emptyMessage: 'A senha é obrigatória.',
      validate: (value) => {
        const result = validarSenha(value);
        if (!result.valida) {
          this.setError('#senha', result.mensagens.join('<br>'));
          return false;
        }
        return true;
      }
    });
    this.handleRealtimeValidation('#confirme-senha', {
      emptyMessage: 'Confirme a senha.',
      validate: (value) => value === this.getInputValue('#senha'),
      invalidMessage: 'As senhas não coincidem!',
    });
    this.handleRealtimeValidation('#cep', {
      validate: (value) => !value || /^\d{5}-?\d{3}$/.test(value),
      invalidMessage: 'CEP inválido! Use o formato 00000-000',
    });
    this.handleRealtimeValidation('#telefone', {
      validate: (value) => !value || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value),
      invalidMessage: 'Telefone inválido! Use o formato (00) 00000-0000 ou (00) 0000-0000',
    });

    // Listener do formulário
    const form = this.shadowRoot.getElementById('alteraçãoform');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!this.validarFormulario()) return;
        const id = window.loggedUserId;
        if (!id) {
          toast.error('Usuário não identificado para atualização.');
          return;
        }
        const user = {
          id,
          nome: this.getInputValue('#nome'),
          documento: this.getInputValue('#documento'),
          email: this.getInputValue('#email'),
          senha: this.getInputValue('#senha'),
          confirmeSenha: this.getInputValue('#confirme-senha'),
          termos: this.getInputValue('#termos'),
          dataNascimento: this.getInputValue('#dataNascimento'),
          telefone: this.getInputValue('#telefone'),
          endereco: this.getInputValue('#endereco'),
          cidade: this.getInputValue('#cidade'),
          estado: this.getInputValue('#estado'),
          cep: this.getInputValue('#cep')
        };
        await this.userUpdate(user);
      });
    }

    // Adiciona listener para o CEP
    const cepInput = this.shadowRoot.getElementById('cep');
    if (cepInput) {
      cepInput.addEventListener('blur', async () => {
        const cep = this.getInputValue('#cep').replace(/\D/g, '');
        if (cep.length === 8) {
          try {
            loaderService.show('Buscando endereço...');
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
              this.shadowRoot.getElementById('endereco').value = `${data.logradouro}`;
              this.shadowRoot.getElementById('cidade').value = data.localidade;
              this.shadowRoot.getElementById('estado').value = data.uf;
            } else {
              toast.error('CEP não encontrado');
            }
          } catch (error) {
            toast.error('Erro ao buscar CEP');
          } finally {
            loaderService.hide();
          }
        }
      });
    }
  }

  async preencherFormularioUsuario() {
    const session = await authService.getLoggedUser();
    const user = session?.user;
    if (!user) {
      toast.error('Usuário não encontrado. Por favor, faça login novamente.');
      setTimeout(() => {
        history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 5000);
      return;
    }
    this.shadowRoot.getElementById('termos').value = user.termos || '';
    this.shadowRoot.getElementById('nome').value = user.nome || '';
    this.shadowRoot.getElementById('documento').value = user.documento || '';
    this.shadowRoot.getElementById('email').value = user.email || '';
    this.shadowRoot.getElementById('dataNascimento').value = user.dataNascimento || '';
    this.shadowRoot.getElementById('telefone').value = user.telefone || '';
    this.shadowRoot.getElementById('endereco').value = user.endereco || '';
    this.shadowRoot.getElementById('cidade').value = user.cidade || '';
    this.shadowRoot.getElementById('estado').value = user.estado || '';
    this.shadowRoot.getElementById('cep').value = user.cep || '';
    window.loggedUserId = user.id;
  }

  validarFormulario() {
    this.clearErrors();
    let isValid = true;
    const nome = this.getInputValue('#nome');
    const senha = this.getInputValue('#senha');
    const confirmeSenha = this.getInputValue('#confirme-senha');

    if (!nome) {
      this.setError('#nome', 'O nome é obrigatório.');
      isValid = false;
    }

    if (!senha) {
      this.setError('#senha', 'A senha é obrigatória.');
      isValid = false;
    } else {
      const result = validarSenha(senha);
      if (!result.valida) {
        this.setError('#senha', result.mensagens.join('<br>'));
        isValid = false;
      }
    }

    if (!confirmeSenha) {
      this.setError('#confirme-senha', 'Confirme a senha.');
      isValid = false;
    }
    if (senha && confirmeSenha && senha !== confirmeSenha) {
      this.setError('#confirme-senha', 'As senhas não coincidem!');
      isValid = false;
    }
    return isValid;
  }

  async userUpdate(user) {
    try {
      loaderService.show('Atualizando dados do usuário...');
      await authService.updateUser({
        id: user.id,
        nome: user.nome,
        email: user.email,
        documento: user.documento,
        senha: user.senha,
        termos: user.termos,
        dataNascimento: user.dataNascimento,
        telefone: user.telefone,
        endereco: user.endereco,
        cidade: user.cidade,
        estado: user.estado,
        cep: user.cep
      });
      const user_session = await secureStorage.getItem(localStorage, AUTH_KEY);
      await secureStorage.setItem(localStorage, AUTH_KEY, {
        user: { ...user },
        token: user_session.token,
      });
      toast.success('Usuário atualizado com sucesso!');
      history.pushState(null, '', '/perfil');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      toast.error('Erro ao salvar os dados do usuário. Tente novamente.');
    } finally {
      loaderService.hide();
    }
  }

  getInputValue(selector) {
    const input = this.shadowRoot.querySelector(selector);
    return input?.value?.trim() || '';
  }

  setError(selector, message) {
    const input = this.shadowRoot.querySelector(selector);
    input?.setError?.(message);
  }

  clearError(selector) {
    const input = this.shadowRoot.querySelector(selector);
    input?.clearError?.();
  }

  clearErrors() {
    ['#nome', '#senha', '#confirme-senha'].forEach((sel) => this.clearError(sel));
  }

  handleRealtimeValidation(selector, validateFn) {
    const input = this.shadowRoot.querySelector(selector);
    if (!input) return;
    input.addEventListener('input', () => {
      const value = this.getInputValue(selector);
      if (!value) {
        this.setError(selector, validateFn.emptyMessage);
      } else if (validateFn?.validate && !validateFn.validate(value)) {
        this.setError(selector, validateFn.invalidMessage);
      } else {
        this.clearError(selector);
      }
    });
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

        .cadastro-form {
          display: grid;
          gap: 2rem;
        }

        .form-section {
          display: grid;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.2rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .password-group {
          display: grid;
          gap: 1.5rem;
        }

        .address-group {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .password-group {
            grid-template-columns: repeat(2, 1fr);
          }

          .address-group {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-title {
            font-size: 1.2rem;
          }

          .container {
            padding: 1rem;
          }

          .form-grid,
          .password-group,
          .address-group {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="container">
          <div class="profile-header">
          <app-avatar type="upload"></app-avatar>
          <div>
            <h1 class="profile-title">${user?.nome ?? 'Usuário'}</h1>
            <p class="profile-subtitle">${user?.email ?? 'Email não informado'}</p>
          </div>
        </div>
        <form class="cadastro-form" id="alteraçãoform">
          <input type="text" id="termos" hidden required readonly />

          <div class="form-section">
            <h2 class="section-title">Dados Pessoais</h2>
            <div class="form-grid">
              <app-input
                type="text"
                placeholder="Digite seu nome"
                label="Nome"
                id="nome"
                required
                minlength="2"
                maxlength="40"
                autocomplete="name"
              ></app-input>

              <app-input
                type="text"
                label="Documento"
                id="documento"
                readonly
                autocomplete="off"
              ></app-input>

              <app-input
                type="date"
                label="Data de Nascimento"
                id="dataNascimento"
                autocomplete="bday"
              ></app-input>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Dados de Contato</h2>
            <div class="form-grid">
              <app-input
                type="email"
                label="E-mail"
                id="email"
                readonly
                autocomplete="email"
              ></app-input>

              <app-input
                type="tel"
                placeholder="(00) 00000-0000"
                label="Telefone"
                id="telefone"
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                autocomplete="tel"
              ></app-input>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Endereço</h2>
            <div class="form-grid">
              <div class="address-group">
                <app-input
                  type="cep"
                  placeholder="00000-000"
                  label="CEP"
                  id="cep"
                  autocomplete="postal-code"
                ></app-input>

                <app-input
                  type="text"
                  placeholder="Digite seu estado"
                  label="Estado"
                  id="estado"
                  minlength="2"
                  maxlength="2"
                  autocomplete="address-level1"
                ></app-input>
              </div>

              <app-input
                type="text"
                placeholder="Digite sua cidade"
                label="Cidade"
                id="cidade"
                minlength="2"
                maxlength="100"
                autocomplete="address-level2"
              ></app-input>

              <app-input
                type="text"
                placeholder="Digite seu endereço"
                label="Endereço"
                id="endereco"
                minlength="5"
                maxlength="200"
                autocomplete="street-address"
              ></app-input>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Segurança da Conta</h2>
            <div class="form-grid">
              <div class="password-group">
                <app-input
                  type="password"
                  placeholder="Digite sua senha"
                  label="Senha"
                  id="senha"
                  required
                  show-requirements
                  minlength="8"
                  maxlength="20"
                ></app-input>

                <app-input
                  type="password"
                  placeholder="Confirme sua senha"
                  label="Confirma Senha"
                  id="confirme-senha"
                  prevent-copy-paste
                  required
                  minlength="8"
                  maxlength="20"
                ></app-input>
              </div>
            </div>
          </div>

          <app-button
            type="submit"
            fullWidth="true"
          >
            <app-icon>save</app-icon>
            SALVAR ALTERAÇÕES
          </app-button>
        </form>
      </div>
    `;
  }
}

if (!customElements.get('user-edit-page')) {
  customElements.define('user-edit-page', UserEditPage);
}

export default UserEditPage;
