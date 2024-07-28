export interface JwtPayload {
    sub: number;
    jti?: string;
    email?: string;
    phone?: string;
    type?: string;
    isNewUser?: boolean;
    fromAdmin?: boolean;
}
