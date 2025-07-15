export interface AuthResponse {
    role: string | null;
    email: string | null;
    name: string | null;
    expirationDate: string | null;
    parkingFavorites: string[] | null;
}
