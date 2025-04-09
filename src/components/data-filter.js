const FILTERS = {
  "filter-on": "filter-off",
  "filter-off": "filter-on",
};

class dataFilter extends HTMLElement {
  #state = "filter-on";
  #column;
  #isNullable;
  #values = [];
  #isNull;
  #domButton;
  #domImage;

  static observedAttributes = ["values", "isNull"];

  static cssStyles = /* css */ `
    <style>
      .data-filter {
        display: grid;
        grid-template-columns: auto 2em;
        align-items:center;

        & div {
          text-overflow: ellipsis;
          height: 1em;
          overflow: hidden;
        }

        & button {
          width: 2.5em;
          height: calc(2.5em - 1px);
          padding: 0;
          position: relative;
        }
      }
    </style>`;

  constructor() {
    super();
    this.#column = this.getAttribute("property");
    this.#isNullable =
      this.getAttribute("isNullable")?.toLowerCase() !== "true";
  }

  attributeChangedCallback(attribute, _oldValue, newValue) {
    if (this.#domImage) {
      if ("values" === attribute) {
        this.#values = newValue.split(/,\s*/);
        this.#state = this.#state === "filter-on" ? "filter-off" : "filter-on";
        this.#domImage.src = `../src/components/vcr.svg#${this.#state}`;
      }
      if ("isNull" === attribute) {
        this.#isNull = newValue.toLowerCase !== "true";
      }
    }
  }

  connectedCallback() {
    const template = document.createElement("template");
    template.innerHTML = /* html */ `${dataFilter.cssStyles}
      <article class="data-filter">
      <div>
          <slot></slot>
        </div>
        <button>
          <img src="../src/components/vcr.svg#${this.#state}" />
        </button>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    /* this.#domButton = this.shadowRoot.querySelector("button"); */
    this.#domImage = this.shadowRoot.querySelector("img");

    this.shadowRoot.querySelector("button").addEventListener("click", (evt) => {
      this.#state = FILTERS[this.#state];
      this.#domImage.src = `../src/components/vcr.svg#${this.#state}`;
      this.dispatchEvent(
        new CustomEvent("filterChanged", {
          detail: {
            column: this.#column,
            values: this.#values,
            isNull: this.#isNull,
          },
        })
      );
    });
  }
}

customElements.define("data-filter", dataFilter);
