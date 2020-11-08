<template>
  <div class="password-reset-container">
    <div class="reset-header">
      <svg-icon class-name="lockIcon" icon-class="system_icon_lock" />
      <span>修改密码</span>
    </div>
    <div class="reset-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="94px" size="small">
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input v-model="form.oldPassword" style="width: 180px" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="form.newPassword" style="width: 180px" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="surePassword">
          <el-input v-model="form.surePassword" style="width: 180px" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="small" @click="onSubmit">确 认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetPassword } from '@/api/system/password'

export default {
  name: 'PasswordReset',
  data() {
    const validateSurePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else {
        if (value !== this.form.newPassword) {
          callback(new Error('确认密码和新密码不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        surePassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        surePassword: [
          { required: true, validator: validateSurePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          resetPassword(this.form).then((response) => {
            this.$message.success(response.msg)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .password-reset-container{
    .reset-header{
      padding: 18px;
      font-size:16px;
      font-weight:500;
      color:$themeColor;
      line-height:25px;
      .lockIcon{
        margin-right: 8px;
        font-size: 18px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
    .reset-main{
      .el-form{
        padding: 36px 20px;
        background: #FFF;
        .el-button{
          margin-left: 36px;
        }
      }
    }
  }
</style>
