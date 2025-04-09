import "./paginate-vcr.js";

class paginateData extends HTMLElement {
  #pageSize = 1;
  #domPageSizeSelector;
  #pageSizes = [0];
  #domPageSizes = [];
  #domVcr;
  #domGoTo;

  static observedAttributes = ["page", "pages"];

  static cssStyles = /* css */ `
    <style>
      .paginator {
        background-color: #DDD;
        padding: 0.5em;
        display: grid;
        grid-template-columns: 12em 18em 12em;
        justify-content: space-between;
        min-width: 40em;
        align-items: center;
      
        & button {
          width: 3em;
          height: 2em;
        }

        & > div:nth-child(2) {
          justify-self: center;
        }
        
        & > div:nth-child(3) {
          justify-self: right;
        }
      }
      
      #selPageSize {
        height: 2em;
        margin-inline: 0.25em;
      }
      
      #txtGotoPage {
        height: calc(2em - 2px);
        width: 3em;
        margin-inline: 0.25em;
        padding: 0;
        border-width: 1px;
        text-align: center;
      }
      
      #selPageSize,
      #txtGotoPage,
      #btnGotoPage {
        font-family: "Times New Roman";
        font-size: 1rem;
      }
    </style>`;

  constructor() {
    super();

    this.#pageSizes.push(
      ...this.getAttribute("pageSizes")
        ?.split(/,/)
        .map((size) => +size.trim())
    );
    if (this.getAttribute("includeall") === "false") {
      this.#domPageSizes = [];
    }
    this.#domPageSizes.push(
      ...this.#pageSizes.map((pageSize) =>
        pageSize
          ? /* html */ `<option value=${+pageSize}>${pageSize} rows</option>`
          : /* html */ `<option value=0>Show All</option>`
      )
    );
  }

  connectedCallback() {
    const template = document.createElement("template");
    template.innerHTML = /* html */ `${paginateData.cssStyles}
      <article class="paginator">
        <div>
          <span>Page size:</span>
          <select id="selPageSize">
          ${this.#domPageSizes.join("\n")}
          </select>
        </div>
        <paginate-vcr></paginate-vcr>
        <div>
          <span>Go to page:</span>
          <input type="text" id="txtGotoPage" autocomplete="off"/>
          <button id="btnGotoPage">Go</button>
        </div>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#domPageSizeSelector = this.shadowRoot.querySelector("#selPageSize");
    this.#domPageSizeSelector.selectedIndex = this.#pageSize;
    this.#domPageSizeSelector.addEventListener(
      "change",
      this.pageSizeChanged.bind(this)
    );
    this.#domGoTo = this.shadowRoot.querySelector("#txtGotoPage");
    this.shadowRoot
      .querySelector("#btnGotoPage")
      .addEventListener("click", this.goToClicked.bind(this));
    this.#domVcr = this.shadowRoot.querySelector("paginate-vcr");
    this.#domVcr.addEventListener("vcrPageChange", this.pageChanged.bind(this));
  }

  set page(value) {
    this.#domVcr.page = value;
  }

  set pages(value) {
    this.#domVcr.pages = value;
  }

  goToClicked() {
    const goToText = this.#domGoTo.value.trim();
    if (goToText.match(/^[1-9]\d*$/)) {
      const goToNum = +goToText;
      if (goToNum <= 10) {
        this.pageChanged({ detail: goToNum });
      }
    }
    this.#domGoTo.value = "";
  }

  pageSizeChanged() {
    const pageIndex = this.#domPageSizeSelector.selectedIndex;
    this.page = 1;
    this.dispatchEvent(
      new CustomEvent("paginatedSizeChange", {
        detail: this.#pageSizes[pageIndex],
      })
    );
  }

  pageChanged({ detail }) {
    this.page = detail;
    this.dispatchEvent(
      new CustomEvent("paginatedPageChange", {
        detail,
      })
    );
  }
}

customElements.define("paginate-data", paginateData);
