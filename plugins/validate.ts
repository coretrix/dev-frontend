import { Plugin } from "@nuxt/types"
const validators = require('vuelidate/lib/validators')

const validate:Plugin = (_, inject) => {
  const validate = {
    required(message: string) {
      return (v: any) => validators.required(v) || message || 'Field is required'
    },
    email(message: string) {
      return (v: any) => validators.email(v) || message || 'Must be a valid email'
    },
    numeric(message: string) {
      return (v: any) =>
        validators.numeric(v) || message || 'Must be a numeric value'
    },
    maxLength(max: number, message: string) {
      return (v: any) =>
        validators.maxLength(max)(v) ||
        message ||
        'max length of ' + max + ' characters exceeded'
    },
    minLength(min: number, message: string) {
      return (v: any) =>
        validators.minLength(min)(v) ||
        message ||
        'Min length of ' + min + ' characters exceeded'
    },
    minValue(min: number, message: string) {
      return (v: any) =>
        validators.minValue(min)(v) || message || 'Min value is ' + min
    },
    maxValue(min: number, message: string) {
      return (v: any) =>
        validators.maxValue(min)(v) || message || 'Max value is' + min
    },
    repeatPassword(pass: number, message: string) {
      return (v: any) => v === pass || message || 'Password does not match'
    },
    clearErrorMsg(errorsRefer: any, errorName: string) {
      return (v: any) => {
        errorsRefer[errorName] = []
        return true
      }
    },
  }
  inject('v', validate)
}

export default validate
