<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <form class="modal-container" @submit.prevent="submitForm">
          <div class="modal-header">
            <h5>목록 편집</h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close')"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <table>
                <thead>
                  <tr>
                    <th scope="col">제목</th>
                    <th scope="col">공개</th>
                    <th scope="col">편집</th>
                    <th scope="col">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(contest, i) in contestList" :key="contest">
                    <td class="contest-name">{{ contest.name }}</td>
                    <td>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          id="publicSwitch"
                          type="checkbox"
                          role="switch"
                          v-model="contest.visible"
                          @change="changePublic(contest.id)"
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        class="edit-btn"
                        @click="
                          showModal = true;
                          rowIndex = i;
                        "
                      >
                        <font-awesome-icon icon="pen" />
                      </button>
                      <ModalContestCreate
                        v-if="showModal"
                        @close="showModal = false"
                        :editContestInfo="contestList[rowIndex]"
                        :mode="'edit'"
                      />
                    </td>
                    <td>
                      <button
                        class="delete-btn"
                        @click="onRemove(contest.id, contest.name)"
                      >
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import ModalContestCreate from '@/components/ModalContestCreate.vue'
import api from '@/api/index.js'
const Swal = require('sweetalert2')
export default {
  name: 'ModalContestListEdit',
  components: {
    ModalContestCreate
  },
  data () {
    return {
      classID: this.$route.params.classID,
      contestList: [],
      showModal: false,
      rowIndex: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getContestList()
    },
    /* 대회 리스트 불러오기 */
    async getContestList () {
      try {
        const res = await api.getContestList(this.classID)
        this.contestList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    /* 해당 대회 삭제 */
    async onRemove (contestID, contestName) {
      await Swal.fire({
        title: `${contestName} 삭제하시겠습니까?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          api.deleteContest(this.classID, contestID)
          Swal.fire(
            {
              title: `${contestName} 삭제가 완료되었습니다.`,
              icon: 'success',
              confirmButtonText: '확인'
            }
          ).then((result) => {
            if (result.isConfirmed) {
              this.$router.go({
                name: 'ClassContest',
                params: this.classID
              })
              this.getContestList()
            }
          })
        }
      })
    },
    /* 해당 대회 공개 설정 바꾸기 */
    async changePublic (contestID) {
      try {
        await api.changeContestPublic(this.classID, contestID)
        Swal.fire({
          title: '공개 설정이 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$route.go(this.$router.currentRoute)
          }
        })
        this.$router.go()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-container {
  min-width: 600px;
  @media (max-width: 600px) {
    max-width: 300px;
    min-width: 300px;
  }
}
.row {
  overflow-x: auto;
  .contest-name {
    display: block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  td {
    padding: 0.5rem 1rem;
  }
}
.form-switch {
  padding-left: 6em;
  @media (max-width: 600px) {
    padding-left: 2.5em;
  }
}
</style>
