declare namespace AUTH {
  export interface IAuthResponseBase<P = any> {
    status?: number | string
    errorCode?: string | null
    message?: string | null
    data: P
  }

  export interface IAuth {
    data: string // access_token
    refresh_token: string
    expires_in: number
  }

  export interface ILoginRequest {
    password: string
    username: string
    scope: string
    grant_type: string
    client_id: string
  }

  export interface ILoginResponse extends IAuth {}
  export interface IProfileResponse extends IUser {}

  export interface IVerifyVendorTokenRequest {
    token: string
  }

  export interface IVerifyVendorTokenResponse
    extends IAuthResponseBase<IAuth> {}

  export interface IVerifyVendorTokenAction {
    params: IVerifyVendorTokenRequest
    onPostVerifyToken?: (response?: IVerifyVendorTokenResponse) => void
  }
}
