import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: () => {
        let token = localStorage.getItem('token')
        if (token && token !== '') {
          let wechatId = localStorage.getItem('wechatId')
          if (wechatId && wechatId !== '') {
            return { name: 'app' }
          } else {
            return { name: 'app' }
          }
        } else {
          return { name: 'login' }
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登陆' },
      component: () => import(/* webpackChunkName: "login" */ './views/login/Login.vue')
    },
    {
      path: '/app',
      name: 'app',
      component: () => import(/* webpackChunkName: "about" */ './views/app/App.vue'),
      redirect: '/app/wechat',
      meta: { hidden: true },
      children: [
        {
          path: 'wechat',
          name: 'wechat',
          meta: { title: '公众号', hidden: true },
          component: () => import(/* webpackChunkName: "about" */ './views/app/Wechat.vue')
        },
        {
          path: 'manage',
          name: 'manage',
          meta: { title: '公众号/小程序', hidden: true },
          component: () => import(/* webpackChunkName: "about" */ './views/app/manage/Manage.vue'),
          redirect: { name: 'dashbord' },
          children: [
            {
              path: 'dashboard',
              name: 'dashboard',
              meta: { title: '主面板', icon: 'project' },
              component: () => import(/* webpackChunkName: "about" */ './views/app/manage/DashBord.vue')
            },
            {
              path: 'test1',
              name: 'test1',
              meta: { title: 'test1', icon: 'project' },
              component: () => import(/* webpackChunkName: "about" */ './views/app/manage/test/Test1.vue')
            },
            {
              path: 'functions',
              name: 'functions',
              meta: { title: '功能', icon: 'appstore' },
              component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/Functions.vue'),
              children: [
                {
                  path: 'autoReplay',
                  name: 'autoReplay',
                  meta: { title: '自动回复' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/AutoReplay.vue')
                },
                {
                  path: 'customMenu',
                  name: 'customMenu',
                  meta: { title: '自定义菜单' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/CustomMenu.vue')
                },
                {
                  path: 'leaveMessage',
                  name: 'leaveMessage',
                  meta: { title: '留言管理' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/LeaveMessage.vue')
                },
                {
                  path: 'vote',
                  name: 'vote',
                  meta: { title: '投票管理' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/Vote.vue')
                },
                {
                  path: 'pageTemplate',
                  name: 'pageTemplate',
                  meta: { title: '页面模板' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/PageTemplate.vue')
                },
                {
                  path: 'praise',
                  name: 'praise',
                  meta: { title: '赞赏功能' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/Praise.vue')
                },
                {
                  path: 'original',
                  name: 'original',
                  meta: { title: '原创管理' },
                  component: () => import(/* webpackChunkName: "about" */ './views/app/manage/functions/Original.vue')
                }
              ]
            },
            {
              path: 'user',
              name: 'user',
              meta: { title: '用户管理', icon: 'team' },
              component: () => import(/* webpackChunkName: "about" */ './views/app/manage/User.vue')
            }
          ]
        }
      ]
    }
  ]
})
