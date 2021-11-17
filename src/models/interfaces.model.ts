export interface ResServer {
    status: 200 | 403 | 500;
    response: User;
    error: any
}
export interface User {
    name: string;
    firstname: string;
    email: string;
    avatar: string;
    password?:string;
}
export interface SimpleAlert {
    title: string,
    icon: "success" | "info" | "error" | "warning",
    timer: number
}