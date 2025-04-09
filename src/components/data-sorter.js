const SORT_ORDERS = {
  unsorted: "ascending",
  ascending: "descending",
  descending: "unsorted",
};

class dataSorter extends HTMLElement {
  #order = "unsorted";
  #column;
  #level = 0;
  #domButton;
  #domImage;
  #domDataSorters;

  static observedAttributes = ["order", "level"];

  static cssStyles = /* css */ `
    <style>
      .data-sorter {
        display: grid;
        grid-template-columns: auto 2em;
        align-items:center;

        & button {
          width: 2.5em;
          height: calc(2.5em - 1px);
          padding: 0;
          position: relative;

          &[data-level="1"]:not([data-order="unsorted"]) {
            padding-top: 0.5em;
          }

          &:not([data-level="0"])::after {
            content: attr(level);            
            position: absolute;
            width: 100%;
            left: 0;
            top: 1em;
            pointer-events: none;
          }
        }
      }
    </style>`;

  constructor() {
    super();
    this.#column = this.getAttribute("property");
    this.#order = this.getAttribute("order");
    this.#level = +this.getAttribute("level") ?? 0;
  }

  set level(_level) {
    this.#level = _level;
    this.setAttribute("level", this.#level);
  }

  set order(_order) {
    this.#order = _order;
    this.setAttribute("order", this.#order);
  }

  attributeChangedCallback(attribute, _oldValue, newValue) {
    if (this.shadowRoot) {
      if ("order" === attribute) {
        this.#order = newValue;
        this.#domButton.dataset.order = this.#order;
        this.#domImage.src = `../src/components/vcr.svg#${this.#order}`;
      }
      if ("level" === attribute) {
        this.#level = +newValue;
        this.#domButton.dataset.level = this.#level;
      }
    }
  }

  connectedCallback() {
    const template = document.createElement("template");
    template.innerHTML = /* html */ `${dataSorter.cssStyles}
      <article class="data-sorter">
        <span>
          <slot></slot>
        </span>
        <button data-level="${this.#level}" data-order="${this.#order}">
          <img src="../src/components/vcr.svg#${this.#order}" />
        </button>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.querySelector("button").addEventListener("click", (evt) => {
      if (!this.#domDataSorters) {
        this.#domDataSorters = [
          ...this.closest("table").querySelectorAll("data-sorter"),
        ];
      }

      this.#domDataSorters.forEach((_sorter) => {
        if (_sorter !== this) {
          _sorter.setAttribute("order", "unsorted");
          _sorter.setAttribute("level", 0);
        }
      });

      this.#order = SORT_ORDERS[this.#order];
      this.setAttribute("order", this.#order);

      this.#level = +(this.#order !== "unsorted");
      this.setAttribute("level", this.#level);

      this.dispatchEvent(
        new CustomEvent("sortOrderChanged", {
          detail: {
            column: this.#column,
            order: this.#order,
            level: this.#level,
          },
        })
      );
    });

    this.#domButton = this.shadowRoot.querySelector("button");
    this.#domImage = this.shadowRoot.querySelector("img");
  }
}

customElements.define("data-sorter", dataSorter);
