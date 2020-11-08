<template>
  <div class="password-reset-container">
    <div class="reset-header">
      <svg-icon class-name="lockIcon" icon-class="system_icon_phone" />
      <span>修改手机号</span>
    </div>
    <div class="reset-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="旧手机号：" prop="oldPhone">
          <el-input v-model="form.oldPhone" style="width: 180px" placeholder="请输入旧手机号" />
        </el-form-item>
        <el-form-item label="新手机号：" prop="newPhone">
          <el-input v-model="form.newPhone" style="width: 180px" placeholder="请输入新手机号" />
        </el-form-item>
        <el-form-item label="确认手机号：" prop="surePhone">
          <el-input v-model="form.surePhone" style="width: 180px" placeholder="请再次输入新手机号" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="small" @click="onSubmit">确 认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetPhone } from '@/api/system/phone'

export default {
  name: 'PhoneReset',
  data() {
    const validateSurePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认手机号'))
      } else {
        if (value !== this.form.newPhone) {
          callback(new Error('确认手机号和新手机号不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      form: {
        oldPhone: '',
        newPhone: '',
        surePhone: ''
      },
      rules: {
        oldPhone: [
          { required: true, message: '请输入旧手机号', trigger: 'blur' }
        ],
        newPhone: [
          { required: true, message: '请输入新手机号', trigger: 'blur' }
        ],
        surePhone: [
          { required: true, validator: validateSurePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          resetPhone(this.form).then((response) => {
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
