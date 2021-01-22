const FormsUtilities = {
  data() {
    return {
      formsErrors: {},
      formsData: {},
      formsValidation: {},
      formsInitData: {},
    }
  },
  created() {
    this.initFormsReactData()
  },
  methods: {
    initFormsReactData() {
      Object.keys(this.formsInitData).forEach((formName) => {
        this.$set(
          this.$data.formsData,
          formName,
          this.formsInitData[formName]()
        )
        this.$set(this.$data.formsErrors, formName, {})
        this.$set(this.$data.formsValidation, formName, true)
      })
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetValidation()
      this.formsErrors[formName] = {}
      this.formsData[formName] = this.formsInitData[formName]()
    },
  },
}

const ApiUtilities = {
  data() {
    return {
      GlobalError: '',
      isLoading: false,
    }
  },
  methods: {
    api() {
      this.isLoading = true
      return this.$axios
    },
    apiOnFinishRequest() {
      this.isLoading = false
    },
    apiOnCatchError(formName) {
      return (error) => {
        if (!error.response) {
          return
        }
        let errorMsg = ''
        if (formName && error.response.data.FieldsError) {
          this.formsErrors[formName] = {
            ...error.response.data.FieldsError,
          }
          errorMsg = this.$t('global.message.incorrectFields')
        }
        if (error.response.data.GlobalError) {
          this.GlobalError = error.response.data.GlobalError
          errorMsg += ' ' + error.response.data.GlobalError
        }
        if (errorMsg) {
          this.$dialog.message.error(errorMsg)
        }
      }
    },
  },
}

const PropsUtilities = {
  methods: {
    syncChangeProp(propEventName, prop, changed) {
      this.$emit(`update:${propEventName}`, { ...prop, ...changed })
    },
  },
}

export { FormsUtilities, ApiUtilities, PropsUtilities }
