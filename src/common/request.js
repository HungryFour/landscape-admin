import axios from 'axios'
import Router from '@/router'
import ElementUI from 'element-ui'

// config axios global settings
axios.defaults.timeout = 20000
axios.defaults.withCredentials = true

// add an intercepter for baas response format
axios.interceptors.response.use(response => {
  console.log('response: ', response)
  if (!response.data) {
    ElementUI.Message({
      message: '服务器连接失败',
      type: 'error'
    })
    throw new Error('服务器连接失败')
  } else if (response.data.code !== 0) {
    ElementUI.Message({
      message: response.data.msg || '未提供错误细节',
      type: 'error'
    })
    throw new Error(`${response.data.msg || '未提供错误细节'}`)
  } else {
    return response
  }
}, error => {
  console.log('error: ', error)
  if (error && error.response && error.response.status === 401) {
    throw new Error('session_timeout')
  }
  return Promise.reject(error)
})

axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('USER_TOKEN')
    if (token) {
      config.headers.AccessToken = token
    } else {
      Router.replace('/login')
    }

    if (config.method === 'get') {
      config.params = {
        user_id: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).user_id : '',
        ...config.params
      }
    } else {
      if (config.headers['Content-Type'] !== 'multipart/form-data') {
        config.data = {
          ...config.data,
          user_id: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).user_id : ''
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default class Api {
  constructor () {
    this.server = 'http://api.huazhangmedia.com/'
  }

  async uploadFile (uri, params) {
    var form = new FormData()
    for (var key in params) {
      form.append(key, params[key])
    }
    return await axios.post(this.server + uri, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async get (uri, params, opts = {}) {
    return axios.get(this.server + uri, { params: params }, opts)
  }

  async put (uri, params) {
    return axios.put(this.server + uri, this.purgeParam(params))
  }

  async patch (uri, params) {
    return axios.patch(this.server + uri, this.purgeParam(params))
  }

  async post (uri, params, opts = {}) {
    return axios.post(this.server + uri, this.purgeParam(params), opts)
  }

  purgeParam (args) {
    return args instanceof Object ? Object.entries(args).reduce((o, [k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string' || (v === null) || v) o[k] = this.purgeParam(v)
      return o
    }, args instanceof Array ? [] : {}) : args
  }
}
