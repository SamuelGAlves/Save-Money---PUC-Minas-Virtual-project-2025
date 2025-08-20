import './cover.js';

class LayoutHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['image', 'show-back-button'];
  }

  get image() {
    return this.getAttribute('image') || '';
  }

  set image(value) {
    this.setAttribute('image', value);
  }

  get showBackButton() {
    return this.hasAttribute('show-back-button');
  }

  set showBackButton(value) {
    if (value) {
      this.setAttribute('show-back-button', '');
    } else {
      this.removeAttribute('show-back-button');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  renderContent() {
    // Método que pode ser sobrescrito pelas classes filhas
    return '';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.layout-hero {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 100vh;
        }

        hero-cover {
          min-height: 30%;
          flex: none;
        }

        .hero-content {
          height: 70%;
          flex: 1;
          display: flex;
          align-items: self-start;
          justify-content: center;
          background: var(--background-color);
          position: relative;
        }

        .content {
          display: flex;
          margin: 1rem;
          max-width: 310px;
          width: 100%;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 2rem 0;
        }

        .hero-content::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 0;
          right: 0;
          height: 6px;
          width: 100%;
          background: var(--gradient-loader);
          background-size: 200% 100%;
          animation: borderRotateHorizontal 5s linear infinite;
        }

        @keyframes borderRotateHorizontal {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes borderRotateVertical {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 200%;
          }
        }

        @media (min-width: 1200px) {
          section.layout-hero {
            flex-direction: row;
            width: 100%;
            height: 100vh;
            align-items: center;
            justify-content: center;
            hero-cover {
              width: 60%;
              height: 100vh;
            }
            .hero-content {
              width: 40%;
              height: 100%;
              overflow-y: auto;
              align-items: center;
              &::before {
                top: 0;
                left: -6px;
                width: 6px;
                height: 100%;
                background: var(--gradient-loader-vertical);
                background-size: 100% 200%;
                animation: borderRotateVertical 5s linear infinite;
              }
            }
          }
        }
        @media (min-width: 2200px) {
          section.layout-hero {
            hero-cover {
              width: 70%;
            }
            .hero-content {
              width: 30%;
            }
          }
        }
      </style>
      <section class="layout-hero">
        <hero-cover
          image="${this.image}"
          ${this.showBackButton ? 'show-back-button' : ''}
        ></hero-cover>
        <div class="hero-content">
          ${this.renderContent()}
        </div>
      </section>
    `;
  }
}

export default LayoutHero;
