import type { Stock } from './Stock';
import type { Indices } from './Indices';

export type Company = {
    id?: number;
    name: string;
    indices: Indices;
    bias: number;
    stock: Stock;
};
