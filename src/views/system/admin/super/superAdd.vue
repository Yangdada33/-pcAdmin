<template>
  <div class="admin-super-container">
    <div class="super-header">
      <svg-icon class-name="adminIcon" icon-class="system_icon_admin" />
      <span>超级管理员 / 新增管理员</span>
    </div>
    <div class="super-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="form.mobile" style="width: 240px;" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" style="width: 240px;" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="surePassword">
          <el-input v-model="form.surePassword" style="width: 240px;" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" size="small" @click="formBackAction">返 回</el-button>
          <el-button :loading="loading" type="primary" size="small" @click="formSaveAction">确 认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { superAdminAdd } from '@/api/system/admin'
import { adminTypeData } from '@/utils/data'
import { validMobile } from '@/utils/validate'

export default {
  name: 'SuperAdd',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value) {
        if (validMobile(value)) {
          callback()
        } else {
          callback(new Error('请输入正确手机号'))
        }
      } else {
        callback(new Error('请输入手机号'))
      }
    }
    const validateSurePassword = (rule, value, callback) => {
      if (value) {
        if (value === this.form.password) {
          callback()
        } else {
          callback(new Error('两次输入密码不一致'))
        }
      } else {
        callback(new Error('请输入确认密码'))
      }
    }
    return {
      loading: false,
      form: {
        mobile: '',
        password: '',
        surePassword: ''
      },
      rules: {
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        surePassword: [
          { required: true, validator: validateSurePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          superAdminAdd({ ...this.form, roleType: adminTypeData.super }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
          }).catch(() => {
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

  .admin-super-container{
    .super-header{
      padding: 18px;
      font-size:16px;
      font-weight:500;
      color:$themeColor;
      line-height:25px;
      .adminIcon{
        margin-right: 8px;
        font-size: 18px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
    .super-main{
      background: #FFF;
      .el-form{
        padding: 36px 20px;
        background: #FFF;
        .action-list{
          .el-button:first-child{
            margin-left: 40px
          }
        }
      }
    }
  }
</style>
