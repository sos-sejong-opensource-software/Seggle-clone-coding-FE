<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <form class="modal-container" @submit.prevent="submitForm">
          <div class="modal-header">
            <h5>관리자 등록</h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close')"
            ></button>
          </div>

          <div class="modal-body">
            <form class="competition-TA-form">
              <textarea
                id="competition-TA"
                class="form-control mb-3 p-3"
                width="100%"
                rows="10"
                v-model="taList"
                placeholder="관리자를 등록하세요."
              ></textarea>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn" type="submit" @click="submitTAList">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')

export default {
  name: 'ModalCompetitionTA',
  props: {
    competition_id: {
      type: Number
    }
  },
  data () {
    return {
      taList: '',
      showModal: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCompetitionTAList()
    },
    /* 일반대회 관리자(TA) 리스트 불러오기 */
    async getCompetitionTAList () {
      try {
        const res = await api.getCompetitionUserList(this.competition_id)
        this.taList = ''
        for (const user of res.data) {
          if (this.isCompetitionTA(user.privilege)) {
            this.taList += user.username + '\n'
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    isCompetitionTA (Privilege) {
      return (Privilege === 1)
    },
    async submitTAList () {
      const data = []
      const tmp = this.taList.split('\n')
      for (const ta of tmp) {
        if (ta !== '') {
          data.push({ username: ta })
        }
      }
      const res = await api.submitCompetitionTAList(this.competition_id, data)
      const msg = `존재하지 않는 아이디: ${res.data.does_not_exist}`
      const msg2 = `이미 존재하는 아이디 : ${res.data.is_existed}`
      if (res.data.success === undefined) {
        Swal.fire(
          {
            title: '관리자 등록이 완료되었습니다.',
            html: `${msg} <br> ${msg2}`,
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getCompetitionTAList()
          }
        })
      } else {
        Swal.fire(
          {
            title: '관리자 등록이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getCompetitionTAList()
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-mask {
  background-color: rgba(0, 0, 0, 0.1);
}
.modal-container {
  @media (max-width: 383px) {
    width: 100%;
  }
  @media (min-width: 384px) {
    width: 70%;
  }
  @media (min-width: 768px) {
    width: 400px;
  }
}
</style>
