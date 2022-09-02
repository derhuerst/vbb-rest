
export type Lines = Line[]

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