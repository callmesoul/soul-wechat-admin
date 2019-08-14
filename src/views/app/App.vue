<template>
  <a-layout id="app">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :selectedKeys="currentKey"
        :style="{ lineHeight: '64px' }"
        v-if="$route.name !== 'login'"
      >
        <a-menu-item key="1">公众号/小程序</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout>
        <router-view>Content</router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { Layout, Breadcrumb, Menu } from 'ant-design-vue'

export default {
  data () {
    return {
      currentKey: ''
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

  watch: {
    '$route.name' () {
      if (this.$route.name === 'wechat') {
        this.currentKey = '1'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app .logo {
  width: 120px;
  height: 31px;
  background: rgba(255,255,255,.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
