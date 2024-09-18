import { createRouter, createWebHistory } from 'vue-router'
import ServiceView from '@/views/ServiceView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CashFlowView from '@/views/CashFlowView.vue'
import OrderView from '@/views/OrderView.vue'
import ReportView from '@/views/ReportView.vue'
import UserView from '@/views/UserView.vue'
import RoleView from '@/views/RoleView.vue'
import SupplierView from '@/views/SupplierView.vue'
import ExpenseView from '@/views/ExpenseView.vue'
import InputView from '@/views/InputView.vue'
import CustomerView from '@/views/CustomerView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth.js'
import checkIfTokenIsValid from '@/services/checkIfTokenIsValid.js'
import { useLoadingStore } from '@/stores/loading.js'
import BillsToPayView from '@/views/BillsToPayView.vue'
import StockMovementView from '@/views/StockMovementView.vue'
import StockView from '@/views/StockView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UserView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/roles',
      name: 'roles',
      component: RoleView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/suppliers',
      name: 'suppliers',
      component: SupplierView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/expenses',
      name: 'expenses',
      component: ExpenseView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/inputs',
      name: 'inputs',
      component: InputView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/services',
      name: 'services',
      component: ServiceView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/customers',
      name: 'customers',
      component: CustomerView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/stocks',
      name: 'stocks',
      component: StockView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/stock-movements',
      name: 'stock-movements',
      component: StockMovementView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/bills-to-pays',
      name: 'bills-to-pays',
      component: BillsToPayView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/cash-flows',
      name: 'cash-flows',
      component: CashFlowView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/orders',
      name: 'orders',
      component: OrderView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/reports',
      name: 'reports',
      component: ReportView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.loading = true
  const authStore = useAuthStore()
  const token = authStore.token
  const { requiresAuth } = to.meta
  let tokenIsValid = false

  if (token) {
    tokenIsValid = await checkIfTokenIsValid(token)
  }

  loadingStore.loading = false

  if (to.name === 'login' && tokenIsValid) {
    next({ name: 'dashboard' })
  } else if (requiresAuth && !tokenIsValid) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
