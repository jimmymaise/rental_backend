export interface AuthDTO {
  accessToken?: string
  refreshToken?: string
  user: {
    id: string
    email: string
  }
}

export interface GuardUserPayload {
  id: string
  email: string
}
