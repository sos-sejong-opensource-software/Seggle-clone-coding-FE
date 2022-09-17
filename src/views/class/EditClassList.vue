<template>
  <div class="container">
    <header>
      <h1 id="title">수업 및 시험</h1>
      <button class="btn" @click="editClassList">저장</button>
    </header>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">
            <font-awesome-icon icon="check" />
          </th>
          <th scope="col">학기</th>
          <th scope="col">제목</th>
          <th scope="col">편집</th>
          <th scope="col">삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(classes, i) in classList" :key="i">
          <th scope="row">
            <input
              class="form-check-input"
              type="checkbox"
              :value="classes.id"
              v-model="checkList"
            />
          </th>
          <td>{{ classes.semester }}</td>
          <td class="class-name">{{ classes.name }}</td>
          <td>
            <button class="edit-btn"
                    @click="showModal = true;
                            rowIndex = i;">
              <font-awesome-icon icon="pen" />
            </button>
            <ModalClassList
              v-if="showModal"
              @close="showModal = false"
              mode="수업 편집"
              :classID="classList[rowIndex].id"
              :semester="classList[rowIndex].semester"
              :title="classList[rowIndex].name"
            />
          </td>
          <td>
            <button class="delete-btn"
                    @click="removeClass(classes.id)">
              <font-awesome-icon icon="trash-can" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/api/index.js'
import ModalClassList from '@/components/ModalClassList.vue'
const Swal = require('sweetalert2')
export default {
  name: 'EditClassList',
  components: {
    ModalClassList
  },
  data () {
    return {
      classList: [],
      checkList: [],
      showModal: false
    }
  },
  mounted () {
    this.getClassList()
  },
  methods: {
    async getClassList () {
      try {
        const res = await api.getClassList()
        this.classList = res.data
        this.alreadyChecked()
      } catch (err) {
        console.log(err)
      }
    },
    alreadyChecked () {
      for (const classes of this.classList) {
        if (classes.is_show) {
          this.checkList.push(classes.id)
        }
      }
    },
    async editClassList () {
      try {
        const data = []
        for (const checkedClass of this.checkList) {
          const item = {}
          item.class_id = checkedClass
          data.push(item)
        }
        await api.editClassList(data)
        Swal.fire({
          title: '변경사항이 저장되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({ name: 'ClassList' })
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async removeClass (classID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.removeClass(classID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                this.$router.push({ name: 'ClassList' })
              }
            })
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
