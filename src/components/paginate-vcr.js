class paginateVcr extends HTMLElement {
  #page = 1;
  #pages = 1;
  #spnPage;
  #spnPages;
  #vcrButtons;

  static cssStyles = /* css */ `
    <style>
      .vcr {
        display: grid;
        grid-template-columns: 2.5em 2.5em auto 2.5em 2.5em;
        justify-items: center;
        align-items: center;
        height: 2em;

        & button {
          width: 3em;
          height: calc(2.5em - 1px);
        }

        & img {
          width: 2em;
          pointer-events:none;
        }
      }

      #spnPage {
        margin-inline: 0.5em;
      }

      #spnPages {
        margin-left: 0.5em;
      }
    </style>`;

  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement("template");
    template.innerHTML = /* html */ `${paginateVcr.cssStyles}
      <article class="vcr">
        <button id="btnFirst"><img src="../src/components/vcr.svg#first" /></button>
        <button id="btnPrev"><img src="../src/components/vcr.svg#prev" /></button>
        <div>Page<span id="spnPage">${this.#page}</span>of<span id="spnPages">${
      this.#pages
    }</span></div>
        <button id="btnNext"><img src="../src/components/vcr.svg#next" /></button>
        <button id="btnLast"><img src="../src/components/vcr.svg#last" /></button>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#spnPage = this.shadowRoot.querySelector("#spnPage");
    this.#spnPages = this.shadowRoot.querySelector("#spnPages");
    this.#vcrButtons = [...this.shadowRoot.querySelectorAll("button")];
    this.shadowRoot
      .querySelector(".vcr")
      .addEventListener("click", this.btnVcrClicked.bind(this));
    this.buttonEnabling();
  }

  set page(value) {
    this.#page = +value;
    this.#spnPage.textContent = value;
    this.buttonEnabling();
  }

  set pages(value) {
    this.#pages = +value;
    this.#spnPages.textContent = value;
    this.buttonEnabling();
  }

  btnVcrClicked({ target }) {
    if (target.tagName !== "BUTTON") return;
    if (target.id === "btnFirst") this.page = 1;
    if (target.id === "btnPrev") this.page = this.#page - 1;
    if (target.id === "btnNext") this.page = this.#page + 1;
    if (target.id === "btnLast") this.page = this.#pages;
    this.dispatchEvent(
      new CustomEvent("vcrPageChange", { detail: this.#page })
    );
  }

  buttonEnabling() {
    this.#vcrButtons.forEach((button, index) => {
      button.disabled = this.#page === (index <= 1 ? 1 : this.#pages);
    });
  }
}

customElements.define("paginate-vcr", paginateVcr);
