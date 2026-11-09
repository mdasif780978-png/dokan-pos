/**
 * An error whose `code` is an i18n key, so the UI can show it in Bangla or English.
 * e.g. throw new AppError('err.needCustomer')
 */
export class AppError extends Error {
  constructor(code, vars) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.vars = vars;
  }
}
