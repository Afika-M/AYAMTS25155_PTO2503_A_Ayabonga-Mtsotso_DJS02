import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 *  Web component for a podcast preview.
 * 
 * Custom HTML element that renders a podcast preview card
 * - uses shadow DOM to isolate styles
 * - accepts attributes: podcastid, title, image, genres (csv of ids), seasons, updated
 * - dispatches "podcast-selected" when clicked
 * 
 * @example podcast-card
 * 
 * @attr {string} podcastid - Unique identifier for the podcast
 * @attr {string} title - Title of the podcast
 * @attr {string} image - URL of the podcast cover image
 * @attr {string} genres - Comma-separated list of genre IDs
 * @attr {number} seasons - Number of seasons
 * @attr {string} updated - ISO Date string of last update
 *
 * @fires podcast-selected - Custom event dispatched when the card is clicked.
 *   The event detail contains `{ id: string }`.
 */
class podcastCard extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM
    this.attachShadow({ mode: "open" });
  }
  /**
   * Attributes to watch for changes.
   * If any of these values change, `attributeChangedCallback()` will run.
   */

  static get observedAttributes() {
    return ["podcastid", "title", "image", "genres", "seasons", "updated"];
  }

  // Called whenever any obeserved attributes change
  attributeChangedCallback() {
    this.render();
  }

  // Called when the element is inserted to the DOM
  connectedCallback() {
    this.render();
  }
 // Render the podcasT card inside the shadow DOM
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
      <style>
        .card {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .card:hover { transform: scale(1.02); }
        img { width: 100%; border-radius: 6px; }
        h3 { margin: .5rem 0; font-size: 1rem; }
        p { margin: 0; font-size: .8rem; color: #555; }
        .tags { margin: .5rem 0; }
        .tag { background: #eee; padding: .3rem .6rem; margin-right: .4rem; border-radius: 4px; display:inline-block; font-size: .8rem;}
        .updated { font-size: .8rem; color: #555; margin-top: .5rem;}
      </style>

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
    // Adds click listener that dispatches the custom event
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
