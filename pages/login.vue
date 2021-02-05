<template>
  <v-row class="fill-height d-flex justify-center align-center" no-gutters>
    <div>
      <div class="mb-8">
        <div class="mb-lg-0 text-center primary--text">
          <h1 class="c-title">Dev Panel</h1>
          <span class="c-subtext">
            powered by
            <strong>CoreTrix</strong>
          </span>
        </div>
      </div>

      <v-card min-width="320px">
        <v-card-title class="justify-center p-6">
          <h2 class="mb-4">Login</h2>
        </v-card-title>
        <v-card-text class="px-6 pb-6">
          <v-form ref="form" v-model="valid">
            <v-row no-gutters>
              <v-text-field
                v-model="loginData.Username"
                :rules="[
                  $v.clearErrorMsg(formErrors, 'Username'),
                  $v.required(),
                ]"
                :error-messages="formErrors.Username"
                placeholder="Username"
                outlined
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                v-model="loginData.Password"
                :rules="[
                  $v.clearErrorMsg(formErrors, 'Password'),
                  $v.required(),
                ]"
                :error-messages="formErrors.Password"
                type="password"
                placeholder="Password"
                outlined
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-btn
                color="primary"
                :disabled="!valid"
                width="100%"
                large
                @click="login"
              >
                Submit
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-row>
</template>

<script>
// import { mdiBroom, mdiCached, mdiLoading, mdiCalculator } from '@mdi/js'

export default {
  name: 'Actions',
  layout: 'login',
  data: () => {
    return {
      loginData: {
        Username: '',
        Password: '',
      },
      formErrors: {
        Username: '',
        Password: '',
      },
      valid: false,
    }
  },
  methods: {
    async login() {
      this.$refs.form.resetValidation()
      await this.$axios
        .post('/dev/login/', this.loginData)
        .then((response) => {
          this.$auth.login(response.data?.Result)
          this.$router.push('/')
        })
        .catch((error) => {
          if (error.response?.data?.FieldsError) {
            this.formErrors = Object.assign(
              {},
              error.response?.data?.FieldsError
            )
          } else if (error.response?.data?.GlobalError) {
            this.$notification.show({
              type: 'error',
              message: error.response?.data?.GlobalError,
            })
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.c-title {
  font-size: 48px;
  line-height: 1;
}
.c-subtext {
  font-size: 14px;
  font-weight: 300;
  color: #737373;
  padding: 0 10px;

  strong {
    font-weight: bold;
    color: #000;
  }
}
</style>
