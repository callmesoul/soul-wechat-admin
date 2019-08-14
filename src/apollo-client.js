import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'
import { message } from 'ant-design-vue'
import router from '@/router'

const getHeaders = () => {
  const headers = {}
  const token = window.localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  fetch,
  headers: getHeaders()
})

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token') || null
  operation.setContext({
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    let _message = graphQLErrors[0].message
    if (typeof (_message) === 'string') {
      message.error(_message)
    } else {
      if (_message.statusCode && _message.statusCode === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('wechatId')
        router.push({ name: 'login' })
      } else {
        if (_message) {

        }
      }
    }
  }
  if (networkError) {
    message.error('网络有问题，请稍后再试')
  }
  forward()
})

export const client = new ApolloClient({
  link: from([authMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: true
  })
})
