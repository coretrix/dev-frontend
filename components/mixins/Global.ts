import { Component, Vue } from 'nuxt-property-decorator'

type IFormErrors = {
  [key: string]: Object
}
type IformsInitData = {
  [key: string]: any
}
type IformsData = {
  [key: string]: any
}

@Component
export class FormsUtilities extends Vue {
  formsErrors:IFormErrors = {}
  formsData:IformsData = {}
  formsValidation = {}
  formsInitData:IformsInitData = {}

  created () {
    this.initFormsReactData()
  }

  initFormsReactData () {
    Object.keys(this.formsInitData).forEach((formName:string) => {
      this.$set(
        this.$data.formsData,
        formName,
        this.formsInitData[formName]()
      )
      this.$set(this.$data.formsErrors, formName, {})
      this.$set(this.$data.formsValidation, formName, true)
    })
  }

  resetForm (formName: string) {
    const form:any = this.$refs[formName]
    form && form.resetValidation()
    this.formsErrors[formName] = {}
    this.formsData[formName] = this.formsInitData[formName]()
  }
}

@Component
export class ApiUtilities extends Vue {
  formsErrors:IFormErrors = {}
  GlobalError:string = ''
  isLoading:boolean = false

  api () {
    this.isLoading = true
    return this.$axios
  }

  apiOnFinishRequest () {
    this.isLoading = false
  }

  apiOnCatchError (formName:string) {
    return (error:any) => {
      if (!error.response) {
        return
      }
      let errorMsg = ''
      if (formName && error.response.data.FieldsError) {
        this.formsErrors[formName] = {
          ...error.response.data.FieldsError
        }
        // errorMsg = this.$t('global.message.incorrectFields')
        errorMsg = 'incorrectFields'
      }
      if (error.response.data.GlobalError) {
        this.GlobalError = error.response.data.GlobalError
        errorMsg += ' ' + error.response.data.GlobalError
      }
      if (errorMsg) {
        this.$notification.show({ type: 'error', message: errorMsg })
      }
    }
  }
}

@Component
export class PropsUtilities extends Vue {
  syncChangeProp (propEventName: string, prop: Object, changed: Object) {
    this.$emit(`update:${propEventName}`, { ...prop, ...changed })
  }
}
