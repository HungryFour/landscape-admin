<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="resources" style="width: 100%" v-loading="tableLoading">
      <el-table-column fixed="left" prop="title" label="名称" min-width="100"></el-table-column>
      <el-table-column prop="director" label="导演" min-width="100"></el-table-column>
      <el-table-column prop="info" label="制作" min-width="120"></el-table-column>
      <el-table-column prop="category" label="类型" :formatter="categoryFormatter" min-width="120"></el-table-column>
      <el-table-column prop="resource_type" label="资源类别" min-width="120">
        <template slot-scope="scope">
          <div>{{scope.row.resource_type === 0 ? '视频' : '图片'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cover_pic" label="封面" min-width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.cover_pic"
            :preview-src-list="[scope.row.cover_pic]"
            fit="contain">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="250">
        <template slot-scope="scope">
          <el-button v-if="scope.row.resource_type === 0" size="mini" type="primary" plain @click="previewVideo(scope.row.video)">播放视频</el-button>
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="800px" :visible.sync="editFormVisible" @close="resetForm('infoForm')">
      <el-form :model="edit_resource" ref="infoForm" label-width="100px">
        <el-form-item label="名称：" prop="title" :rules="[ {required: true, message: '请填写标题', trigger: 'blur'}]">
          <el-input v-model="edit_resource.title"></el-input>
        </el-form-item>
        <el-form-item label="导演：" prop="director" :rules="[ {required: true, message: '请填写导演', trigger: 'blur'}]">
          <el-input v-model="edit_resource.director"></el-input>
        </el-form-item>
        <el-form-item label="制作：">
          <el-input v-model="edit_resource.info"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="category" :rules="[ {required: true, message: '请选择类型', trigger: 'blur'}]">
          <el-select v-model="edit_resource.category" placeholder="请选择类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类别：">
          <el-radio-group v-model="edit_resource.resource_type">
            <el-radio :label="0">视频</el-radio>
            <el-radio :label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="edit_resource.resource_type === 0 ? '封面图' : '图片'" prop="cover_pic" :rules="[ {required: true, message: '请选择图片',
        trigger: 'blur'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            accept="image/jpeg,image/png,image/gif,image/jpg"
            :http-request="uploadImageFile"
            name="index_pic"
            :show-file-list="false">
            <img v-if="edit_resource.cover_pic" :src="edit_resource.cover_pic" class="avatar">
            <div class="avatar-uploader-icon" v-else>点击上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="edit_resource.resource_type === 0" label="视频代码：" prop="video" :rules="[ {required: true, message: '请填写视频代码', trigger: 'blur'}]">
          <el-input style="height: auto" type="textarea" v-model="edit_resource.video"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitResource('infoForm')">确 定</el-button>
      </div>
    </el-dialog>

    <div class="pop" v-if="videoPopup">
      <div class="close_btn" @click="videoPopup = false">关闭</div>
      <div class="row">
        <div class="poition_center col-lg-12 col-md-12 col-sm-12" v-html="currentVideo"></div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        resources: [],
        resource: {
          id: '',
          video: '',
          cover_pic: '',
          title: '',
          info: '',
          category: '',
          director: '',
          resource_type: 0
        },
        currentVideo: '',
        videoPopup: false,
        edit_resource: {},
        tableLoading: false,
        editFormVisible: false,
        dialogTitle: '',
        categoryOptions: [
          { label: 'TVC', value: 'tvc' },
          { label: '宣传片', value: 'trailer' },
          { label: '动画', value: 'cartoon' },
          { label: '纪录片', value: 'documentary' },
          { label: '活动', value: 'activity' },
          { label: '运营', value: 'operation' }],
        categoryOptionsLabel: {
          tvc: 'TVC',
          trailer: '宣传片',
          cartoon: '动画',
          documentary: '纪录片',
          activity: '活动',
          operation: '运营'
        }
      }
    },
    mounted () {
      this.getResources()
    },
    methods: {
      categoryFormatter (row, column) {
        return this.categoryOptionsLabel[row.category] || ''
      },
      previewVideo (video) {
        this.videoPopup = true
        this.currentVideo = video
      },
      getResources () {
        this.tableLoading = true
        const param = {}
        this.$api.getResources(param).then((res) => {
          this.tableLoading = false
          this.resources = res.data.data
        }).catch((err) => {
          this.tableLoading = false
          console.error(err)
        })
      },
      handleEdit (index, row) {
        this.dialogTitle = '编辑'
        this.edit_resource = Object.assign({}, row)
        console.log('this.edit_resource：', this.edit_resource)
        this.editFormVisible = true
      },
      submitResource (formName) {
        // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '提交中。。。',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            if (this.edit_resource.id) {
              console.log('this.edit_resource：', this.edit_resource)

              this.$api.updateResource(this.edit_resource).then(res => {
                loading.close()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getResources()
              }).catch(() => {
                loading.close()
              })
            } else {
              this.$api.createResource(this.edit_resource).then(res => {
                loading.close()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.editFormVisible = false
                this.getResources()
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
          this.$api.removeResource(row.id).then(res => {
            this.resources.splice(index, 1)
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
        this.edit_resource = Object.assign({}, this.resource)
        this.editFormVisible = true
      },
      uploadImageFile (files) {
        console.log('files:', files.file)
        this.$api.uploadFile({
          file: files.file
        }).then(res => {
          this.edit_resource.cover_pic = 'http://api.huazhangmedia.com/image/' + res.data.data.resume_name
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

  .pop {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 3000;
  }

  .poition_center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .close_btn {
    color: #fff;
    font-size: 14px;
    float: right;
    margin: 40px;
    cursor: pointer;
  }

</style>
