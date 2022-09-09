declare module "vbb-lines" {
	
	export interface Line {
		type: string;
		id: string;
		name: string;
		operator: string;
		mode: string;
		product: string;
		variants: Variant[];
	}
	
	export interface Variant {
		stops: string[];
		trips: number;
	}

	type FilterByKeysInput = Record<string, unknown>;
	type FilterFunction = (line: Line) => boolean;

    export function filterByKeys(pattern: FilterByKeysInput): FilterFunction;
    export function filterById(id: string): FilterFunction;
}

declare module "cli-native" {
   export function to(str: string | undefined | null, delimiter?: string, json?: boolean): unknown
   export function from(str: unknown, delimiter?: string, json?: boolean): string
}

declare module "serve-buffer" {


	interface ServeBufferConfig {
		contentType?: string
		timeModified?: Date
		etag?: string

		gzip?: boolean
		gzipMaxSize?: number
		brotliCompress?: boolean
		brotliCompressMaxSize?: number
		unmutatedBuffers?: boolean

		cacheControl?: boolean
		maxAge?: number
		immutable?: boolean

		// hook functions for modifying serve-buffer's behavior
		beforeSend?: (req: Request, res: Response, body: string, opt: unknown) => void,
	}

    export default function serveBuffer(req, res, buf, opt: ServeBufferConfig, cb?: () => void): void;
}

declare module "vbb-shapes" {

	type Shape = Array<Array<number>>
	
	export default function shapes(shapeId: number, formatAsLineString?: boolean): Promise<Shape>;
 }

 declare module "vbb-stations-autocomplete" {

	interface ShortStation {
		id: string
		relevance: number
		score: number
	} 
	
	export default function autocomplete(query: string, results?: number, fuzzy?: boolean, completion?: boolean): ShortStation[];
 }
 
