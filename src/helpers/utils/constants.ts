export const PAGE_SIZE = 10;
class SystemConst {
    static COOKIE_NAMES = {
        REFRESH_TOKEN: 'refreshToken',
        ACCESS_TOKEN: 'idToken',
        USERNAME: 'username',
        USER_ID: 'userId',
        CRYPT_ID: 'cryptID'
    };

    static COOKIE_EXPIRE_HOUR = {
        ACCESS_TOKEN: 8,
        REFRESH_TOKEN: 24,
    };
    static FORMATS_DATE = {
        DD_MM_YYYY: 'DD/MM/YYYY',
        YYYY_MM_DD: 'YYYY-MM-DD',
        YYYY_MM_DD_Z: 'YYYY-MM-DDTHH:mm:ss',
        DD_MM_YYYY_HH_MM_SS: 'DD/MM/YYYY HH:mm:ss',
        HH_MM: 'HH:mm',
    };
    static API_ERROR_CODE = {
        ERR_NETWORK: 'ERR_NETWORK',
    };
    static REGEX = {
        PHONE_NUMBER: /^(0|\+?84)\d{9}$/,
        PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{9,}$/,
        // eslint-disable-next-line no-control-regex
        IDENTIFY: /^[0-9]{9}$/,
        NUMBER: /^\d+$/,
    };

    static MESSAGES = {
        CREATE_SUCCESS: 'Tạo mới thành công',
        CREATE_ERROR: 'Tạo mới thất bại. Vui lòng liên hệ admin!',
        EDIT_SUCCESS: 'Sửa thành công',
        EDIT_ERROR: 'Sửa thất bại. Vui lòng liên hệ admin!',
    };
}

export default SystemConst;
