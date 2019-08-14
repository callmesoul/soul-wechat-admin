<template>
  <div class="login flex flex-align-center">
    <div class="login-warp">
      <a-card title="登录">
        <a href="#" slot="extra">注册</a>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item
            :validate-status="userNameError() ? 'error' : ''"
            :help="userNameError() || ''"
          >
            <a-input
              v-decorator="[
          'email',
          {rules: [
            { required: true, message: 'Please input your email!' },
            { pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g, message: '邮箱格式不正确' }
          ]}
        ]"
              placeholder
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item
            :validate-status="passwordError() ? 'error' : ''"
            :help="passwordError() || ''"
          >
            <a-input
              v-decorator="[
          'password',
          {rules: [{ required: true, message: 'Please input your Password!' }]}
        ]"
              type="password"
              placeholder="password"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="hasErrorsFun(form.getFieldsError())"
            >Log in</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script>
import { Card, Form } from 'ant-design-vue'
import { AdminLoginGql } from '@/graphql/adminLogin.gql'
export default {
  data () {
    return {
      hasErrors: [],
      form: this.$form.createForm(this)
    }
  },

  components: {
    [Card.name]: Card,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item
  },

  mounted () {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields()
    })
  },
  methods: {
    hasErrorsFun (fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field])
    },

    // Only show error after a field is touched.
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('email') && getFieldError('email')
    },
    // Only show error after a field is touched.
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let res = await this.$apollo.mutate({
            // 查询语句
            mutation: AdminLoginGql,
            // 参数
            variables: values
            // 用结果更新缓存
            // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          })
          if (res && res.data) {
            localStorage.setItem('token', res.data.adminLogin.token)
            this.$message.success('登陆成功')
            this.$router.push('/')
          }
        }
      })
    }
  },
  created () {}
}
</script>
<style lang="scss" scoped src="./Login.scss"></style>
