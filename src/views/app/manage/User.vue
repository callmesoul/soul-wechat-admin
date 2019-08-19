<template>
  <div class="user" ref="user">
    <a-tabs class="user-tabs" defaultActiveKey="1" @change="callback" ref="tab">
      <a-tab-pane tab="已关注" key="1"  class="tab-pane" ref="tab-pane">
        <div class="screen">
          <a-input v-model="keyword" placeholder="用户昵称" style="width:200px;" class="pull-left" @keyup.native="keywordChange" />
          <div class="operate pull-right">
            <a-button type="primary" class="mr-15" @click="syncWechat">微信同步</a-button>
            <a-button type="primary" class="">新建标签</a-button>
          </div>
        </div>
        <div class="flex flex1 overflow-hidden" ref="user-table" >
        <a-table
          class="flex1"
          :rowKey="(row) => row.id"
          :columns="columns"
          :scroll="{ y: tableHeight }"
          :dataSource="getUsers.users"
          :pagination="getUsers.pagination"
        >
          <div class="user-info flex flex-align-center" slot="userInfo" slot-scope="user">
              <a-avatar shape="square" size="large" :src="user.headimgurl" />
              <div class="cont flex1">
                <div class="user-name">
                  <span v-if="user.remark === ''">{{user.nickname}}</span>
                  <span v-else>{{user.remark}}({{user.nickname}})</span>
                </div>
                <div class="user-tag-list">
                  <span v-if="user.tagid_list.length<=0">无标签</span>
                  <a-tag v-for="tag in user.tagid_list" :key="tag">{{tag |  tagNameFilter(getUsersTags)}}</a-tag>
                  <a-tag @click="openTagModal(user)">添加标签</a-tag>
                </div>
              </div>
          </div>
          <span slot="sex" slot-scope="sex">{{sex==='1'?'男':'女'}}</span>
          <span slot="city" slot-scope="user">
            {{user.country}} {{user.province}} {{user.city}}
          </span>
          <span slot="operate" slot-scope="user">
            <a-button @click="toggleUpdateRemarkModal(user)">修改备注</a-button>
          </span>
        </a-table>
        <div class="tag-list">
          <div class="tag-item tag-all" :class="{ 'active': tagActiveId === 0 }" @click="changeTag(0)">全部用户({{allCount}})</div>
          <div class="tag-item" :class="{ 'active': tagActiveId === tag.id }" v-for="tag in getUsersTags" :key="tag._id" @click="changeTag(tag.id)">{{tag.name}}({{tag.count}})</div>
        </div>
      </div>
      </a-tab-pane>
      <a-tab-pane tab="黑名单" key="2" forceRender>黑名单</a-tab-pane>
    </a-tabs>

    <!-- 修改备注弹窗 -->
    <a-modal
      :visible="visible "
      title='修改备注'
      @cancel="() => { visible = false}"
      @ok="updateUserRemark"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='userId' style="display:none;">
          <a-input
            v-decorator="[
              'userId',
              {
                rules: [{ required: true, message: '' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='备注'>
          <a-input
            v-decorator="[
              'remark',
              {
                rules: [{ required: true, message: '请填写备注' }],
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 选择标签弹窗 -->
    <a-modal
      :visible="isShowTagModal"
      title='选择标签'
      @cancel="() => isShowTagModal = false"
      @ok="updateUserTags"
    >
      <a-form layout='vertical' :form="tagForm">
        <a-form-item label='userId' style="display:none;">
          <a-input
            v-decorator="[
              'userId',
              {
                rules: [{ required: true, message: '' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='标签'>
          <a-select
            mode="multiple"
            placeholder="选择标签"
            style="width: 100%"
            @change="tagSelectChange"
            v-decorator="[
              'tagid_list',
              {
                initialValue:[],
                rules: [{ required: true, message: '', type: 'array' }],
              }
            ]"
          >
            <a-select-option v-for="tag in getUsersTags" :key="tag._id" :value="tag.id">
              {{tag.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { Table, Tabs, Avatar, Tag, Popover, Modal, Form, Select } from 'ant-design-vue'
import { GetUsersGql, UpdateUserTagGql } from '@/graphql/user.gql'
import { SyncWechatGQl } from '@/graphql/wechat.gql'
import { getUsersTagsGql, UpdateUserRemarkGql } from '@/graphql/user-tag.gql'
let data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}
export default {
  name: 'User',
  components: {
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane,
    [Table.name]: Table,
    [Avatar.name]: Avatar,
    [Tag.name]: Tag,
    [Popover.name]: Popover,
    [Modal.name]: Modal,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option
  },
  data () {
    return {
      getUsers: {},
      pagination: {
        page: 1,
        pageSize: 6
      },
      tableHeight: -1,
      columns: [
        {
          title: '用户',
          scopedSlots: { customRender: 'userInfo' }
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: 150,
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '所在城市',
          scopedSlots: { customRender: 'city' },
          width: 250
        },
        {
          title: '修改备注',
          width: 150,
          scopedSlots: { customRender: 'operate' }
        }
      ],
      loading: false,
      visible: false,
      form: this.$form.createForm(this),
      tagForm: this.$form.createForm(this),
      isShowTagModal: false,
      keyword: '',
      tagActiveId: 0
    }
  },
  filters: {
    tagNameFilter: (tagid, getUsersTags) => {
      for (let i = 0; i < getUsersTags.length; i++) {
        if (getUsersTags[i].id === tagid) {
          return getUsersTags[i].name
        }
      }
    }
  },
  apollo: {
    getUsersTags: ({
      query: getUsersTagsGql,
      variables: { wechatId: localStorage.getItem('wechatId') }
    }),
    getUsers: ({
      query: GetUsersGql,
      variables: { wechatId: localStorage.getItem('wechatId') }
    })
  },
  methods: {
    // 微信同步
    syncWechat () {
      this.$apollo.mutate({
        mutation: SyncWechatGQl,
        variables: { wechatId: this.$store.state.wechatId },
        update: (cache, { data: { syncWechat } }) => {
          if (syncWechat) {
            this.$message.success('同步成功')
          }
        }
      })
    },
    // 切换显示 更新用户备注的弹窗
    toggleUpdateRemarkModal (user) {
      this.visible = true
      this.$nextTick(() => {
        let vlaue = { userId: user.id, remark: user.remark === '' ? user.nickname : user.remark }
        this.form.setFieldsValue(vlaue)
      })
    },
    // 显示 选择标签弹框
    openTagModal (user) {
      this.isShowTagModal = true
      this.$nextTick(() => {
        let value = {
          userId: user.id,
          tagid_list: user.tagid_list
        }
        this.tagForm.setFieldsValue(value)
      })
    },
    // 更新用户备注
    updateUserRemark () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.$apollo.mutate({
          mutation: UpdateUserRemarkGql,
          variables: values,
          update: (cache, { data: { updateUserRemark } }) => {
            if (updateUserRemark) {
              let data = cache.readQuery({
                query: GetUsersGql,
                variables: { wechatId: this.$store.state.wechatId }
              })
              for (let i = 0; i < data.getUsers.users.length; i++) {
                if (data.getUsers.users[i].id === values.userId) {
                  data.getUsers.users[i].remark = values.remark
                  break
                }
              }
              cache.writeQuery({
                query: GetUsersGql,
                variables: { wechatId: this.$store.state.wechatId },
                data
              })
              this.form.resetFields()
              this.visible = false
              this.$message.success('更新成功')
            }
          }
        })
      })
    },
    // 更新用户标签
    updateUserTags () {
      this.tagForm.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.$apollo.mutate({
          mutation: UpdateUserTagGql,
          variables: values,
          update: (cache, { data: { updateUserTag } }) => {
            if (updateUserTag) {
              const data = cache.readQuery({
                query: GetUsersGql,
                variables: { wechatId: this.$store.state.wechatId }
              })
              for (let i = 0; i < data.getUsers.users.length; i++) {
                if (data.getUsers.users[i].id === values.userId) {
                  data.getUsers.users[i].tagid_list = values.tagid_list
                  break
                }
              }
              cache.writeQuery({
                query: GetUsersGql,
                variables: { wechatId: this.$store.state.wechatId },
                data
              })
              this.isShowTagModal = false
              this.$message.success('更新成功')
            }
          }
        })
      })
    },
    tagSelectChange (data) {
    },
    // 关键词搜索
    keywordChange () {
      let params = { wechatId: this.$store.state.wechatId }
      if (this.keyword !== '') {
        params.nickname = this.keyword
      }
      this.$apollo.queries.getUsers.setVariables(params)
      this.$apollo.queries.getUsers.refetch()
    },
    // 更改标签
    changeTag (tagId) {
      this.tagActiveId = tagId
      let params = { wechatId: this.$store.state.wechatId }
      if (this.keyword !== '') {
        params.nickname = this.keyword
      }
      if (tagId !== 0) {
        params.tagId = tagId
      }
      this.$apollo.queries.getUsers.setVariables(params)
      this.$apollo.queries.getUsers.refetch()
    }
  },
  updated () {
    console.log(this.$refs['user-table'].clientHeight)
    if (this.tableHeight === -1) {
      this.tableHeight = this.$refs['user-table'].clientHeight - 53 - 50
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped src="./User.scss"></style>
