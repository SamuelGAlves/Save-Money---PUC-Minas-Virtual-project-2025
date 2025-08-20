import authService from '../../services/auth.js';
import toast from '../../services/toast.js';

class AppAvatar extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'src', 'type', 'size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userId = null;
    this.avatarSrc = null;
    this.userName = null;
  }

  async attributeChangedCallback() {
    await this.loadAvatar();
    this.render();
  }

  async connectedCallback() {
    await this.loadAvatar();
    this.render();
  }

  async loadAvatar() {
    const session = await authService.getLoggedUser();
    const user = session?.user;
    this.userId = user?.id;
    this.userName = user?.nome || '';
    if (this.userId) {
      const savedAvatar = localStorage.getItem(`AVT-${this.userId}`);
      this.avatarSrc = savedAvatar || this.getAttribute('src') || null;
    } else {
      this.avatarSrc = this.getAttribute('src') || null;
    }
  }

  getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getRandomColor() {
    const colors = [
      '#E57373', // Vermelho suave
      '#81C784', // Verde suave
      '#64B5F6', // Azul suave
      '#FFB74D', // Laranja suave
      '#4DB6AC', // Turquesa suave
      '#F06292', // Rosa suave
    ];
    const name = this.getAttribute('name') || this.userName || '';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  getSize() {
    const sizeAttr = this.getAttribute('size');
    if (!sizeAttr) return 80;
    if (sizeAttr === 'small') return 40;
    if (sizeAttr === 'medium') return 80;
    if (sizeAttr === 'large') return 120;
    const px = parseInt(sizeAttr, 10);
    return isNaN(px) ? 80 : px;
  }

  render() {
    // Pega o nome do atributo ou da sessão
    const name = this.getAttribute('name') || this.userName || '';
    const initials = this.getInitials(name);
    const bgColor = this.getRandomColor();
    const type = this.getAttribute('type') || '';
    const size = this.getSize();

    this.shadowRoot.innerHTML = `
      <style>
        .avatar {
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${bgColor};
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.28}px;
          font-weight: bold;
          user-select: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          position: relative;
          ${type === 'upload' ? 'cursor: pointer;' : ''}
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }
        input[type="file"] {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
          display: ${type === 'upload' ? 'block' : 'none'};
        }
        ${type === 'upload' && `
          .avatar:hover {
            filter: brightness(0.95);
          }
        `}

        .remove-btn {
          display: ${this.avatarSrc && type === 'upload' ? 'block' : 'none'};
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 2;
          transition: background 0.2s;
        }
        .remove-btn:hover {
          background: rgba(255,0,0,0.8);
        }
      </style>
      <div class="avatar" title="${name}">
        ${this.avatarSrc ? `<img src="${this.avatarSrc}" alt="Avatar" />` : `${initials}`}
        <input type="file" accept="image/*" title="Alterar foto" />
        ${type === 'upload' && this.avatarSrc ? `<button class="remove-btn" title="Remover avatar">&times;</button>` : ''}
      </div>
    `;

    // Só ativa o upload se type="upload"
    if (type === 'upload') {
      const input = this.shadowRoot.querySelector('input[type="file"]');
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || !this.userId) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            localStorage.setItem(`AVT-${this.userId}`, event.target.result);

            this.dispatchEvent(
              new CustomEvent('AVT-change', {
                detail: { base64: event.target.result },
                bubbles: true,
                composed: true,
              })
            );
            this.avatarSrc = event.target.result;
            this.render();
            toast.success('Avatar atualizado com sucesso!');
          } catch (err) {
            toast.error('Erro ao salvar o avatar!');
          }
        };
        reader.onerror = () => {
          toast.error('Erro ao ler o arquivo de imagem!');
        };
        reader.readAsDataURL(file);
      });

      // Botão de remover avatar (só existe se avatarSrc)
      const removeBtn = this.shadowRoot.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          if (!this.userId) return;
          localStorage.removeItem(`AVT-${this.userId}`);
          this.avatarSrc = null;
          this.render();
          toast.success('Avatar removido! As iniciais foram restauradas.');
        });
      }
    }
  }
}

customElements.define('app-avatar', AppAvatar);
export default AppAvatar;
