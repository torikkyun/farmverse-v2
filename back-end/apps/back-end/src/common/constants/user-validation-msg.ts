export const UserValidationMessages = {
  EMAIL: {
    NOT_EMPTY: 'Email không được để trống',
    INVALID_FORMAT: 'Email không đúng định dạng',
  },
  PASSWORD: {
    NOT_EMPTY: 'Mật khẩu không được để trống',
    MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
    MAX_LENGTH: 'Mật khẩu không được vượt quá 15 ký tự',
    MUST_BE_STRING: 'Mật khẩu phải là chuỗi ký tự',
  },
  NAME: {
    NOT_EMPTY: 'Tên không được để trống',
    MUST_BE_STRING: 'Tên phải là chuỗi ký tự',
    MAX_LENGTH: 'Tên không được vượt quá 50 ký tự',
    MIN_LENGTH: 'Tên phải có ít nhất 2 ký tự',
  },
  ROLE: {
    INVALID: 'Vai trò không hợp lệ',
    NOT_EMPTY: 'Vai trò không được để trống',
    MUST_BE_STRING: 'Vai trò phải là chuỗi ký tự',
  },
};
