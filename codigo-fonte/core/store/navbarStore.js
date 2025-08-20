const NAVBAR_COLLAPSED_KEY = 'navbar-collapsed';

class NavbarStore extends EventTarget {
  constructor() {
    super();
    const stored = localStorage.getItem(NAVBAR_COLLAPSED_KEY);
    this._collapsed = stored !== null ? JSON.parse(stored) : window.innerWidth <= 1024;
  }

  get collapsed() {
    return this._collapsed;
  }

  set collapsed(value) {
    if (this._collapsed !== value) {
      this._collapsed = value;
      localStorage.setItem(NAVBAR_COLLAPSED_KEY, JSON.stringify(value));
      this.dispatchEvent(new CustomEvent('change', { detail: value }));
    }
  }

  toggle() {
    this.collapsed = !this._collapsed;
  }

  listen(callback) {
    const handler = (e) => callback(e.detail);
    this.addEventListener('change', handler);
    return () => this.removeEventListener('change', handler);
  }
}

export const navbarStore = new NavbarStore();
