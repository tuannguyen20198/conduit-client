import Request from '@helpers/utils/request'

import { APPLICATION_API } from '@env'

class IAuthenticateService extends Request {
  public constructor() {
    super(APPLICATION_API)
    this.manualHandleError = true
   // this.contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  public login = async (params: any): Promise<AUTH.ILoginResponse> => {
    return await this.instance.post('/api/auth/login', params)
  }
}

const authenticateService = new IAuthenticateService()
export default authenticateService
