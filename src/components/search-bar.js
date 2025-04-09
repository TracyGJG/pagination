class searchBar extends HTMLElement {
  // #pageSize = 1;
  // #domPageSizeSelector;
  // #pageSizes = [0];
  // #domPageSizes = [];
  #domClrSorting;
  #domClrFilters;
  #domSearchInput;
  #domSearchRegExp;

  static cssStyles = /* css */ `
    <style>
      .search-bar {
        text-align: end;
        background-color: #DDD;
        padding: 0.5em;
        display: grid;
        grid-template-columns: 7em 7em auto 4em 2em 4em;
        min-width: 40em;
        gap: 0.5em;
        align-items: center;
      
        & button {
          height: 2em;
          width: 7em;
          padding: 0;
          text-align: center;
          font-family: "Times New Roman";
          font-size: 1rem;
        }

        & #btnSearch {
          width: 4em;
        }
        
        & [type="search"] {
          height: 2em;
          border-width: 1px;
          padding: 0 0.25em;
          font-family: "Times New Roman";
          font-size: 1rem;
          text-align: center;
          width: 15em;
          justify-self: end;
        }

        & [type="checkbox"] {
          width: 1.5em;
          aspect-ratio: 1;
          justify-self: right;
        }

        & label {
          justify-self:left
        }
      }
    </style>`;

  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement("template");
    template.innerHTML = /* html */ `${searchBar.cssStyles}
      <article class="search-bar">
        <button id="btnClrSorting">Clear Sorting</button>
        <button id="btnClrFilters">Clear Filters</button>
        <input type="search" autocomplete="off"/>
        <button id="btnSearch">Search</button>
        <input type="checkbox" id="chkRegExp" />
        <label for="chkRegExp">RegExp</label>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#domClrSorting = this.shadowRoot.querySelector("#btnClrSorting");
    this.#domClrFilters = this.shadowRoot.querySelector("#btnClrFilters");
    this.#domSearchInput = this.shadowRoot.querySelector('[type="search"]');
    this.#domSearchRegExp = this.shadowRoot.querySelector('[type="checkbox"]');
  }
}

customElements.define("search-bar", searchBar);
