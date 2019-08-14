<template>
  <div class="wechat">
    <div class="wechat-list" v-if="wechats.length>0">
      <a-row gutter="30">
        <a-col :xl="4" v-for="(wechat) in wechats" :key="wechat.id" @click="chooseWechat(wechat)">
          <a-card hoverable style="width: 300px">
            <img
              :alt="wechat.name"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              slot="cover"
            />
            <template class="ant-card-actions" slot="actions">
              <a-icon type="edit" @click="editItem(wechat)" />
              <a-icon type="delete" @click="removeItem(wechat)" />
              <a-icon type="api" @click="openBindModal(wechat)" />
            </template>
            <a-card-meta :title="wechat.name" description="This is the description">
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div v-else>你还没绑定过公众号/小程序，请先添加</div>

    <!-- 添加按钮 -->
    <a-button
      class="add"
      type="primary"
      shape="circle"
      icon="plus"
      size="large"
      @click="addItem"
    />

    <!-- 添加弹窗 -->
    <a-modal :visible="visible" :title="modalTitle" @cancel="handleCancel" @ok="handleCreate">
      <a-form layout="vertical" :form="form">
        <!-- id -->
        <a-form-item label="id" style="display:none;">
          <a-input
            v-decorator="[
              'id',
            ]"
          />
        </a-form-item>
        <!-- 名称 -->
        <a-form-item label="名称">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请填写!' }],
              }
            ]"
          />
        </a-form-item>
        <!-- appId -->
        <a-form-item label="appId">
          <a-input
            v-decorator="[
              'appId',
              {
                rules: [{ required: true, message: '请填写appId!' }],
              }
            ]"
          />
        </a-form-item>
        <!-- appSecret -->
        <a-form-item label="appSecret">
          <a-input
            v-decorator="[
              'appSecret',
              {
                rules: [{ required: true, message: '请填写appSecret!' }],
              }
            ]"
          />
        </a-form-item>
        <!-- 类型 -->
        <a-form-item label="类型">
          <a-button-group
            v-decorator="[
              'type',
              {initialValue:1}
            ]"
          >
            <a-button type="primary">公众号</a-button>
            <a-button>小程序</a-button>
          </a-button-group>
        </a-form-item>
        <!-- 是否消息加密 -->
        <a-form-item label="消息加密">
          <a-switch
            v-decorator="[
              'encrypt',
              { valuePropName: 'checked', initialValue: false}
            ]"
          />
        </a-form-item>
        <!-- 加密字符串 -->
          <a-form-item label="加密字符串" v-show="form.getFieldValue('id')">
            <a-input disabled
              v-decorator="[
                'encodingAesKey'
              ]"
            />
          </a-form-item>
          <!-- token -->
          <a-form-item label="token" v-show="form.getFieldValue('id')">
            <a-input disabled
              v-decorator="[
                'token'
              ]"
            />
          </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加成功的弹窗 -->
    <a-modal :visible="bindModalVisible" title="检测微信公众号绑定状态" @cancel="bindModalVisible = false" @ok="checkBind" okText="检测是否绑定" :confirmLoading="confirmLoading">
      <div class="bing-wechat">
        <div class="tips">请登录微信公众平台,在开发->基本配置,启用服务器配置并修改成以下配置</div>
        <div class="item flex flex-align-center"><spna class="label">URL:</spna><span class="flex1">http://frontend-test.callmesoul.cn/wechats/check?wechatId={{wechat.id}}</span></div>
        <div class="item flex flex-align-center"><spna class="label">Token:</spna><span class="flex1">{{wechat.token}}</span></div>
        <div class="item flex flex-align-center"><spna class="label">EncodingAESKey:</spna><span class="flex1">{{wechat.encodingAesKey===''?'空白不用填':wechat.encodingAesKey}}</span></div>
        <div class="item flex flex-align-center"><spna class="label">消息加解密方式:</spna><span class="flex1">{{wechat.encrypt?'安全模式':'明文模式'}}</span></div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Card, Icon, Row, Col, Modal, Button, Switch } from 'ant-design-vue'
import { CreateWechatGql, WechatsGql, RemoveWechatGql, CheckBindStatusGql } from '@/graphql/wechat.gql'

export default {
  data () {
    return {
      visible: false,
      bindModalVisible: false,
      modalTitle: '添加公众号/小程序',
      form: this.$form.createForm(this),
      wechat: {},
      wechats: [],
      confirmLoading: false
    }
  },

  components: {
    [Card.name]: Card,
    [Card.Meta.name]: Card.Meta,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Modal.name]: Modal,
    [Button.Group.name]: Button.Group,
    [Switch.name]: Switch
  },

  apollo: {
    wechats: () => WechatsGql
  },

  methods: {
    handleCancel () {
      this.visible = false
    },

    handleCreate () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$apollo.mutate({
          mutation: CreateWechatGql,
          variables: values,
          update: (cache, { data: { createWechat } }) => {
            if (createWechat) {
              const data = cache.readQuery({ query: WechatsGql })
              data.wechats.splice(0, 0, createWechat)
              cache.writeQuery({
                query: WechatsGql,
                data
              })
              this.wechat = createWechat
              this.$message.success('创建成功')
              this.form.resetFields()
              this.visible = false
              this.wechat = createWechat
              this.bindModalVisible = true
            }
          }
        })
      })
    },

    // 编辑
    editItem (wechat) {
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(wechat)
      })
    },

    // 删除
    removeItem (wechat) {
      this.$confirm({
        title: `温馨提示`,
        content: `你确定要删除${wechat.name}?`,
        onOk: async () => {
          this.$apollo.mutate({
            mutation: RemoveWechatGql,
            variables: { id: wechat.id },
            update: (cache, { data: { removeWechat } }) => {
              if (removeWechat) {
                const data = cache.readQuery({
                  query: WechatsGql
                })
                data.wechats = data.wechats.filter((item) => {
                  if (item.id !== wechat.id) {
                    return item
                  }
                })
                cache.writeQuery({
                  query: WechatsGql,
                  data
                })
                this.$message.success('删除成功')
              }
            }
          })
        }
      })
    },

    // 打开绑定信息窗口
    openBindModal (wechat) {
      this.wechat = wechat
      this.bindModalVisible = true
    },

    // 添加
    addItem () {
      this.visible = true
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    // 检测是否绑定
    async checkBind () {
      this.confirmLoading = true
      let res = await this.$apollo.mutate({
        mutation: CheckBindStatusGql,
        variables: { wechatId: this.wechat.id }
      })
      if (res) {
        this.$message.success('绑定成功')
        this.bindModalVisible = false
      }
      this.confirmLoading = false
    },

    // 选择公众号
    chooseWechat (wechat) {
      this.$store.commit('SETWECHATID', { wechatId: wechat.id })
      this.$router.push({ name: 'dashboard' })
    }
  },

  created () {}
}
</script>

<style lang="scss" scoped src="./Wechat.scss"></style>
