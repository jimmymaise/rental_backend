export interface AuthDTO {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}
