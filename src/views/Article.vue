<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="articles" style="width: 100%" v-loading="tableLoading">
      <el-table-column sortable prop="date" label="发表日期" width="180"></el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="content" :show-overflow-tooltip="true" label="内容" min-width="180"></el-table-column>
      <el-table-column prop="pic" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.pic"
            :preview-src-list="[scope.row.pic]"
            fit="contain">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="800px" :visible.sync="editFormVisible" @close="resetForm('infoForm')">
      <el-form :model="edit_article" ref="infoForm" label-width="100px">
        <el-form-item label="发表日期" prop="date" :rules="[ {required: true, message: '请选择日期', trigger: 'blur'}]">
          <el-date-picker
            v-model="edit_article.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题" prop="title" :rules="[ {required: true, message: '请填写标题', trigger: 'blur'}]">
          <el-input v-model="edit_article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[ {required: true, message: '请填写内容', trigger: 'blur'}]">
          <el-input type="textarea" v-model="edit_article.content"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="pic" :rules="[ {required: true, message: '请选择图片', trigger: 'blur'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            accept="image/jpeg,image/png,image/gif,image/jpg"
            :http-request="uploadImageFile"
            name="index_pic"
            :show-file-list="false">
            <img v-if="edit_article.pic" :src="edit_article.pic" class="avatar">
            <div class="avatar-uploader-icon" v-else>点击上传</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('infoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        articles: [],
        article: {
          id: '',
          date: '',
          content: '',
          title: '',
          author: '',
          pic: ''
        },
        edit_article: {},
        editFormVisible: false,
        dialogTitle: '',
        tableLoading: false
      }
    },
    mounted () {
      this.getArticles()
    },
    methods: {
      getArticles () {
        this.tableLoading = true
        const param = {}
        this.$api.getArticles(param).then((res) => {
          this.tableLoading = false
          this.articles = res.data.data
        }).catch((err) => {
          this.tableLoading = false
          console.error(err)
        })
      },
      handleEdit (index, row) {
        this.dialogTitle = '编辑'
        this.edit_article = Object.assign({}, row)
        this.editFormVisible = true
      },
      submitUser (formName) {
        // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '提交中。。。',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            if (this.edit_article.id) {
              this.$api.updateArticle(this.edit_article).then(res => {
                loading.close()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getArticles()
              }).catch(() => {
                loading.close()
              })
            } else {
              this.$api.createArticle(this.edit_article).then(res => {
                loading.close()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getArticles()
              }).catch(() => {
                loading.close()
              })
            }
          } else {
            return false
          }
        })
      },
      handleDelete (index, row) {
        this.$confirm(`确定删除 【${row.title}】 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeArticle(row.id).then(res => {
            this.articles.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败，请重新尝试'
            })
          })
        }).catch(() => {
          console.log('取消删除')
        })
      },
      resetForm (formName) {
        this.$refs[formName].clearValidate()
      },
      handleAdd () {
        this.dialogTitle = '新增'
        this.edit_article = JSON.parse(JSON.stringify(this.article))
        console.log('add _ article:', this.edit_article)
        this.editFormVisible = true
      },
      uploadImageFile (files) {
        console.log('files:', files.file)
        this.$api.uploadFile({
          file: files.file
        }).then(res => {
          this.edit_article.pic = 'http://api.huazhangmedia.com/image/' + res.data.data.resume_name
          this.$message({ message: '上传成功', type: 'success' })
        })
      }
    }
  }
</script>

<style>
  .container {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .tool-box {
    padding: 10px 10px;
    border-bottom: 1px solid #eee;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    display: flex;
    justify-content: center;
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

</style>
