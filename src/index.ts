import './scss/styles.scss';

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};
