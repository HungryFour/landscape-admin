<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="employees" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="name" label="姓名" fixed="left" min-width="100"></el-table-column>
      <el-table-column prop="pic" label="头像" min-width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
            fit="contain">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title1" :show-overflow-tooltip="true" label="头衔1" min-width="180"></el-table-column>
      <el-table-column prop="title2" :show-overflow-tooltip="true" label="头衔2" min-width="180"></el-table-column>
      <el-table-column prop="production" :show-overflow-tooltip="true" label="作品" min-width="300"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="800px" :visible.sync="editFormVisible" @close="resetForm('infoForm')">
      <el-form :model="edit_employee" ref="infoForm" label-width="100px">
        <el-form-item label="姓名" prop="name" :rules="[ {required: true, message: '请填写姓名', trigger: 'blur'}]">
          <el-input v-model="edit_employee.name"></el-input>
        </el-form-item>
        <el-form-item label="头衔1" prop="title1" :rules="[ {required: true, message: '请填写头衔1', trigger: 'blur'}]">
          <el-input type="textarea" v-model="edit_employee.title1"></el-input>
        </el-form-item>
        <el-form-item label="头衔2" prop="title2" :rules="[ {required: true, message: '请填写头衔2', trigger: 'blur'}]">
          <el-input type="textarea" v-model="edit_employee.title2"></el-input>
        </el-form-item>
        <el-form-item label="作品" prop="production" :rules="[ {required: true, message: '请填写作品', trigger: 'blur'}]">
          <el-input type="textarea" v-model="edit_employee.production"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar" :rules="[ {required: true, message: '请选择头像', trigger: 'blur'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            accept="image/jpeg,image/png,image/gif,image/jpg"
            :http-request="uploadImageFile"
            name="index_pic"
            :show-file-list="false">
            <img v-if="edit_employee.avatar" :src="edit_employee.avatar" class="avatar">
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
        employees: [],
        employee: {
          id: '',
          name: '',
          title1: '',
          title2: '',
          production: '',
          avatar: ''
        },
        edit_employee: {},
        editFormVisible: false,
        dialogTitle: '',
        tableLoading: false
      }
    },
    mounted () {
      this.getEmployees()
    },
    methods: {
      getEmployees () {
        this.tableLoading = true
        const param = {}
        this.$api.getEmployees(param).then((res) => {
          this.tableLoading = false
          this.employees = res.data.data
        }).catch((err) => {
          this.tableLoading = false
          console.error(err)
        })
      },
      handleEdit (index, row) {
        this.dialogTitle = '编辑'
        this.edit_employee = Object.assign({}, row)
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
            if (this.edit_employee.id) {
              this.$api.updateEmployee(this.edit_employee).then(res => {
                loading.close()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getEmployees()
              }).catch(() => {
                loading.close()
              })
            } else {
              this.$api.createEmployee(this.edit_employee).then(res => {
                loading.close()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getEmployees()
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
          this.$api.removeEmployee(row.id).then(res => {
            this.employees.splice(index, 1)
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
        this.edit_employee = JSON.parse(JSON.stringify(this.employee))
        console.log('add _ employee:', this.edit_employee)
        this.editFormVisible = true
      },
      uploadImageFile (files) {
        console.log('files:', files.file)
        this.$api.uploadFile({
          file: files.file
        }).then(res => {
          this.edit_employee.avatar = 'http://api.huazhangmedia.com/image/' + res.data.data.resume_name
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
    font-size: 20px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
