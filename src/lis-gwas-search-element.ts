import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {LisPaginatedSearchMixin, PaginatedSearchOptions} from './mixins';


/**
 * The data that will be passed to the search function by the
 * {@link LisGWASSearchElement | `LisGWASSearchElement`} class when a search is
 * performed.
 */
export type GWASSearchData = {
    query: string;
};


/**
 * A single result of a gwas search performed by the
 * {@link LisGWASSearchElement | `LisGWASSearchElement`} class.
 */
export type GWASSearchResult = {
    identifier: string;
    genotypes: string;
    synopsis: string;
    organism_name: string;
};


/**
 * The signature of the function the
 * {@link LisGWASSearchElement | `LisGWASSearchElement`} class requires for
 * performing a gwas search.
 *
 * @param query The search term in the input element when the search form was
 * submitted.
 * @param page What page of results the search is for. Will always be 1 when a
 * new search is performed.
 * @param options Optional parameters that aren't required to perform a gwas
 * search but may be useful.
 *
 * @returns A {@link !Promise | `Promise`} that resolves to an
 * {@link !Array | `Array`} of {@link GWASSearchResult | `GWASSearchResult`}
 * objects.
 */
export type GWASSearchFunction =
    (query: string, page: number, options: PaginatedSearchOptions) => Promise<Array<GWASSearchResult>>;


/**
 * @htmlElement `<lis-gwas-search-element>`
 *
 * A Web Component that provides an interface for performing keyword searches
 * for gwass and displaying results in a paginated table. Note that the
 * component saves its state to the URL query string parameters and a search
 * will be automatically performed if the parameters are present when the
 * componnent is loaded. The component uses the
 * {@link mixins!LisPaginatedSearchMixin | `LisPaginatedSearchMixin`} mixin. See
 * the mixin docs for further details.
 *
 * @queryStringParameters
 * - **query:** The text in the query field of the search form.
 * - **page:** What page of results is loaded.
 *
 * @example 
 * {@link !HTMLElement | `HTMLElement`} properties can only be set via
 * JavaScript. This means the {@link searchFunction | `searchFunction`} property
 * must be set on a `<lis-gwas-search-element>` tag's instance of the
 * {@link LisGWASSearchElement | `LisGWASSearchElement`} class. For example:
 * ```html
 * <!-- add the Web Component to your HTML -->
 * <lis-gwas-search-element id="gwas-search"></lis-gwas-search-element>
 *
 * <!-- configure the Web Component via JavaScript -->
 * <script type="text/javascript">
 *   // a site-specific function that sends a request to a gwas search API
 *   function getGWASs(searchText, page, {abortSignal}) {
 *     // returns a Promise that resolves to a search result object
 *   }
 *   // get the gwas search element
 *   const searchElement = document.getElementById('gwas-search');
 *   // set the element's searchFunction property
 *   searchElement.searchFunction = getGWASs;
 * </script>
 * ```
 */
@customElement('lis-gwas-search-element')
export class LisGWASSearchElement extends
LisPaginatedSearchMixin(LitElement)<GWASSearchData, GWASSearchResult>() {

    /** @ignore */
    // used by Lit to style the Shadow DOM
    // not necessary but exclusion breaks TypeDoc
    static override styles = css``;

    constructor() {
        super();
        // configure query string parameters
        this.requiredQueryStringParams = ['query'];
        // configure results table
        this.resultAttributes = [
            'organism_genus',
            'identifier',
            'genotypes',
            'synopsis'
        ];
        this.tableHeader = {
            organism_genus: 'Genus',
            identifier: 'GWAS',
            genotypes: 'Genotypes',
            synopsis: 'Synopsis'
        };
    }

    /** @ignore */
    // used by LisPaginatedSearchMixin to draw the template
    override renderForm() {
        return html`
<form>
<fieldset class="uk-fieldset">
<legend class="uk-legend">GWAS description search (e.g. pod)</legend>
<div class="uk-margin">
<input
name="query"
class="uk-input"
type="text"
placeholder="Input"
aria-label="Input"
.value=${this.queryStringController.getParameter('query')}>
</div>
<div class="uk-margin">
<button type="submit" class="uk-button uk-button-primary">Search</button>
</div>
</fieldset>
</form>
`;
    }

}


declare global {
    interface HTMLElementTagNameMap {
        'lis-gwas-search-element': LisGWASSearchElement;
    }
}
