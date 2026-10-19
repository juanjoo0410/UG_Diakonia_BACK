export interface IDataResponse<T> {
    message: string;
    obj: T;
    documentId?: number;
}