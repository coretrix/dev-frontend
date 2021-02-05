<template>
  <v-row class="fill-height d-flex justify-center align-center" no-gutters>
    <div>
      <v-card>
        <v-card-title class="justify-center">Login</v-card-title>
        <v-card-text>
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
                dense
                flat
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
                dense
                flat
                outlined
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-btn
                color="primary"
                :disabled="!valid"
                width="100%"
                @click="login"
              >
                Submit
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <div class="c-version mb-16 mb-lg-0 text-center">
        <span>Dev Panel powered by CoreTrix</span>
      </div>
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
.c-version {
  margin-top: 20px;
  font-size: 13px;
  font-weight: 300;
  color: #737373;
  padding: 0 10px;
}
</style>
