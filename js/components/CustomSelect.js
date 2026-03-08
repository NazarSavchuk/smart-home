export class CustomSelect {
  #root;
  #trigger;
  #dropdown;
  #value;

  constructor(root) {
    this.#root = root;
    this.#trigger = root.querySelector(".custom-select__trigger span");
    this.#dropdown = root.querySelector(".custom-select__dropdown");

    this.#value = this.#dropdown.querySelector("[data-value]").dataset.value;

    this.#bindEvents();
  }

  get value() {
    return this.#value;
  }

  #bindEvents() {
    this.#root.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#toggle();
    });

    this.#dropdown.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.#select(item);
      });
    });

    document.addEventListener("click", () => this.#close());
  }

  #toggle() {
    this.#root.classList.toggle("open");
  }

  #close() {
    this.#root.classList.remove("open");
  }

  #select(item) {
    this.#dropdown.querySelector(".selected")?.classList.remove("selected");
    item.classList.add("selected");
    this.#value = item.dataset.value;
    this.#trigger.textContent = item.textContent;
    this.#close();

    this.#root.dispatchEvent(
      new CustomEvent("change", { detail: this.#value }),
    );
  }
}
