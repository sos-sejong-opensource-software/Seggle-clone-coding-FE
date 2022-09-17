import api from '@/api/index.js'
import store from '@/store'

const Swal = require('sweetalert2')

const requireAuth = () => (to, from, next) => {
  if (to.meta.isSuperAdmin && store.getters.isSuperAdmin) {
    return next()
  }
  Swal.fire(
    {
      title: '접근 권한이 없습니다.',
      icon: 'error',
      confirmButtonText: '확인'
    }
  ).then((result) => {
    if (result.isConfirmed) {
      next('/login')
    }
  })
}

const requireAdminAuth = () => (to, from, next) => {
  if (to.meta.isAdmin && store.getters.isAdmin) {
    return next()
  }
  Swal.fire(
    {
      title: '접근 권한이 없습니다.',
      icon: 'error',
      confirmButtonText: '확인'
    }
  ).then((result) => {
    if (result.isConfirmed) {
      next('/login')
    }
  })
}

const requireClassAuth = () => async (to, from, next) => {
  try {
    const res = await api.classUserPrivilege(to.params.classID)
    if (res.data.privilege >= 0) {
      return next()
    }
    Swal.fire(
      {
        title: '접근 권한이 없습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        next('/')
      }
    })
  } catch (err) {
    if (err.response.status === 404) {
      await Swal.fire({
        title: '잘못된 접근입니다.',
        icon: 'error',
        confirmButtonText: '확인'
      }).then((result) => {
        if (result.isConfirmed) {
          next('/class')
        }
      })
    }
  }
}

const requireClassAdminAuth = () => async (to, from, next) => {
  try {
    const res = await api.classUserPrivilege(to.params.classID)
    if (res.data.privilege >= 1) {
      return next()
    }
    Swal.fire(
      {
        title: '접근 권한이 없습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        next(`/class/${to.params.classID}/class-contest`)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const requireCompetitionAdminAuth = () => async (to, from, next) => {
  try {
    const res = await api.competitionUserPrivilege(to.params.competitionID)
    if (res.data.privilege >= 1) {
      return next()
    }
    Swal.fire(
      {
        title: '접근 권한이 없습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        next('/')
      }
    })
  } catch (err) {
    if (err.response.status === 404) {
      Swal.fire({
        title: '잘못된 접근입니다.',
        icon: 'error',
        confirmButtonText: '확인'
      }).then((result) => {
        if (result.isConfirmed) {
          next('/competition')
        }
      })
    }
    console.log(err)
  }
}

export {
  requireAuth,
  requireAdminAuth,
  requireClassAuth,
  requireClassAdminAuth,
  requireCompetitionAdminAuth
}
