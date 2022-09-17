<template>
<notifications group="message"
                 position="top center"
                 class="noti"
                 animation-name="v-fade-left"
                 :speed="50"
                 :width="300"
                 :max="3"
                 :ignoreDuplicates="true"/>
<div class="container">
  <h1 id="title">비밀번호 찾기</h1>
  <form id="email-form"
        :class="{ 'was-validated': validated }"
        @submit.prevent="submitEmailForm">
    <div class="email-form">
      <p class="email-input-label">가입한 이메일 주소를 입력해주세요.</p>

      <div class="email-input">
        <input v-model="formFindPassword.useremail"
              type="email"
              id="email"
              class="form-control"
              :class="{'is-invalid': invalid.email }"
              placeholder="이메일"
              required>
        <button class="btn"
                id="email-btn"
                type="submit"
        >메일전송</button>
      </div>

      <div id="email-invalid-feedback"
           class="invalid-feedback">
        {{ this.feedback.email }}
      </div>
    </div>
  </form>

  <form id="token-form"
        @submit.prevent="submitToken">
    <div class="token-form">
      <p class="token-input-label">이메일로 전송된 인증코드를 입력해주세요.</p>
      <div class="token-input">
        <input v-model="formFindPassword.token"
              type="text"
              id="token"
              class="form-control"
              :class="{'is-invalid': invalid.token }"
              placeholder="인증코드"
              required>
        <button class="btn"
                id="token-btn"
                type="submit"
        >확인</button>
      </div>
      <div class="invalid-feedback">
        {{ this.feedback.token }}
      </div>
    </div>
  </form>

  <form id="reset-password-form" class="row"
        :key="formResetPassword"
        :class="{ 'was-validated': validated }"
        @submit.prevent="handleResetPassword" novalidate>
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
            @blur="checkNewPasswordAgain"
            @focus="invalid.newPasswordAgain = false"
            required>
      <div class="invalid-feedback">
        {{ this.feedback.newPasswordAgain }}
      </div>
    </div>
    <button class="btn btn-change" type="submit">비밀번호변경</button>
  </form>
</div>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')

export default {
  name: 'FindPassword',
  data () {
    return {
      formFindPassword: {
        useremail: '',
        token: ''
      },
      formResetPassword: {
        newPassword: '',
        newPasswordAgain: ''
      },
      validated: false,
      invalid: {
        email: false,
        token: false,
        newPassword: false,
        newPasswordAgain: false
      },
      feedback: {
        email: '이메일을 입력하세요',
        newPassword: '새로운 비밀번호를 입력하세요',
        newPasswordAgain: '새로운 비밀번호를 입력하세요'
      },
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
      }
    }
  },
  methods: {
    hideForm (formID) {
      const form = document.getElementById(formID)
      form.style.display = 'none'
    },
    showForm (formID) {
      const form = document.getElementById(formID)
      form.style.display = 'block'
    },
    changeButtonDisabled () {
      const emailButton = document.getElementById('email-btn')
      emailButton.innerText = '전송 완료'
      emailButton.classList.add('disabled')
    },
    async submitEmailForm () {
      try {
        const data = {
          email: this.formFindPassword.useremail
        }
        await api.applyResetPassword(data)
        Swal.fire(
          {
            title: '이메일을 전송하였습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.changeButtonDisabled()
            this.showForm('token-form')
          }
        })
      } catch (err) {
        console.log(err)
        this.feedback.email = err.response.data.error
        this.invalid.email = true
        this.showForm('email-invalid-feedback')
      }
    },
    async submitToken () {
      try {
        const data = {
          token: this.formFindPassword.token
        }
        await api.validateToken(data)
        Swal.fire(
          {
            title: '인증코드가 확인되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.hideForm('email-form')
            this.hideForm('token-form')
            this.showForm('reset-password-form')
          }
        })
      } catch (err) {
        if (err.response.status === 400) {
          this.$notify({
            group: 'message',
            title: `${err.response.data.error}`,
            type: 'error'
          })
        }
      }
    },
    checkNewPasswordAgain () {
      if (this.formResetPassword.newPassword !== this.formResetPassword.newPasswordAgain) {
        this.feedback.newPasswordAgain = '비밀번호가 일치하지 않습니다.'
        this.invalid.newPasswordAgain = true
      }
    },
    checkPasswordFormValid () {
      if (Object.values(this.formResetPassword).includes('') || Object.values(this.invalid).includes(true)) {
        return false
      } else {
        return true
      }
    },
    handleResetPassword () {
      if (this.checkPasswordFormValid()) {
        this.submitPasswordForm()
      } else {
        this.validated = true
      }
    },
    async submitPasswordForm () {
      try {
        const data = {
          token: this.formFindPassword.token,
          password1: this.formResetPassword.newPassword,
          password2: this.formResetPassword.newPasswordAgain
        }
        await api.resetPasswordWithToken(data)
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
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
    padding: 10rem 3rem;
    max-width: 500px;

  h1 {
    padding: 1rem 0rem;
  }

  form {
    font-size: 1rem;

    .form-control {
      padding: 1rem 1rem;
    }

    label {
      float: left;
      padding: 1rem 0rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      color: white;
      font-size: 1rem;
      font-weight: 600;
    }
    .btn-change {
      margin-top: 30px;
    }
  }

  #token-form,
  #reset-password-form {
    display: none;
  }

  .email-input-label,
  .token-input-label {
    margin-top: 10px;
    text-align: left;
  }

  .email-input,
  .token-input {
    display: flex;
    position: relative;
    align-items: center;
  }

  #email-btn,
  #token-btn {
    position: absolute;
    right: 10px;
  }
}
.noti {
  padding-top: 10%;
}
</style>
