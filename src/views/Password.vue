<template>
  <div class="container">

    <el-form :model="edit_info" ref="infoForm" label-width="100px" :rules="rules">
      <el-form-item label="原密码" prop="old_password">
        <el-input style="width: 200px" v-model="edit_info.old_password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input style="width: 200px" v-model="edit_info.new_password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirm_password">
        <el-input style="width: 200px" v-model="edit_info.confirm_password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUser('infoForm')">确 定</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    data () {
      var newPasswordPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.edit_info.confirm_password !== '') {
            this.$refs.infoForm.validateField('confirm_password')
          }
          callback()
        }
      }
      var confirmPasswordPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.edit_info.new_password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        edit_info: {
          old_password: '',
          new_password: '',
          confirm_password: ''
        },
        rules: {
          new_password: [
            { validator: newPasswordPass, trigger: 'blur' }, {
              required: true,
              message: '请填写新密码',
              trigger:
                'blur'
            }
          ],
          confirm_password: [
            { validator: confirmPasswordPass, trigger: 'blur' }, {
              required: true,
              message: '请填写确认密码',
              trigger:
                'blur'
            }
          ],
          old_password: [
            { required: true, message: '请填写原密码', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
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
            this.$api.updatePassword(this.edit_info).then(res => {
              loading.close()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }).catch(() => {
              loading.close()
            })
          } else {
            return false
          }
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

</style>
