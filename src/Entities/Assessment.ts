export type Assessment = {
    category: string,
    questions: {
        value: string;
        inverse?: boolean;
    }[];
};
