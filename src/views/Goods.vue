<template>
  <div class="article-box">

    <div style="display: flex; justify-content: space-between; width: 100%">
      <el-form ref="form" :inline="true" label-position="left" size="mini">
        <el-form-item label="系列名称:">
          <el-select clearable filterable placeholder="请选择" v-model="activity_select_condition">
            <el-option
              v-for="item in activity_selects"
              :key="item.id"
              :label="item.title"
              :value="item.title"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上市状态:">
          <el-select clearable filterable placeholder="请选择" v-model="activity_status_selects_condition">
            <el-option
              v-for="item in activity_status_selects"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="table_data">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button size="mini" style="width: 100px; height: 30px" type="primary" @click="add_new">发送所选订单</el-button>
    </div>

    <el-table
      :data="articles"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="title"
        label="系列名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="imageurl"
        label="系列图片"
        width="130">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="contain">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="280">
      </el-table-column>
      <el-table-column
        sortable
        prop="date"
        label="上市日期"
        width="280">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.status ? '已发布' : '未发布' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    <el-dialog title="编辑" :visible.sync="articleFormVisible" top="10vh" @close="resetForm('articleForm')">
      <el-form :model="article" ref="articleForm" :rules="rules">
        <el-form-item label="标题" prop="title" label-width="50px">
          <el-input v-model="article.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" label-width="50px">
          <el-input v-model="article.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" label-width="50px">
          <el-date-picker
            v-model="article.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" label-width="50px">
          <el-switch v-model="article.status" active-color="#13ce66"
                     inactive-color="#ff4949"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item>
          <quill-editor ref="TextEditor"
                        v-model="article.content"
                        :options="editorOption">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="articleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editArticle('articleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 引入富文本编辑器所需样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  export default {
    data () {
      return {
        articles: [],
        article: {
          id: '',
          date: '',
          title: '',
          author: '',
          content: '',
          status: 0
        },
        articleFormVisible: false,
        rowIndex: 9999,
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', 'link'],
              ['image', 'clean']
            ]
          },
          placeholder: '请输入文章内容...',
          theme: 'snow'
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      quillEditor
    },
    mounted () {
      this.getArticles()
    },
    methods: {
      getArticles () {
        this.loading = true
        this.$http('/api/articles').then((res) => {
          this.articles = res.data
        }).catch((err) => {
          console.error(err)
        })
      },
      handleEdit (index, row) {
        this.article = Object.assign({}, row)
        this.articleFormVisible = true
        this.rowIndex = index
      },
      editArticle (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.articles.splice(this.rowIndex, 1, this.article)
            this.articleFormVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        })
      },
      handleDelete (index, row) {
        this.$confirm(`确定删除新闻 【${row.title}】 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.articles.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          console.log('取消删除')
        })
      },
      resetForm (formName) {
        this.$refs[formName].clearValidate()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .article-box {
    width: 100%;

    .el-pagination {
      margin-top: 20px;
    }

    .quill-editor {
      height: 300px;
      margin-bottom: 20px;
    }
  }
</style>
