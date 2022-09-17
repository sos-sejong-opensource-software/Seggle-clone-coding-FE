<template>
  <div class="container">
    <header>
      <h1 id="title">일반 대회</h1>
      <button class="btn" @click="editClassList">저장</button>
    </header>

    <div class="table-div">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">대회 제목</th>
            <th scope="col">조교 추가</th>
            <th scope="col">편집</th>
            <th scope="col">삭제</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="count === 0">
            <td colspan="5">등록된 대회가 없습니다.</td>
          </tr>
          <tr v-for="competition in competitionList"
              :key="competition">
            <td>
              {{ competition.problem.title }}
            </td>
            <td scope="row"
                v-if="competition.problem.created_user === this.$store.state.userid">
              <button
                class="edit-btn"
                @click="
                  showModal = true;
                  competition_id = competition.id;"
              >
                <font-awesome-icon icon="user-plus" />
              </button>
              <ModalCompetitionTA
                v-if="showModal"
                @close="showModal = false"
                :competition_id="competition_id"
              />
            </td>
            <td>
              <button
                class="edit-btn"
                @click="goEditCompetition(competition.id)"
              >
                <font-awesome-icon icon="pen" />
              </button>
            </td>
            <td>
              <button
                class="delete-btn"
                @click="deleteCompetition(competition.id)"
              >
                <font-awesome-icon icon="trash-can" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
import ModalCompetitionTA from '@/components/ModalCompetitionTA.vue'
const Swal = require('sweetalert2')

export default {
  name: 'EditCompetitionList',
  components: {
    ModalCompetitionTA
  },
  data () {
    return {
      competitionList: [],
      showModal: false,
      competition_id: -1
    }
  },
  mounted () {
    this.getGeneralList()
  },
  methods: {
    async getGeneralList () {
      try {
        this.competitionList = []
        const res = await api.getCompetitionList()
        for (const item of res.data) {
          this.competitionList.push(item)
        }
        this.competitionList.reverse()
      } catch (error) {
        console.log(error)
      }
    },
    goEditCompetition (competitionID) {
      this.$router.push({
        name: 'EditCompetition',
        params: {
          competitionID: competitionID
        }
      })
    },
    async deleteCompetition (competitionID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteCompetition(competitionID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                this.$router.go({
                  name: 'CompetitionList'
                })
              }
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 3rem 3rem;
  @media (max-width: 420px) {
    padding: 1rem 1rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: 3rem 0rem;
    @media (max-width: 420px) {
      display: block;
    }

    h1 {
      margin-bottom: 0;
    }

    .btn {
      width: 6rem;
      @media (max-width: 420px) {
        font-size: 14px;
      }
    }
  }
  .table {
    p {
      margin-bottom: 0;
      @media (max-width: 420px) {
        display: block;
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .table > :not(caption) > * > * {
    @media (max-width: 420px) {
      padding: 0.5rem 0.25rem;
    }
  }
}
</style>
