import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Console from './views/Console.vue'
import Article from './views/Article.vue'
import Resource from './views/Resource.vue'
import Team from './views/Team'
import Password from './views/Password'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'
import MessageBoard from './views/MessageBoard'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/console',
          name: 'console',
          component: Console
        },
        {
          path: '/article',
          name: 'article',
          component: Article
        },
        {
          path: '/resource',
          name: 'resource',
          component: Resource
        },
        {
          path: '/team',
          name: 'team',
          component: Team
        },
        {
          path: '/messageBoard',
          name: 'messageBoard',
          component: MessageBoard
        },
        {
          path: '/password',
          name: 'password',
          component: Password
        },
        {
          path: '/404',
          component: NotFound
        }
      ]
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = '/login'

  const url = to.path
  const user = sessionStorage.getItem('user')

  if (url === LOGINURL) {
    sessionStorage.removeItem('user')
  }

  // 判断是否登录
  if (!user && url !== LOGINURL) {
    next({ path: LOGINURL })
  } else {
    next()
  }
})

export default router
