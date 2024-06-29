export interface JwtPayload {
    sub: number;
    email?: string;
    phone?: string;
    type?: string;
}