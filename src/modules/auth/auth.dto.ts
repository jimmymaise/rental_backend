export interface AuthDTO {
  accessToken?: string
  refreshToken?: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface GuardUserPayload {
  id: string
  email: string
}
