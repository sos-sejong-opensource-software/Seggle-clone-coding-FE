<template>
  <div class="container">
    <header class="board-detail-header">
      <button class="btn" @click="goProposalList">
        <font-awesome-icon icon="angle-left" />
        목록
      </button>
    </header>

    <div class="table-div">
      <table class="table" :key="content">
        <tbody>
          <tr>
            <td><h5>제목</h5></td>
            <td class="title" colspan="3">{{ content.title }}</td>
          </tr>
          <tr>
            <td><h5>작성자</h5></td>
            <td>{{ content.created_user }}</td>
            <td><h5>작성일</h5></td>
            <td>{{ content.created_time }}</td>
          </tr>
          <tr>
            <td><h5>내용</h5></td>
            <td class="context" colspan="3">
              <pre>{{ content.context }}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-group">
      <button
        v-if="privilege.edit"
        class="btn"
        @click="goEditProposal(this.proposalID)"
      >
        편집
      </button>
      <button v-if="privilege.delete" class="btn" @click="deleteProposal">
        삭제
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')

export default {
  name: 'BoardDetail',
  data () {
    return {
      proposalID: this.$route.params.id,
      content: {},
      privilege: {
        edit: '',
        delete: this.checkDeletePrivilege
      }
    }
  },
  created () {
    this.getContent()
  },
  beforeUpdate () {
    this.setPrivilege()
    this.setCreatedTime()
  },
  methods: {
    async getContent () {
      try {
        const res = await api.getProposalDetail(this.proposalID)
        this.content = res.data
      } catch (err) {
        if (err.response.status === 404) {
          await Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: 'Board'
              })
            }
          })
        }
      }
    },
    setCreatedTime () {
      this.content.created_time = this.content.created_time.slice(0, 10)
    },
    setPrivilege () {
      this.privilege.edit =
        this.$store.state.userid === this.content.created_user
      this.privilege.delete =
        this.$store.state.userid === this.content.created_user ||
        this.$store.getters.isSuperAdmin
    },
    async deleteProposal () {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteProposal(this.proposalID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                this.goProposalList()
              }
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    goProposalList () {
      this.$router.push({ name: 'Board' })
    },
    goEditProposal (proposalID) {
      this.$router.push({
        name: 'BoardCreate',
        params: { mode: 'edit' },
        query: { id: proposalID }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 3rem 3rem;
  @media (max-width: 420px) {
    padding: 1rem 1rem;
  }
}

header {
  text-align: right;
}

pre {
  background: transparent;
  font-size: 16px;
  font-family: Consolas;
}

textarea {
  width: 100%;
  height: 200px;
}

.table-div {
  .table {
    min-width: 0px;
    text-align: left;
    white-space: normal;

    tbody {
      tr {
        &:nth-child(2) {
          td {
            @media (max-width: 300px) {
              padding: 0.4rem;
            }
          }
        }

        &:hover {
          background-color: transparent;
          cursor: default;
        }

        td {
          text-align: left;
          @media (max-width: 420px) {
            font-size: calc(0.55rem + 1.5vw);
          }

          h5 {
            text-align: center;
            font-weight: bold;
            @media (max-width: 420px) {
              font-size: calc(0.7rem + 1.5vw);
            }
          }

          .title {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }

        .context {
          height: 300px;
        }
      }
    }
  }
}

.button-group {
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}
.btn {
  @media (max-width: 767px) {
    margin-right: 0px;
    font-size: calc(0.5rem + 1vw);
  }
  margin-top: 30px;
  margin-right: 0px;
}
</style>
