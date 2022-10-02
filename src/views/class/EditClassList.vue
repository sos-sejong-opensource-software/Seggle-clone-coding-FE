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
            <button
              class="edit-btn"
              @click="
                showModal = true;
                rowIndex = i;
              "
            >
              <font-awesome-icon icon="pen" />
            </button>
            <!-- ModalClassList component를 사용해주세요. -->
          </td>
          <td>
            <button class="delete-btn" @click="removeClass(classes.id)">
              <font-awesome-icon icon="trash-can" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import api from '@/api/index.js';
// import ModalClassList from '@/components/ModalClassList.vue';
const Swal = require('sweetalert2');
export default {
  name: 'EditClassList',
  components: {
    // component를 어떤 식으로 사용하는지 확인해주세요.
    // template에서 해당 컴포넌트를 사용하고 밑에 주석처리를 풀고 실행해주세요.
    // ModalClassList
  },
  data() {
    return {
      classList: [],
      checkList: [],
      showModal: false
    };
  },
  mounted() {
    this.getClassList();
  },
  methods: {
    // 필요한 함수들을 추가적으로 정의해서 사용해주세요.
    // 작성 후 어떤 동작을 하는 함수인지도 주석으로 달아주세요.
    // 밑에 지우지 않은 함수들도 꼭 확인은 해주세요!
    async editClassList() {
      try {
        // 동작상 필요한 내용을 추가적으로 작성해주세요.
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
            this.$router.push({name: 'ClassList'});
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async removeClass(classID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.removeClass(classID);
            Swal.fire({
              title: '삭제되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push({name: 'ClassList'});
              }
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
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
