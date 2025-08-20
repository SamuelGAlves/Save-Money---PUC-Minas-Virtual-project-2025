class ModalBase extends HTMLElement {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  open() {

    const modal = this.shadowRoot.querySelector('#modal');
    modal.style.display = 'flex';

    document.body.style.overflow = 'hidden';

    // Trap de foco
    this.focusableElements = Array.from(
      modal.querySelectorAll(
        'input, app-button, app-input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    this.firstFocusable.focus();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  close() {

    this.shadowRoot.querySelector('#modal').style.display = 'none';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'Tab') {
      const isShift = e.shiftKey;

      const activeElement = this.shadowRoot.activeElement;
      if (isShift) {
        if (activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        if (activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      this.close();
    }
  }
}

export default ModalBase;
