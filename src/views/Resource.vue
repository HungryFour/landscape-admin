<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="date" label="名称" width="100"></el-table-column>
      <el-table-column prop="name" label="导演" width="100"></el-table-column>
      <el-table-column prop="phone" label="制作" width="120"></el-table-column>
      <el-table-column prop="phone" label="类型" width="120"></el-table-column>
      <el-table-column prop="phone" label="资源类别" width="120"></el-table-column>
      <el-table-column prop="address" label="封面"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>

    <el-dialog :title="dialogTitle" width="800px" :visible.sync="editFormVisible" @close="resetForm('infoForm')">
      <el-form :model="user" :rules="rules" ref="infoForm" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="导演：">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="制作：">
          <el-input v-model="user.address"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="value" placeholder="请选择类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类别：">
          <el-radio-group v-model="radio">
            <el-radio :label="3">视频</el-radio>
            <el-radio :label="6">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图：">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频代码：">
          <el-input type="textarea" v-model="user.address"></el-input>
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
        users: [],
        user: {
          id: '',
          date: '',
          name: '',
          phone: '',
          address: '',
          status: 0
        },
        categoryOptions: [
          { label: 'TVC', value: 'tvc' },
          { label: '宣传片', value: 'trailer' },
          { label: '动画', value: 'cartoon' },
          { label: '纪录片', value: 'documentary' },
          { label: '活动', value: 'activity' },
          { label: '运营', value: 'operation' }],
        imageUrl: '',
        userBackup: Object.assign({}, this.user),
        editFormVisible: false,
        dialogTitle: '',
        rowIndex: 9999,
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getUsers()
    },
    methods: {
      getUsers () {
        this.loading = true
        this.$api('/api/users').then((res) => {
          this.users = res.data
        }).catch((err) => {
          console.error(err)
        })
      },
      handleEdit (index, row) {
        this.dialogTitle = '编辑'
        this.user = Object.assign({}, row)
        this.editFormVisible = true
        this.rowIndex = index
      },
      submitUser (formName) {
        // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const id = this.user.id
            if (id) {
              // id非空-修改
              this.users.splice(this.rowIndex, 1, this.user)
            } else {
              // id为空-新增
              this.user.id = this.users.length + 1
              this.users.unshift(this.user)
            }
            this.editFormVisible = false
            this.$message({
              type: 'success',
              message: id ? '修改成功！' : '新增成功！'
            })
          }
        })
      },
      handleDelete (index, row) {
        this.$confirm(`确定删除用户 【${row.name}】 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.users.splice(index, 1)
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
      },
      handleAdd () {
        this.dialogTitle = '新增'
        this.user = Object.assign({}, this.userBackup)
        this.editFormVisible = true
      },
      beforeAvatarUpload (files) {

      }
    }
  }
</script>

<style>
  .user-box {
    width: 100%;
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
    font-size: 28px;
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
