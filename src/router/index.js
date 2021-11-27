import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login'
const Login = () => import('@/components/Login')

const Consult = () => import('@/components/Consult')

const Introduce = () => import('@/components/Introduce')

const Repair = () => import('@/components/Repair')

// import Home from '@/components/Home'
const Home = () => import('@/components/Home')

// import Welcome from '@/components/Welcome'
const Welcome = () => import('@/components/Welcome')

// import Users from '@/components/user/Users'
const Users = () => import('@/components/user/Users')

// import Rights from '@/components/power/Rights'
const Rights = () => import('@/components/power/Rights')

// import Roles from '@/components/power/Roles'
const Roles = () => import('@/components/power/Roles')

// import Cate from '@/components/goods/Cate'
const Cate = () => import('@/components/goods/Cate')

// import Params from '@/components/goods/Params'
const Params = () => import('@/components/goods/Params')

// import List from '@/components/goods/List'
const List = () => import('@/components/goods/List')

// import Add from '@/components/goods/Add'
const Add = () => import('@/components/goods/Add')

// import Order from '@/components/order/Order'
const Order = () => import('@/components/order/Order')

// import Report from '@/components/report/Report'
const Report = () => import('@/components/report/Report')


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/categories',
        component: Cate,
      },
      {
        path: '/params',
        component: Params,
      },
      {
        path: '/goods',
        component: List,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Order,
      },
      {
        path: '/reports',
        component: Report,
      },
      {
        path: '/consult',
        component: Consult
      },
      {
        path: '/introduce',
        component: Introduce
      }, {
        path: '/repair',
        component: Repair
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载导航守卫
router.beforeEach((to, form, next) => {
  if (to.path === "/login") return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router