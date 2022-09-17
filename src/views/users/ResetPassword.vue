<template>
<div class="container">
  <h1 id="title">비밀번호 재설정</h1>
  <form id="reset-password-form" class="row"
        :key="formResetPassword"
        :class="{ 'was-validated': validated }"
        @submit.prevent="handleResetPassword" novalidate>
    <!--현재 비밀번호-->
    <div class="current-password-form">
      <label for="current-password">현재 비밀번호</label>
      <input v-model="formResetPassword.currentPassword"
            type="password"
            id="current-password"
            class="form-control"
            :class="{'is-invalid': invalid.currentPassword }"
            @focus="invalid.currentPassword = false"
            required>
      <div class="invalid-feedback">
        {{ this.feedback.currentPassword }}
      </div>
    </div>
    <!--새로운 비밀번호-->
    <div class="new-password-form">
      <label for="new-password">새로운 비밀번호</label>
      <input v-model="formResetPassword.newPassword"
            type="password"
            id="new-password"
            class="form-control"
            required>
      <div class="invalid-feedback">
        {{ this.feedback.newPassword }}
      </div>
    </div>
    <!--새로운 비밀번호 확인-->
    <div class="new-password-again-form">
      <label for="new-password-again">새로운 비밀번호 확인</label>
      <input v-model="formResetPassword.newPasswordAgain"
            type="password"
            id="new-password-again"
            class="form-control"
            :class="{'is-invalid': invalid.newPasswordAgain }"
            @blur="checkNewPasswordAgain" @focus="invalid.newPasswordAgain = false"
            required>
      <div class="invalid-feedback">
        {{ this.feedback.newPasswordAgain }}
      </div>
    </div>
    <button class="btn" type="submit">비밀번호변경</button>
  </form>
</div>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')
export default {
  name: 'ResetPassword',
  data () {
    return {
      userID: this.$store.state.userid,
      formResetPassword: {
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      feedback: {
        currentPassword: '현재 비밀번호를 입력하세요',
        newPassword: '새로운 비밀번호를 입력하세요',
        newPasswordAgain: '새로운 비밀번호를 입력하세요'
      },
      validated: false,
      invalid: {
        currentPassword: false,
        newPassword: false,
        newPasswordAgain: false
      }
    }
  },
  methods: {
    async submitForm () {
      try {
        const data = {
          current_password: this.formResetPassword.currentPassword,
          new_password: this.formResetPassword.newPassword,
          new_password2: this.formResetPassword.newPasswordAgain
        }
        await api.resetPasswordWithID(this.userID, data)

        Swal.fire(
          {
            title: '비밀번호가 변경되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.$router.push('/')
          }
        })
      } catch (err) {
        this.invalid.currentPassword = true
        this.feedback.currentPassword = '현재 비밀번호가 일치하지 않습니다.'
      }
    },
    checkNewPasswordAgain () {
      if (this.formResetPassword.newPassword !== this.formResetPassword.newPasswordAgain) {
        this.feedback.newPasswordAgain = '비밀번호가 일치하지 않습니다.'
        this.invalid.newPasswordAgain = true
      }
    },
    checkFormValid () {
      if (Object.values(this.formResetPassword).includes('') || Object.values(this.invalid).includes(true)) {
        return false
      } else {
        return true
      }
    },
    handleResetPassword () {
      if (this.checkFormValid()) {
        this.submitForm()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
    padding: 2rem 3rem;
    max-width: 600px;
  h1 {
    padding: 3rem 0rem;
  }

  form {
    font-size: 1rem;
    label {
      float: left;
      padding: 1rem 0rem;
    }
    .form-control {
      padding: 0.8rem 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      margin-top: 2rem;
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }
}
</style>
