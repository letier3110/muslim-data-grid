interface UIPaginationAttributes {
  'page-limit': number;
  'total-pages': number;
  'current-page': number;
}

export interface PageChangeEventDetail {
  page: number;
}

export class UIPagination extends HTMLElement {
  private currentPage: number;
  private totalPages: number;
  private pageLimit: number;
  private nextPageButtonLabel: string;
  private prevPageButtonLabel: string;
  private pageButtonLabel: string;
  private ofButtonLabel: string;

  constructor() {
    super();
    this.prevPageButtonLabel = this.getAttribute('prev-page-button-label') || 'Prev';
    this.nextPageButtonLabel = this.getAttribute('next-page-button-label') || 'Next';
    this.pageButtonLabel = this.getAttribute('page-button-label') || 'Page';
    this.ofButtonLabel = this.getAttribute('of-button-label') || 'of';
    this.currentPage = 1;
    this.totalPages = 1;
    this.pageLimit = parseInt(this.getAttribute('page-limit') || '10', 10);
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot?.addEventListener('click', this.handlePageClick);
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this.handlePageClick);
  }

  static get observedAttributes() {
    return ['page-limit', 'total-pages', 'current-page'];
  }

  attributeChangedCallback(name: keyof UIPaginationAttributes, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'page-limit':
          this.pageLimit = parseInt(newValue, 10);
          break;
        case 'total-pages':
          this.totalPages = parseInt(newValue, 10);
          break;
        case 'current-page':
          this.currentPage = parseInt(newValue, 10);
          break;
      }
      this.render();
    }
  }

  private handlePageClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      const page = target.getAttribute('data-page');
      if (page === 'prev' && this.currentPage > 1) {
        this.setCurrentPage(this.currentPage - 1);
      } else if (page === 'next' && this.currentPage < this.totalPages) {
        this.setCurrentPage(this.currentPage + 1);
      }
    }
  };

  private render() {
    const paginationInfo = `${this.pageButtonLabel} ${this.currentPage} ${this.ofButtonLabel} ${this.totalPages}`;
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
        }
        button {
          margin: 0 5px;
          padding: 5px 10px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
        }
        button[disabled] {
          background: #eee;
          cursor: not-allowed;
        }
      </style>
      <div>
        <button data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>${this.prevPageButtonLabel}</button>
        <span>${paginationInfo}</span>
        <button data-page="next" ${this.currentPage === this.totalPages ? 'disabled' : ''}>${this.nextPageButtonLabel}</button>
      </div>
    `;
  }

  public setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
    this.render();
  }

  public setCurrentPage(page: number) {
    this.currentPage = page;
    this.dispatchEvent(new CustomEvent<PageChangeEventDetail>('page-change', { detail: { page } }));
    this.render();
  }
}

window.customElements.define('ui-pagination', UIPagination);