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
}
