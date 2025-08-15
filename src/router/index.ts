import {
  createRouter,
  createWebHistory
} from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import CreateView from '@/views/CreateView.vue'
import EditView from '@/views/EditView.vue'
import SupportView from '@/views/SupportView.vue'
import ManageView from '@/views/ManageView.vue'
import { getCurrentUser } from 'vuefire'
import { useRegimentStore } from '@/stores/regiment.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView,
      meta: { requiresAuth: true },
    },
    {
      path: '/manage',
      name: 'manage',
      component: ManageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/support',
      name: 'support',
      component: SupportView,
      meta: { requiresAuth: false },
    },
    {
      path: '/support/confirm',
      name: 'confirm',
      component: () => import('@/views/SupportConfirmView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/support/error',
      name: 'error',
      component: import('@/views/SupportErrorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/join/:clantag',
      name: 'error',
      component: () => import('@/views/JoinView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = await getCurrentUser()

  if (requiresAuth && !currentUser) {
    next({ name: 'index' })
  } else {
    if (to.name === 'edit') {
      const regimentStore = useRegimentStore();
      regimentStore.userRegiment = await regimentStore.getUserRegiment()
    }
    next()
  }
})

export default router
