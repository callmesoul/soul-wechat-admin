<template>
  <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="['1']"
          :defaultOpenKeys="['sub1']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <template v-for="route in routes">
            <template v-if="route.children">
              <a-sub-menu :key="route.name">
                <span slot="title"><a-icon :type="route.meta.icon" />{{route.meta.title}}</span>
                <a-menu-item v-for="rou in route.children" :key="rou.name" @click="toRoute(rou)">{{rou.meta.title}}</a-menu-item>
              </a-sub-menu>
            </template>
            <template v-else>
              <a-menu-item :key="route.name" @click="toRoute(route)">
                <a-icon :type="route.meta.icon" />
                <span class="nav-text">{{route.meta.title}}</span>
              </a-menu-item>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item >Home</a-breadcrumb-item>
          <template v-for="route in $route.matched" >
            <a-breadcrumb-item  v-if="!route.meta.hidden" :key="route.name">
              <template v-if="route.name === $route.name">{{route.meta.title}}</template>
              <template v-else><router-link :to="{name: route.name}">{{route.meta.title}}</router-link></template>
            </a-breadcrumb-item>
          </template>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>

<script>
import { Layout, Breadcrumb, Menu } from 'ant-design-vue'

export default {
  data () {
    return {
      routes: [] // manage路由菜单
    }
  },

  components: {
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Sider.name]: Layout.Sider,
    [Layout.Content.name]: Layout.Content,
    [Breadcrumb.name]: Breadcrumb,
    [Breadcrumb.Item.name]: Breadcrumb.Item,
    [Menu.name]: Menu,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Menu.Item.name]: Menu.Item
  },

  methods: {
    // 路由跳转
    toRoute (route) {
      this.$router.push({ name: route.name })
      console.log(this.$route)
    }
  },

  created () {
    console.log(this.$route)
    if (!this.$store.state.wechatId) {
      this.$router.push({ name: 'wechat' })
    }
    let routes = this.$router.options.routes
    let appRoutes = []
    let manageRoutes = []
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name === 'app') {
        appRoutes = routes[i].children
        break
      }
    }
    for (let i = 0; i < appRoutes.length; i++) {
      if (appRoutes[i].name === 'manage') {
        manageRoutes = appRoutes[i].children
      }
    }
    this.routes = manageRoutes
  }
}
</script>

<style lang="scss"></style>
