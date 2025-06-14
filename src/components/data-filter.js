const FILTERS = {
  "filter-on": "filter-off",
  "filter-off": "filter-on",
};

class dataFilter extends HTMLElement {
  #state = "filter-off";
  #column;
  #isNullable;
  #values = [];
  #isNull;
  #domImage;

  static observedAttributes = ["mode"];

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

  set mode(_mode) {
    this.#state = `filter-${_mode}`;
    this.setAttribute("mode", _mode);
  }

  attributeChangedCallback(attribute, _oldValue, newValue) {
    if (this.shadowRoot) {
      if ("mode" === attribute) {
        this.#state = `filter-${newValue}`;
        this.#domImage.src = `./components/vcr.svg#${this.#state}`;
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
          <img src="./components/vcr.svg#${this.#state}" />
        </button>
      </article>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.#domImage = this.shadowRoot.querySelector("img");

    this.shadowRoot.querySelector("button").addEventListener("click", (evt) => {
      this.mode = FILTERS[this.#state].slice(7);
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
