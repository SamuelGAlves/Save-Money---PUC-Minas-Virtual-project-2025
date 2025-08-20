import { i18n } from '../../i18n/i18n.js';

class SaveMoneyLogo extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'type', 'size', 'disable-redirect'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    // Armazena a referência da função de callback para poder removê-la depois
    this.i18nCallback = () => this.updateTranslations();
    i18n.addObserver(this.i18nCallback);
  }

  // Mapa de códigos de idioma para códigos de bandeira
  static get flagMap() {
    return {
      'pt-BR': 'br',
      'en-US': 'us',
      'es-ES': 'es',
      'fr-FR': 'fr',
      'ar-SA': 'sa',
      'zh-CN': 'cn',
      'ru-RU': 'ru',
      'hi-IN': 'in',
      'zu-ZA': 'za'
    };
  }

  disconnectedCallback() {
    // Remove o observador usando a referência armazenada
    i18n.removeObserver(this.i18nCallback);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'variant' || name === 'type' || name === 'size') && oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    return this.getAttribute('variant') || 'normal';
  }

  get type() {
    return this.getAttribute('type') || 'normal';
  }

  get size() {
    return this.getAttribute('size') || 'normal';
  }

  get disableRedirect() {
    return this.hasAttribute('disable-redirect');
  }

  // Método público para focar no link interno
  focus() {
    const link = this.shadow.querySelector('.logo');
    if (link) {
      link.focus();
    }
  }

  // Método para atualizar apenas as traduções
  updateTranslations() {
    const titleElement = this.shadow.querySelector('.title');
    const subtitleElement = this.shadow.querySelector('.subtitle');
    const logoElement = this.shadow.querySelector('.logo');
    const flagElement = this.shadow.querySelector('.flag');

    if (titleElement) titleElement.textContent = i18n.getTranslation('logo.title');
    if (subtitleElement) subtitleElement.textContent = i18n.getTranslation('logo.subtitle');
    if (logoElement) logoElement.setAttribute('aria-label', i18n.getTranslation('logo.ariaLabel'));
    if (flagElement) {
      const currentLang = i18n.currentLanguage;
      const flagCode = SaveMoneyLogo.flagMap[currentLang] || 'us';
      flagElement.src = `https://flagcdn.com/${flagCode}.svg`;
      flagElement.alt = flagCode;
    }
  }

  render() {
    const isSmall = this.variant === 'small';
    const typeClass = this.type;
    const isLarge = this.size === 'large';
    const currentLang = i18n.currentLanguage;
    const flagCode = SaveMoneyLogo.flagMap[currentLang] || 'us';

    this.shadow.innerHTML = `
      <style>
        .logo {
          color: var(--logo-text-color);
          font-family: Arial, sans-serif;
          font-size: 0;
          width: ${isSmall ? '60px' : isLarge ? '280px' : '200px'};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: ${isSmall ? '16px 0' : '20px'};
          text-decoration: none;
          position: relative;
        }

        .logo.hero {
          width: 230px;
          box-sizing: border-box;
          padding: 0;
          transition: all 0.3s ease;
          cursor: pointer;
          color: var(--color-text);
        }

        .logo.hero:hover {
          transform: scale(1.1);
        }

        .logo.hero:hover .logo-container {
          box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.3);
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem 1rem 0.5rem;
          border-radius: 100px;
          background: var(--background-color);
          box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
          border: 4px solid transparent;
          background-clip: padding-box;
          width: 100%;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .logo-container::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 100px;
          background: var(--gradient-logo);
          background-size: 200% 100%;
          z-index: 0;
          animation: borderRotate 3s linear infinite;
          pointer-events: none;
        }

        .logo-container::after {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 96px;
          background: var(--color-gray-light);
          z-index: 1;
        }

        svg, .text {
          position: relative;
          z-index: 2;
        }

        .flag {
          width: 20px;
          height: 13px;
          border-radius: 4px;
          position: absolute;
          top: 12px;
          right: 10px;
          transform: scale(0.8);
          z-index: 11;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid var(--color-white);
        }

        .flag.hero {
          top: -2px;
          right: 50%;
          transform: translateX(50%);
          z-index: 11;
        }

        .flag.small {
          top: 10px;
          right: calc(50% - 2px);
          transform: translateX(50%) scale(0.8);
          z-index: 11;
        }

        @media (min-width: 768px) {
          .logo.hero {
            transform: scale(1.2);
          }
          .logo.hero:hover {
            transform: scale(1.3);
          }
        }

        @media (min-width: 1200px) {
          .logo.hero {
            transform: scale(1.6);
          }
          .logo.hero:hover {
            transform: scale(1.7);
          }
        }

        @keyframes borderRotate {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }

        svg {
          height: auto;
          flex-shrink: 0;
        }

        ${isLarge ? `
          svg {
            width: 50%;
            min-width: 60px;
          }
        `:`
          svg { width: 50px; }
        `}

        .text {
          width: 100%;
          font-weight: bold;
          display: ${isSmall ? 'none' : 'flex'};
          flex-direction: column;
          flex: 1;
        }

        .title {
          font-size: ${isLarge ? '2rem' : '1.5rem'};
          min-width: 120px;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: ${isLarge ? '1rem' : '0.8rem'};
          min-width: 150px;
        }
      </style>
      <div class="logo ${typeClass}" role="button" tabindex="0" aria-label="${i18n.getTranslation('logo.ariaLabel')}">
        <img
          class="flag ${this.type === 'hero' ? 'hero' : ''} ${isSmall ? 'small' : ''}"
          src="https://flagcdn.com/w20/${flagCode}.png"
          width="20"
          height="13"
          alt="${flagCode}">
        ${this.type === 'hero' ? `
          <div class="logo-container">
            <svg aria-hidden="true" viewBox="0 0 122 122" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M83.8209 72.8423C90.2478 67.2427 93.8458 59.2602 93.7217 50.9442C93.5977 43.3907 90.4463 36.2661 84.8383 30.8809C79.2303 25.4958 71.8109 22.4696 63.9448 22.3743C55.781 22.279 48.1134 25.2337 42.3069 30.7141C36.5004 36.2184 33.3242 43.5337 33.3242 51.3493C33.3242 59.6177 37.0215 67.5286 43.4732 73.0329C47.9397 76.8454 50.6693 82.2782 51.1159 88.1161H48.3368C47.369 88.1161 46.5998 88.8548 46.5998 89.7841V95.5266V103.104V108.847C46.5998 109.776 47.369 110.515 48.3368 110.515H53.0762C53.8951 114.732 57.7661 117.949 62.3815 117.949H64.6892C69.3295 117.949 73.1757 114.732 73.9945 110.515H78.734C79.7018 110.515 80.471 109.776 80.471 108.847V103.104V95.5266V89.7841C80.471 88.8548 79.7018 88.1161 78.734 88.1161H75.93C76.4015 82.3497 79.2055 76.8454 83.8209 72.8423ZM55.3343 101.436H50.0489V97.1946H55.3343V101.436ZM64.6892 114.589H62.3815C59.6768 114.589 57.3939 112.874 56.6495 110.491H70.4461C69.6769 112.874 67.394 114.589 64.6892 114.589ZM72.4064 107.179H54.6147H50.0489V104.772H57.0713C58.0391 104.772 58.8083 104.033 58.8083 103.104V100.983H68.2377V103.104C68.2377 104.033 69.0069 104.772 69.9746 104.772H76.997V107.179H72.4064ZM76.997 101.436H71.7116V97.1946H76.997V101.436ZM76.997 93.8587H69.9746C69.0069 93.8587 68.2377 94.5974 68.2377 95.5266V97.6473H58.8083V95.5266C58.8083 94.5974 58.0391 93.8587 57.0713 93.8587H50.0489V91.452H76.9722V93.8587H76.997ZM81.4884 70.3641C76.1534 75.0106 72.9275 81.3966 72.4561 88.1161H54.5899C54.1432 81.3251 50.9919 75.0106 45.7809 70.5548C40.0737 65.6938 36.7982 58.6884 36.7982 51.3731C36.7982 44.463 39.627 37.9579 44.7635 33.097C49.9 28.236 56.6991 25.6149 63.92 25.7102C78.2377 25.9009 90.0493 37.2431 90.2478 50.9919C90.347 58.3548 87.1708 65.4079 81.4884 70.3641Z" fill="currentColor"/>
              <path d="M65.8549 51.9928V43.224C67.4678 43.5814 69.0807 44.2725 70.7433 45.2256C71.2148 45.5115 71.6862 45.6307 72.1825 45.6307C73.6465 45.6307 74.8376 44.5346 74.8376 43.1049C74.8376 42.0088 74.1676 41.3178 73.3984 40.9127C71.2147 39.5783 68.8326 38.7205 66.0286 38.4107V37.41C66.0286 36.3139 65.1105 35.4561 63.969 35.4561C62.8276 35.4561 61.8846 36.3139 61.8846 37.41V38.3631C55.9293 38.8158 51.8846 42.1994 51.8846 47.0842C51.8846 49.1811 52.4305 50.8252 53.5223 52.1834C55.1352 54.1611 57.9392 55.4717 62.0832 56.4963V65.5272C59.4777 65.0744 57.2692 64.026 55.036 62.4772C54.6141 62.1674 54.0434 61.9768 53.4727 61.9768C52.0086 61.9768 50.8672 63.0729 50.8672 64.4787C50.8672 65.4318 51.3387 66.1705 52.1575 66.6709C55.0608 68.6248 58.3362 69.8639 61.9095 70.2451V73.0807C61.9095 74.1768 62.8524 75.0346 63.9938 75.0346C65.1353 75.0346 66.0534 74.1768 66.0534 73.0807V70.3404C72.0832 69.7924 76.1776 66.4564 76.1776 61.4287C76.1776 56.5201 73.0758 53.7322 65.8549 51.9928ZM62.0832 51.0396C61.3387 50.8014 60.7184 50.5631 60.1725 50.3248C58.0881 49.3717 57.5174 48.2994 57.5174 46.7744C57.5174 44.7729 59.031 43.224 62.0832 42.9381V51.0396ZM65.8549 65.694V57.3779C69.5274 58.474 70.5696 59.7131 70.5696 61.7147C70.5696 63.9307 68.907 65.3842 65.8549 65.694Z" fill="currentColor"/>
              <path class="line line-1" d="M13.5221 53.5654C12.5544 53.5654 11.7852 54.3041 11.7852 55.2334C11.7852 56.1627 12.5544 56.9014 13.5221 56.9014H20.346C21.3138 56.9014 22.083 56.1627 22.083 55.2334C22.083 54.3041 21.3138 53.5654 20.346 53.5654H13.5221Z" fill="currentColor"/>
              <path class="line line-2" d="M28.2872 19.6817C27.6172 19.0384 26.5006 19.0384 25.8306 19.6817C25.1606 20.3251 25.1606 21.3974 25.8306 22.0407L30.6445 26.6634C30.9919 26.997 31.4386 27.1638 31.8604 27.1638C32.2823 27.1638 32.7537 26.997 33.0763 26.6634C33.7463 26.02 33.7463 24.9478 33.0763 24.3044L28.2872 19.6817Z" fill="currentColor"/>
              <path class="line line-3" d="M63.6966 12.2949V5.74219C63.6966 4.81289 62.9274 4.07422 61.9596 4.07422C60.9919 4.07422 60.2227 4.81289 60.2227 5.74219V12.2949C60.2227 13.2242 60.9919 13.9629 61.9596 13.9629C62.9274 13.9629 63.6966 13.2004 63.6966 12.2949Z" fill="currentColor"/>
              <path class="line line-4" d="M99.0074 19.9196C99.6774 19.2763 99.6774 18.204 99.0074 17.5606C98.3374 16.9173 97.2208 16.9173 96.5508 17.5606L91.7369 22.1833C91.0669 22.8267 91.0669 23.8989 91.7369 24.5423C92.0843 24.8759 92.5309 25.0427 92.9527 25.0427C93.3746 25.0427 93.8461 24.8759 94.1686 24.5423L99.0074 19.9196Z" fill="currentColor"/>
              <path class="line line-5" d="M108.478 53.5654C109.446 53.5654 110.215 54.3041 110.215 55.2334C110.215 56.1627 109.446 56.9014 108.478 56.9014H101.654C100.686 56.9014 99.917 56.1627 99.917 55.2334C99.917 54.3041 100.686 53.5654 101.654 53.5654H108.478Z" fill="currentColor"/>
            </svg>
            <div class="text" aria-hidden="true">
              <span class="title">${i18n.getTranslation('logo.title')}</span>
              <span class="subtitle">${i18n.getTranslation('logo.subtitle')}</span>
            </div>
          </div>
        ` : `
          <svg aria-hidden="true" viewBox="0 0 122 122" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M83.8209 72.8423C90.2478 67.2427 93.8458 59.2602 93.7217 50.9442C93.5977 43.3907 90.4463 36.2661 84.8383 30.8809C79.2303 25.4958 71.8109 22.4696 63.9448 22.3743C55.781 22.279 48.1134 25.2337 42.3069 30.7141C36.5004 36.2184 33.3242 43.5337 33.3242 51.3493C33.3242 59.6177 37.0215 67.5286 43.4732 73.0329C47.9397 76.8454 50.6693 82.2782 51.1159 88.1161H48.3368C47.369 88.1161 46.5998 88.8548 46.5998 89.7841V95.5266V103.104V108.847C46.5998 109.776 47.369 110.515 48.3368 110.515H53.0762C53.8951 114.732 57.7661 117.949 62.3815 117.949H64.6892C69.3295 117.949 73.1757 114.732 73.9945 110.515H78.734C79.7018 110.515 80.471 109.776 80.471 108.847V103.104V95.5266V89.7841C80.471 88.8548 79.7018 88.1161 78.734 88.1161H75.93C76.4015 82.3497 79.2055 76.8454 83.8209 72.8423ZM55.3343 101.436H50.0489V97.1946H55.3343V101.436ZM64.6892 114.589H62.3815C59.6768 114.589 57.3939 112.874 56.6495 110.491H70.4461C69.6769 112.874 67.394 114.589 64.6892 114.589ZM72.4064 107.179H54.6147H50.0489V104.772H57.0713C58.0391 104.772 58.8083 104.033 58.8083 103.104V100.983H68.2377V103.104C68.2377 104.033 69.0069 104.772 69.9746 104.772H76.997V107.179H72.4064ZM76.997 101.436H71.7116V97.1946H76.997V101.436ZM76.997 93.8587H69.9746C69.0069 93.8587 68.2377 94.5974 68.2377 95.5266V97.6473H58.8083V95.5266C58.8083 94.5974 58.0391 93.8587 57.0713 93.8587H50.0489V91.452H76.9722V93.8587H76.997ZM81.4884 70.3641C76.1534 75.0106 72.9275 81.3966 72.4561 88.1161H54.5899C54.1432 81.3251 50.9919 75.0106 45.7809 70.5548C40.0737 65.6938 36.7982 58.6884 36.7982 51.3731C36.7982 44.463 39.627 37.9579 44.7635 33.097C49.9 28.236 56.6991 25.6149 63.92 25.7102C78.2377 25.9009 90.0493 37.2431 90.2478 50.9919C90.347 58.3548 87.1708 65.4079 81.4884 70.3641Z" fill="currentColor"/>
            <path d="M65.8549 51.9928V43.224C67.4678 43.5814 69.0807 44.2725 70.7433 45.2256C71.2148 45.5115 71.6862 45.6307 72.1825 45.6307C73.6465 45.6307 74.8376 44.5346 74.8376 43.1049C74.8376 42.0088 74.1676 41.3178 73.3984 40.9127C71.2147 39.5783 68.8326 38.7205 66.0286 38.4107V37.41C66.0286 36.3139 65.1105 35.4561 63.969 35.4561C62.8276 35.4561 61.8846 36.3139 61.8846 37.41V38.3631C55.9293 38.8158 51.8846 42.1994 51.8846 47.0842C51.8846 49.1811 52.4305 50.8252 53.5223 52.1834C55.1352 54.1611 57.9392 55.4717 62.0832 56.4963V65.5272C59.4777 65.0744 57.2692 64.026 55.036 62.4772C54.6141 62.1674 54.0434 61.9768 53.4727 61.9768C52.0086 61.9768 50.8672 63.0729 50.8672 64.4787C50.8672 65.4318 51.3387 66.1705 52.1575 66.6709C55.0608 68.6248 58.3362 69.8639 61.9095 70.2451V73.0807C61.9095 74.1768 62.8524 75.0346 63.9938 75.0346C65.1353 75.0346 66.0534 74.1768 66.0534 73.0807V70.3404C72.0832 69.7924 76.1776 66.4564 76.1776 61.4287C76.1776 56.5201 73.0758 53.7322 65.8549 51.9928ZM62.0832 51.0396C61.3387 50.8014 60.7184 50.5631 60.1725 50.3248C58.0881 49.3717 57.5174 48.2994 57.5174 46.7744C57.5174 44.7729 59.031 43.224 62.0832 42.9381V51.0396ZM65.8549 65.694V57.3779C69.5274 58.474 70.5696 59.7131 70.5696 61.7147C70.5696 63.9307 68.907 65.3842 65.8549 65.694Z" fill="currentColor"/>
            <path class="line line-1" d="M13.5221 53.5654C12.5544 53.5654 11.7852 54.3041 11.7852 55.2334C11.7852 56.1627 12.5544 56.9014 13.5221 56.9014H20.346C21.3138 56.9014 22.083 56.1627 22.083 55.2334C22.083 54.3041 21.3138 53.5654 20.346 53.5654H13.5221Z" fill="currentColor"/>
            <path class="line line-2" d="M28.2872 19.6817C27.6172 19.0384 26.5006 19.0384 25.8306 19.6817C25.1606 20.3251 25.1606 21.3974 25.8306 22.0407L30.6445 26.6634C30.9919 26.997 31.4386 27.1638 31.8604 27.1638C32.2823 27.1638 32.7537 26.997 33.0763 26.6634C33.7463 26.02 33.7463 24.9478 33.0763 24.3044L28.2872 19.6817Z" fill="currentColor"/>
            <path class="line line-3" d="M63.6966 12.2949V5.74219C63.6966 4.81289 62.9274 4.07422 61.9596 4.07422C60.9919 4.07422 60.2227 4.81289 60.2227 5.74219V12.2949C60.2227 13.2242 60.9919 13.9629 61.9596 13.9629C62.9274 13.9629 63.6966 13.2004 63.6966 12.2949Z" fill="currentColor"/>
            <path class="line line-4" d="M99.0074 19.9196C99.6774 19.2763 99.6774 18.204 99.0074 17.5606C98.3374 16.9173 97.2208 16.9173 96.5508 17.5606L91.7369 22.1833C91.0669 22.8267 91.0669 23.8989 91.7369 24.5423C92.0843 24.8759 92.5309 25.0427 92.9527 25.0427C93.3746 25.0427 93.8461 24.8759 94.1686 24.5423L99.0074 19.9196Z" fill="currentColor"/>
            <path class="line line-5" d="M108.478 53.5654C109.446 53.5654 110.215 54.3041 110.215 55.2334C110.215 56.1627 109.446 56.9014 108.478 56.9014H101.654C100.686 56.9014 99.917 56.1627 99.917 55.2334C99.917 54.3041 100.686 53.5654 101.654 53.5654H108.478Z" fill="currentColor"/>
          </svg>
          <div class="text" aria-hidden="true">
            <span class="title">${i18n.getTranslation('logo.title')}</span>
            <span class="subtitle">${i18n.getTranslation('logo.subtitle')}</span>
          </div>
        `}
      </div>
    `;

    const logo = this.shadow.querySelector('.logo');
    if (logo && !this.disableRedirect) {
      logo.addEventListener('click', () => {
        history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });

      logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          history.pushState(null, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    }
  }
}

customElements.define('save-money-logo', SaveMoneyLogo);

export default SaveMoneyLogo;
