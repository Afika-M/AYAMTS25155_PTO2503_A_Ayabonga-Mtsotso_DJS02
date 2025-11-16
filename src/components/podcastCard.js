import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 *  Web component for a podcast preview.
 * - uses shadow DOM to isolate styles
 * - accepts attributes: podcastid, title, image, genres (csv of ids), seasons, updated
 * - dispatches "podcast-selected" when clicked
 */
class podcastCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["podcastid", "title", "image", "genres", "seasons", "updated"];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute("podcastid") || "";
    const title = this.getAttribute("title") || "No title";
    const image = this.getAttribute("image") || "";
    const seasons = this.getAttribute("seasons") || 0;
    const updated = this.getAttribute("updated") || "";

    const genresAttribute = this.getAttribute("genres");
    const safeGenresValue = genresAttribute ? genresAttribute : "";
    let genreIds = [];
    if (safeGenresValue !== "") {
      const splitValues = safeGenresValue.split(",");
      genreIds = splitValues.map((value) => Number(value.trim()));
    }
    const genreNames = GenreService.getNames(genreIds);

    const formattedDate = updated ? DateUtils.format(updated) : "";

    this.shadowRoot.innerHTML = `
      <div class="card" role="button" tabindex="0">
        <img src="${image}" alt="${title} cover" />
        <h3>${title}</h3>
        <p>${seasons} season${Number(seasons) > 1 ? "s" : ""}</p>
        <div class="tags">
          ${genreNames.map((g) => `<span class="tag">${g}</span>`).join("")}
        </div>
        <p class="updated">${formattedDate}</p>
      </div>
    `;

    const card = this.shadowRoot.querySelector(".card");
    if (card) {
      card.addEventListener("click", () => {
        const event = new CustomEvent("podcast-selected", {
          detail: { id: String(id) },
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(event);
      });
    }
  }
}

customElements.define("podcast-card", podcastCard);
export { podcastCard };
