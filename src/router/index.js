import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import {
  requireAuth,
  requireAdminAuth,
  requireClassAuth,
  requireClassAdminAuth,
  requireCompetitionAdminAuth
} from './auth.js'

import Admin from '@/views/admin/Admin.vue'
import AdminAllProblems from '@/views/admin/AdminAllProblems.vue'
import AdminProblemDetail from '@/views/admin/AdminProblemDetail.vue'
import AdminAnnouncment from '@/views/admin/AdminAnnouncement.vue'
import AdminFaq from '@/views/admin/AdminFaq.vue'
import AdminUserManagement from '@/views/admin/AdminUserManagement.vue'
import AdminAllClasses from '@/views/admin/AdminAllClasses.vue'

import Class from '@/views/class/Class.vue'
import ClassAllProblem from '@/views/class/ClassAllProblem.vue'
import ClassStudentManage from '@/views/class/ClassStudentManage.vue'
import ClassExamManage from '@/views/class/ClassExamManage.vue'
import ClassContest from '@/views/class/ClassContest.vue'
import ClassContestProblemList from '@/views/class/ClassContestProblemList.vue'
import ClassContestProblemListEdit from '@/views/class/ClassContestProblemListEdit.vue'
import ClassList from '@/views/class/ClassList.vue'
import EditClassList from '@/views/class/EditClassList.vue'
import ClassProblem from '@/views/class/ClassProblem.vue'
import ClassContestProblem from '@/views/class/ClassContestProblem.vue'
import CreateClassProblem from '@/views/class/CreateClassProblem.vue'
import EditClassProblem from '@/views/class/EditClassProblem.vue'
import EditClassContestProblem from '@/views/class/EditClassContestProblem.vue'

import Login from '@/views/users/Login.vue'
import Register from '@/views/users/Register.vue'
import FindPassword from '@/views/users/FindPassword.vue'
import ResetPassword from '@/views/users/ResetPassword.vue'
import Resign from '@/views/users/Resign.vue'
import User from '@/views/users/User.vue'

import Home from '@/views/general/Home.vue'
import FAQ from '@/views/general/FAQ.vue'
import Announcement from '@/views/general/Announcement.vue'
import AnnouncementDetail from '@/views/general/AnnouncementDetail.vue'
import Board from '@/views/general/Board.vue'
import BoardDetail from '@/views/general/BoardDetail.vue'
import BoardCreate from '@/views/general/BoardCreate.vue'

import CompetitionList from '@/views/competition/CompetitionList.vue'
import Competition from '@/views/competition/Competition.vue'
import CreateCompetition from '@/views/competition/CreateCompetition.vue'
import EditCompetition from '@/views/competition/EditCompetition.vue'
import EditCompetitionList from '@/views/competition/EditCompetitionList.vue'

import PageNotFound from '@/views/PageNotFound'

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/users',
  name: 'User',
  component: User,
  meta: { auth: true }
},
{
  path: '/faqs',
  name: 'FAQ',
  component: FAQ
},
{
  path: '/announcements',
  name: 'Announcement',
  component: Announcement
},
{
  path: '/announcements/:id',
  name: 'AnnouncementDetail',
  component: AnnouncementDetail
},
{
  path: '/board',
  name: 'Board',
  component: Board
},
{
  path: '/board/:id',
  name: 'BoardDetail',
  component: BoardDetail
},
{
  path: '/board/:mode',
  name: 'BoardCreate',
  component: BoardCreate,
  meta: { auth: true }
},
{
  path: '/class/:classID',
  name: 'Class',
  beforeEnter: requireClassAuth(),
  component: Class,
  meta: { auth: true },
  children: [{
    path: 'all-problems',
    name: 'ClassAllProblem',
    component: ClassAllProblem,
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: ':problemID',
    name: 'ClassProblem',
    component: ClassProblem,
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: 'create',
    name: 'CreateClassProblem',
    component: CreateClassProblem,
    meta: { auth: true },
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: 'edit/:problemID',
    name: 'EditClassProblem',
    component: EditClassProblem,
    meta: { auth: true },
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: 'student-manage',
    name: 'ClassStudentManage',
    component: ClassStudentManage,
    meta: { auth: true },
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: 'exam-manage/:contestID',
    name: 'ClassExamManage',
    component: ClassExamManage,
    meta: { auth: true },
    beforeEnter: requireClassAdminAuth()
  },
  {
    path: 'class-contest',
    name: 'ClassContest',
    component: ClassContest,
    meta: { auth: true },
    children: [{
      path: ':contestID',
      name: 'ClassContestProblemList',
      component: ClassContestProblemList,
      meta: { auth: true }
    },
    {
      path: ':contestID/:contestProblemID',
      name: 'ClassContestProblem',
      component: ClassContestProblem,
      meta: { auth: true }
    },
    {
      path: ':contestID/edit-list',
      name: 'ClassContestProblemListEdit',
      component: ClassContestProblemListEdit,
      beforeEnter: requireClassAdminAuth()
    },
    {
      path: ':contestID/edit/:contestProblemID',
      name: 'EditClassContestProblem',
      component: EditClassContestProblem,
      beforeEnter: requireClassAdminAuth()
    }
    ]
  }
  ]
},
{
  path: '/admin',
  name: 'Admin',
  component: Admin,
  meta: { isSuperAdmin: true },
  beforeEnter: requireAuth(),
  children: [{
    path: 'all-problems',
    name: 'AdminAllProblems',
    component: AdminAllProblems,
    meta: { isSuperAdmin: true }
  },
  {
    path: 'all-problems/:problemID',
    name: 'AdminProblemDetail',
    component: AdminProblemDetail,
    meta: { isSuperAdmin: true }
  },
  {
    path: 'all-classes',
    name: 'AdminAllClasses',
    component: AdminAllClasses,
    meta: { isSuperAdmin: true }
  },
  {
    path: 'announcements',
    name: 'AdminAnnouncement',
    component: AdminAnnouncment,
    meta: { isSuperAdmin: true }
  },
  {
    path: 'faqs',
    name: 'AdminFaq',
    component: AdminFaq,
    meta: { isSuperAdmin: true }
  },
  {
    path: 'user-management',
    name: 'AdminUserManagement',
    component: AdminUserManagement,
    meta: { isSuperAdmin: true }
  }
  ]
},
{
  path: '/login',
  name: 'Login',
  component: Login,
  beforeEnter: (to, from, next) => {
    if (store.getters.isLogin) {
      return next('/')
    }
    return next()
  }
},
{
  path: '/register',
  name: 'Register',
  component: Register
},
{
  path: '/find-password',
  name: 'FindPassword',
  component: FindPassword
},
{
  path: '/reset-password',
  name: 'ResetPassword',
  component: ResetPassword
},
{
  path: '/resign',
  name: 'Resign',
  component: Resign
},

{
  path: '/competition',
  name: 'CompetitionList',
  component: CompetitionList
},
{
  path: '/competition/:competitionID',
  name: 'Competition',
  component: Competition
},
{
  path: '/competition/create',
  name: 'CreateCompetition',
  component: CreateCompetition,
  meta: { isAdmin: true },
  beforeEnter: requireAdminAuth()
},
{
  path: '/competition/:competitionID/edit',
  name: 'EditCompetition',
  component: EditCompetition,
  meta: { isAdmin: true },
  beforeEnter: requireCompetitionAdminAuth()
},
{
  path: '/competition/edit',
  name: 'EditCompetitionList',
  component: EditCompetitionList,
  meta: { isAdmin: true }
  // beforeEnter: requireCompetitionAdminAuth()
},

{
  path: '/class',
  name: 'ClassList',
  component: ClassList
},
{
  path: '/class/edit-class',
  name: 'EditClassList',
  component: EditClassList
},
{
  path: '/:pathMatch(.*)*',
  component: PageNotFound
}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
const Swal = require('sweetalert2')
router.beforeEach(async (to, from, next) => {
  if (store.state.accessToken === '' && store.state.refreshToken !== '') {
    await store.dispatch('refreshAccessToken')
  }
  if (store.state.accessToken !== '') {
    return next()
  }
  if (to.meta.auth && !store.getters.isLogin) {
    Swal.fire({
      title: '로그인이 필요합니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    }).then((result) => {
      if (result.isConfirmed) {
        next({ name: 'Login' })
      }
    })
    // alert('로그인이 필요합니다')
    // next({ name: 'Login' })
  } else if (to.meta.isAdmin && !store.getters.isAdmin) {
    Swal.fire({
      title: '잘못된 접근입니다.',
      icon: 'error',
      confirmButtonText: '확인'
    }).then((result) => {
      if (result.isConfirmed) {
        next({ name: 'NotFound' })
      }
    })
    // alert('잘못된 접근입니다')
    // next({ name: 'NotFound' })
  } else next()
})

export default router
