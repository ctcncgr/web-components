import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {LisPaginatedSearchMixin, PaginatedSearchOptions} from './mixins';

/**
 * The data that will be passed to the search function by the
 * {@link LisGeneSearchElement | `LisGeneSearchElement`} class when a search is
 * performed.
 */
export type MineWebPropertiesData = {
};

/**
 * A single result of a web properties request performed by the
 * {@link LisMineWebPropertiesElement | `LisMineWebPropertiesElement`} class.
 */
export type MineWebPropertiesResult = {
    title: string;
    subTitle: string;
    releaseVersion: string;
    sitePrefix: string;
};

/**
 * The signature of the function the
 * {@link LisGeneSearchElement | `LisGeneSearchElement`} class requires for
 * performing a gene search.
 *
 * FIX: this function doesn't require query, page, or options. It's just a
 * static query.
 *
 * @param query The search term in the input element when the search form was
 * submitted.
 * @param page What page of results the search is for. Will always be 1 when a
 * new search is performed.
 * @param options Optional parameters that aren't required to perform a gene
 * search but may be useful.
 *
 * @returns A {@link !Promise | `Promise`} that resolves to an
 * {@link !Array | `Array`} of {@link GeneSearchResult | `GeneSearchResult`}
 * objects.
 */
export type MineWebPropertiesFunction =
    (query: string, page: number, options: PaginatedSearchOptions) => Promise<Array<MineWebPropertiesResult>>

/**
 * @htmlElement `<lis-mine-web-properties-element>`
 *
 * A Web Component that provides an interface for retrieving the web properties of
 * the mines which are queried by the GraphQL server.
 *
 * @example 
 * {@link !HTMLElement | `HTMLElement`} properties can only be set via
 * JavaScript. This means the {@link searchFunction | `searchFunction`} property
 * must be set on a `<lis-gene-search-element>` tag's instance of the
 * {@link LisGeneSearchElement | `LisGeneSearchElement`} class. For example:
 * ```html
 * <!-- add the Web Component to your HTML -->
 * <lis-gene-search-element id="gene-search"></lis-gene-search-element>
 *
 * <!-- configure the Web Component via JavaScript -->
 * <script type="text/javascript">
 *   // a site-specific function that sends a request to a gene search API
 *   function getGenes(searchText, page, {abortSignal}) {
 *     // returns a Promise that resolves to a search result object
 *   }
 *   // get the gene search element
 *   const searchElement = document.getElementById('gene-search');
 *   // set the element's searchFunction property
 *   searchElement.searchFunction = getGenes;
 * </script>
 * ```
 */
@customElement('lis-mine-web-properties-element')
export class LisMineWebPropertiesElement extends
LisPaginatedSearchMixin(LitElement)<MineWebPropertiesData, MineWebPropertiesResult>() {

    /** @ignore */
    // used by Lit to style the Shadow DOM
    // not necessary but exclusion breaks TypeDoc
    static override styles = css``;

    constructor() {
        super();
        // configure query string parameters
        this.requiredQueryStringParams = [];
        // configure results table
        this.resultAttributes = [
            'title',
            'subTitle',
            'releaseVersion',
            'sitePrefix'
        ];
        this.tableHeader = {
            'title': 'Mine',
            'subTitle': 'Contents',
            'releaseVersion': 'Release',
            'sitePrefix': 'URL'
        };
    }

    /** @ignore */
    // used by LisPaginatedSearchMixin to draw the template
    override renderForm() {
        return html`
<form>
<fieldset class="uk-fieldset">
<legend class="uk-legend">Web Properties of the Queried Mines</legend>
<div class="uk-margin">
<button type="submit" class="uk-button uk-button-primary">GO!</button>
</div>
</fieldset>
</form>
`;
    }

}


declare global {
    interface HTMLElementTagNameMap {
        'lis-mine-web-properties-element': LisMineWebPropertiesElement;
    }
}
