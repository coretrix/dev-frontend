const validators = require('vuelidate/lib/validators')

export default (_, inject) => {
  const validate = {
    required(message) {
      return (v) => validators.required(v) || message || 'Field is required'
    },
    email(message) {
      return (v) => validators.email(v) || message || 'Must be a valid email'
    },
    numeric(message) {
      return (v) =>
        validators.numeric(v) || message || 'Must be a numeric value'
    },
    maxLength(max, message) {
      return (v) =>
        validators.maxLength(max)(v) ||
        message ||
        'max length of ' + max + ' characters exceeded'
    },
    minLength(min, message) {
      return (v) =>
        validators.minLength(min)(v) ||
        message ||
        'Min length of ' + min + ' characters exceeded'
    },
    minValue(min, message) {
      return (v) =>
        validators.minValue(min)(v) || message || 'Min value is ' + min
    },
    maxValue(min, message) {
      return (v) =>
        validators.maxValue(min)(v) || message || 'Max value is' + min
    },
    repeatPassword(pass, message) {
      return (v) => v === pass || message || 'Password does not match'
    },
    clearErrorMsg(errorsRefer, errorName) {
      return (v) => {
        errorsRefer[errorName] = []
        return true
      }
    },
  }
  inject('v', validate)
}
