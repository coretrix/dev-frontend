<template>
  <v-row class="fill-height d-flex flex-column justify-center align-center" no-gutters>
    <div>
      <div class="mb-8">
        <div class="mb-lg-0 text-center primary--text">
          <h1 class="c-title">
            Dev Panel
          </h1>
          <span class="c-subtext">
            powered by
            <span class="coretrix__logo--text">CoreTrix</span>
          </span>
        </div>
      </div>

      <v-card min-width="320px">
        <v-card-title class="justify-center p-6">
          <h2>Login</h2>
        </v-card-title>
        <v-divider class="my-2" />
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
              />
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
              />
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

    <div class="c-subtext mt-auto mr-auto mb-n9 ml-n4">
      {{ `v${$store.state.app.version}` }}
    </div>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'nuxt-property-decorator'
import { LoginData, LoginErrors } from '~/interface/login'

@Component({
  layout: 'login'
})

export default class LoginPage extends Vue {
  loginData: LoginData = {
    Username: '',
    Password: ''
  }

  formErrors: LoginErrors = {
    Username: '',
    Password: ''
  }

  valid:boolean = false

  @Ref('form') readonly form!: any
  async login () {
    this.form.resetValidation()
    await this.$axios
      .post('/dev/login/', this.loginData)
      .then((response) => {
        this.$auth.login(response.data)
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
            message: error.response?.data?.GlobalError
          })
        }
      })
  }
}
</script>

<style lang="scss" scoped>
.c-title {
  font-size: 48px;
  line-height: 1;
}
h2 {
  font-weight: normal;
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
