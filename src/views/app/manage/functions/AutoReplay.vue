<template>
  <div class="auto-replay">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="关键词回复" key="1">
        <div class="screen">
          <a-input-search
            placeholder="搜索关键词/规则"
            style="width: 200px"
            @search="onSearch"
          />
        </div>
        <a-table :columns="columns" :dataSource="data">
          <a slot="action">Delete</a>
          <p slot="expandedRowRender" slot-scope="record" style="margin: 0">{{record.description}}</p>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="收到消息回复" key="2" forceRender>收到消息回复</a-tab-pane>
      <a-tab-pane tab="被关注回复" key="3">被关注回复</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

import { Tabs, Input, Table } from 'ant-design-vue'
export default {
  name: 'autoReplay',
  data () {
    return {
      data: [
        { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
        { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
        { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' }
      ],
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Action', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  components: {
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane,
    [Input.Search.name]: Input.Search,
    [Table.name]: Table
  }
}
</script>

<style>

</style>
