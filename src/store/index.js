import { createStore } from 'vuex'
import { getAccessFromCookie, getRefreshFromCookie, getUserFromCookie, saveAccessToCookie, saveRefreshToCookie, saveUserToCookie, deleteCookie } from '@/utils/cookies'
import { getUserType, getUserClasses, getUserCompetitions, saveUserInfo, deleteUserInfo } from '@/utils/jwt'
import api from '@/api/index.js'

export default createStore({
  state: {
    userid: getUserFromCookie() || '',
    accessToken: getAccessFromCookie() || '',
    refreshToken: getRefreshFromCookie() || '',
    usertype: getUserType() || '',
    classes: getUserClasses() || [],
    competitions: getUserCompetitions() || []
  },
  getters: {
    isLogin (state) {
      return !!state.accessToken && !!state.refreshToken
    },
    isAdmin (state) {
      return state.usertype === '1' || state.usertype === '2'
    },
    isSuperAdmin (state) {
      return state.usertype === '2'
    }
  },
  mutations: {
    setUserid (state, userid) {
      state.userid = userid
    },
    clearUserid (state) {
      state.userid = ''
    },
    setAccessToken (state, accessToken) {
      state.accessToken = accessToken
    },
    setRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
    },
    clearToken (state) {
      state.accessToken = ''
      state.refreshToken = ''
    },
    setUserType (state, usertype) {
      state.usertype = usertype
    },
    setClasses (state, classes) {
      state.classes = classes
    },
    setCompetitions (state, competitions) {
      state.competitions = competitions
    },
    clearUserInfo (state) {
      state.usertype = ''
      state.classes = ''
      state.competitions = ''
    }
  },
  actions: {
    async Login ({ commit, dispatch }, data) {
      try {
        const res = await api.loginUser(data)

        commit('setAccessToken', res.data.access)
        commit('setRefreshToken', res.data.refresh)
        commit('setUserid', data.username)

        saveAccessToCookie(res.data.access)
        saveRefreshToCookie(res.data.refresh)
        saveUserToCookie(data.username)

        dispatch('getUserInfo')
      } catch (error) {
        return error.response.status
      }
    },
    async getUserInfo ({ commit }) {
      try {
        const res = await api.getUserInfo(this.state.userid)
        const usertype = String(res.data.privilege)
        const classes = JSON.stringify(res.data.classes)
        const competitions = JSON.stringify(res.data.competition)

        commit('setUserType', usertype)
        commit('setClasses', classes)
        commit('setCompetitions', competitions)

        saveUserInfo(usertype, classes, competitions)
      } catch (err) {
        console.log('getUserInfo error: ', err)
      }
    },
    async Logout ({ state, commit }) {
      try {
        await api.logoutUser({
          refresh: state.refreshToken
        })
        commit('clearUserid')
        commit('clearToken')
        commit('clearUserInfo')

        deleteUserInfo()
        deleteCookie('til_user')
        deleteCookie('til_access')
        deleteCookie('til_refresh')
      } catch (err) {
        console.log('Logout error: ', err)
      }
    },
    async refreshAccessToken ({ commit }) {
      try {
        const res = await api.refreshAccessToken({
          refresh: this.state.refreshToken
        })
        commit('setAccessToken', res.data.access)
        saveAccessToCookie(res.data.access)
      } catch (err) {
        console.log('refreshAccessToekn error: ', err)
      }
    }
  },
  modules: {
  }
})
