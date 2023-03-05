import type { ActionRequest } from '../Request'

/**
 * Search the wiki using the OpenSearch protocol.
 */
export interface OpenSearchRequest extends ActionRequest {
	action: 'opensearch'

	/**
	 * Maximum number of results to return.
	 */
	limit?: number | 'max'

	/**
	 * Namespaces to search. Ignored if search begins with a valid namespace prefix.
	 * @default 0
	 */
	namespace?: number | number[] | '*'

	/**
	 * Search profile to use.
	`strict`: Strict profile with few punctuation characters removed but diacritics and stress marks are kept.\n
    `normal`: Few punctuation characters, some diacritics and stopwords removed.
    `normal-subphrases`: Few punctuation characters, some diacritics and stopwords removed. It will match also subphrases (can be subphrases or subpages depending on internal wiki configuration).
    `fuzzy`: Similar to normal with typo correction (two typos supported).
    `fast-fuzzy`: Experimental fuzzy profile (may be removed at any time)
    `fuzzy-subphrases`: Similar to normal with typo correction (two typos supported). It will match also subphrases (can be subphrases or subpages depending on internal wiki configuration).
	`classic`: Classic prefix, few punctuation characters and some diacritics removed.
	`engine_autoselect`: Let the search engine decide on the best profile to use.
	 * @default 'engine_autoselect'
	 */
	profile?: 'strict' | 'normal' | 'normal-subphrases' | 'fuzzy' | 'fast-fuzzy' | 'fuzzy-subphrases' | 'classic' | 'engine_autoselect'

	/**
	 * How to handle redirects.
	 */
	redirects?: 'return' | 'resolve'

	/**
	 * Search string.
	 */
	search: string
}

type OpenSearchResponseArray = [ string, string[], string[], string[] ]

export interface OpenSearchResponse extends Response, OpenSearchResponseArray {

}
