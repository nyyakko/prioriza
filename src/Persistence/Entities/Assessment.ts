export type Assessment = {
    id?: number;
    category: string,
    questions: {
        value: string;
        inverse?: boolean;
    }[];
};
