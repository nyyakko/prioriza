export type Stock = {
    id?: number;
    ticker: string;
    price: { float: number, formatted: string, value: string };
};
