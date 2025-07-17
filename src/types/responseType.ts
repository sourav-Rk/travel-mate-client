export type ApiResponseType<T>= {
    success : Boolean;
    message : String;
    data ?: T
}