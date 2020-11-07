export interface AuthDTO {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
  }
}
