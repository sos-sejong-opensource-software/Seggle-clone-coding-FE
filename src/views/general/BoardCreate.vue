<template>
  <div class="container">

    <header class="board-create-header">
      <h1 id="title">{{ title }}</h1>
      <button class="btn"
              @click="goBoardList">
        <font-awesome-icon icon="angle-left" />
        목록
      </button>
    </header>

    <main class="board-create-content">
      <div class="form-group">
        <label for="proposalTitle">제목</label>
        <input
          type="text"
          class="form-control"
          id="proposalTitle"
          v-model="proposal.title"
          placeholder="글 제목을 입력해주세요."
        />
      </div>

      <div class="form-group">
        <label for="proposalContext">본문</label>
        <textarea
          rows="10"
          class="form-control"
          id="proposalContext"
          v-model="proposal.context"
          placeholder="내용을 입력해주세요."
        />
      </div>
    </main>

    <button
      class="btn"
      id="proposal-submit-btn"
      @click="submitProposal"
    >등록
    </button>
  </div>
</template>
<script>
import api from '@/api/index.js'
export default {
  name: 'BoardCreate',
  data () {
    return {
      title: '',
      mode: this.$route.params.mode,
      proposal: {
        id: this.$route.query.id,
        title: '',
        context: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    /*
      위 <template></template>, data, mounted 등을 참고하여 필요한 methods를 작성해주세요!

      예상 시나리오
      1. 글을 등록하거나 수정할 수 있다
      2. 글을 수정할 경우, 기존의 글 내용을 가져온 후 수정한다.
      3. 글 등록 또는 수정이 완료되면 목록 페이지로 이동한다.
    */
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
  display: flex;
  justify-content: space-between;
  padding: 2rem 0rem;
  @media (max-width: 420px) {
    padding: 1rem 0rem;
  }
}

.btn {
  @media (max-width: 420px) {
    font-size: calc(0.5rem + 1.5vw);
  }
}

.form-group {
  text-align: left;

  label {
    font-weight: bold;
    font-size: 20px;
    padding: 10px 0px;
  }

  .form-control {
    resize: none;
    margin-bottom: 10px;
    @media (max-width: 420px) {
      font-size: calc(0.6rem + 1.5vw);
    }
  }
}

#proposal-submit-btn {
  float: right
}
</style>
