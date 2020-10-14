import Api from './request'

export default class App {
  constructor () {
    this.api = new Api()
  }

  async uploadFile (args) {
    return await this.api.uploadFile('admin/upload_file', args)
  }

  async login (args) {
    console.log('login:', args)
    return await this.api.post('admin/login', args)
  }

  async getArticles (args) {
    return await this.api.post('admin/articles', args)
  }

  async createArticle (args) {
    return await this.api.post('admin/create/article', args)
  }

  async updateArticle (args) {
    return await this.api.post('admin/update/article', args)
  }

  async removeArticle (id) {
    return await this.api.post('admin/remove/article', { id: id })
  }

  async getResources (args) {
    return await this.api.post('admin/resources', args)
  }

  async createResource (args) {
    return await this.api.post('admin/create/resource', args)
  }

  async updateResource (args) {
    return await this.api.post('admin/update/resource', args)
  }

  async removeResource (id) {
    return await this.api.post('admin/remove/resource', { id: id })
  }

  async getEmployees (args) {
    return await this.api.post('admin/employees', args)
  }

  async createEmployee (args) {
    return await this.api.post('admin/create/employee', args)
  }

  async updateEmployee (args) {
    return await this.api.post('admin/update/employee', args)
  }

  async removeEmployee (id) {
    return await this.api.post('admin/remove/employee', { id: id })
  }

  async updatePassword (args) {
    return await this.api.post('admin/change-password', args)
  }

  async getMessages (args) {
    return await this.api.post('admin/messages', args)
  }
}
