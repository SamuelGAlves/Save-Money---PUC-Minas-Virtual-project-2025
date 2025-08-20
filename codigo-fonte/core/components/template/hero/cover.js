class HeroCover extends HTMLElement {
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
    this.setupEventListeners();
  }

  setupEventListeners() {
    const backButton = this.shadowRoot.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => this.handleBack());
    }
  }

  handleBack() {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;

    if (referrer && referrer.includes(currentDomain)) {
      window.history.back();
    } else {
      history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
          width: 100%;
        }
        section.hero-cover {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          background: url('${this.image}') no-repeat left center;
          background-size: cover;
          background-position: center;
          padding: 2rem;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          width: 100%;
          position: relative;
        }

        section.hero-cover::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, var(--overlay-opacity, 0));
          backdrop-filter: brightness(var(--overlay-brightness, 1));
          z-index: 0;
          transition: all 0.3s ease;
        }

        .back-button {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1000;
          width: 50px;
          height: 50px;
          display: none;
        }
        :host([show-back-button]) .back-button {
          display: block;
        }
      </style>
      <section class="hero-cover">
        <save-money-logo type="hero"></save-money-logo>
        <language-selector fixed></language-selector>
        <dark-mode-toggle type="fixed"></dark-mode-toggle>
        ${this.showBackButton ? `
          <app-button
            class="back-button"
            variant="secondary"
            fullWidth="true"
          >
            <app-icon>arrow_back</app-icon>
          </app-button>
        ` : ''}
      </section>
    `;
  }
}

if (!customElements.get('hero-cover')) {
  customElements.define('hero-cover', HeroCover);
}

export default HeroCover;
