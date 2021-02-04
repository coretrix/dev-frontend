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
                placeholder="Username"
                :rules="[$v.required()]"
                dense
                flat
                outlined
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                v-model="loginData.Password"
                placeholder="Password"
                :rules="[$v.required()]"
                type="password"
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
          console.log(response)
          this.$auth.login(response.data?.Result)
          this.$router.push('/')
        })
        .catch((error) => {
          console.error(error.response.data)
        })
    },
  },
}
</script>
