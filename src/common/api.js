import Api from './request'

export default class App {
  constructor () {
    this.api = new Api()
  }

  async uploadFile (args) {
    return await this.api.uploadFile('admin/upload_file', args)
  }

  async login (args) {
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
}
