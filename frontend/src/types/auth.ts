export interface TokenResponse {
  access_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'ADMINISTRATIVE'
}
