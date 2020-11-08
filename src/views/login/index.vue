<template>
  <div class="login-container">
    <el-col :span="24">
      <div class="login-section">
        <el-col :offset="2">
          <div class="title">飞米超级成单系统管理端</div>
        </el-col>
        <div class="section-container">
          <div class="tip">欢迎使用</div>
          <el-col>
            <div v-show="loginType === 1" class="login-wrap login-scan">
              <div class="login-tip">微信扫码登录</div>
              <div id="login-code-container" class="login-code" />
              <div class="login-account" @click="tabLoginType(2)">账号登录</div>
            </div>
            <div v-if="loginType === 2" class="login-wrap login-account">
              <img class="login-wechat" src="../../assets/login/wechatIcon.png" alt="" @click="tabLoginType(1)">
              <div class="login-tip">使用账号登录</div>
              <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="username">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="请输入账号"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="off"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    auto-complete="off"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
                <div class="tips">
                  <span @click="tabLoginType(3)">验证码登录</span>
                  <span>忘记密码？</span>
                </div>
                <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
              </el-form>
            </div>
            <div v-else-if="loginType === 3" class="login-wrap login-mobile">
              <img class="login-wechat" src="../../assets/login/wechatIcon.png" alt="" @click="tabLoginType(1)">
              <div class="login-tip">使用手机号登录</div>
              <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="mobile">
                  <el-input
                    ref="mobile"
                    v-model="loginForm.mobile"
                    placeholder="请输入手机号"
                    name="mobile"
                    type="text"
                    tabindex="3"
                    auto-complete="off"
                  />
                </el-form-item>
                <el-form-item v-if="!noteCodeStatus">
                  <div class="getNoteCode" @click="sendNoteCode">
                    <span>获取短信验证码</span>
                  </div>
                </el-form-item>
                <el-form-item v-else prop="code">
                  <div class="code-wrap">
                    <el-input
                      ref="code"
                      v-model="loginForm.code"
                      placeholder="请输入验证码"
                      name="code"
                      type="text"
                      tabindex="4"
                      auto-complete="off"
                    />
                    <span v-if="!countDownStatus" class="time-count-down" @click="obtainCodeAction">重新获取</span>
                    <span v-else class="time-count-down">{{ countDownTime }}s</span>
                  </div>
                </el-form-item>
                <div class="tips">
                  <span @click="tabLoginType(2)">密码登录</span>
                </div>
                <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
              </el-form>
            </div>
          </el-col>
        </div>
      </div>
    </el-col>
    <img class="login-bg hidden-sm-and-down" src="../../assets/login/loginBg.png">
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { appId, noteCode } from '@/api/user'
import { loginScanFilter } from '@/utils/data'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (this.loginType === 2) {
        value ? callback() : callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (this.loginType === 2) {
        value ? callback() : callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (this.loginType === 3) {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else {
          if (validMobile(value)) {
            callback()
          } else {
            callback(new Error('请输入有效手机号'))
          }
        }
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (this.loginType === 3) {
        value ? callback() : callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginType: 2, // 登录方式：1-扫码 2-账号 3-手机号
      loginForm: {
        username: '',
        password: '',
        mobile: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      noteCodeStatus: false,
      countDownTime: 60,
      countDownStatus: false,
      wxLoginImg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.initLoginCode()
  },
  methods: {
    initLoginCode() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        new WxLogin({
          id: 'login-code-container',
          appid: appId,
          scope: 'snsapi_login',
          redirect_uri: encodeURIComponent(loginScanFilter),
          state: 'bear',
          style: 'black',
          href: ''
        })
      })
    },
    formatValidateProps() {
      switch (this.loginType) {
        case 1:
          return []
        case 2:
          return ['username', 'password']
        case 3:
          return ['mobile', 'code']
      }
    },
    tabLoginType(type) {
      const validateProps = this.formatValidateProps()
      validateProps.length && this.$refs.loginForm.clearValidate(validateProps)
      this.loginType = type
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    sendCodeRequest() {
      noteCode(this.loginForm.mobile).then((response) => {
        this.$message.success(response.msg)
        this.codeTimeDown()
      })
    },
    sendNoteCode() {
      this.$refs.loginForm.validateField('mobile', msg => {
        if (!msg) {
          this.noteCodeStatus = true
          this.$nextTick(() => {
            this.sendCodeRequest()
          })
        }
      })
    },
    codeTimeDown() {
      this.countDownTime = 60
      this.countDownStatus = true
      const timer = setInterval(() => {
        if (this.countDownTime === 1) {
          clearInterval(timer)
          this.countDownStatus = false
        }
        this.countDownTime -= 1
      }, 1000)
    },
    obtainCodeAction() {
      this.$refs.loginForm.validateField('mobile', msg => {
        !msg && this.sendCodeRequest()
      })
    },
    handleLogin() {
      const validateProps = this.formatValidateProps()
      let errorNum = 0
      this.$refs.loginForm.validateField(validateProps, msg => { msg && errorNum++ })
      if (!errorNum) {
        this.loading = true
        this.$store.dispatch('user/login', { ...this.loginForm, type: this.loginType }).then(() => {
          this.$router.push({ path: this.redirect || '/' })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#FFF;
$light_gray:#333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 60px;
    width: 74%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 60px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
      color:#999;
    }
    input:-moz-placeholder,textarea:-moz-placeholder{
      color:#999;
    }
    input::-moz-placeholder,textarea::-moz-placeholder{
      color:#999;
    }
    input:-ms-input-placeholder,textarea:-ms-input-placeholder{
      color:#999;
    }
  }

  .el-form-item {
    height: 60px;
    margin-bottom: 28px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #F3F3F3;
    border-radius: 30px;
    color: #454545;
    .el-form-item__error{
      padding-left: 20px;
    }
  }

  .el-button{
    height: 60px;
    background:rgba(39,134,223,1);
    border-radius: 30px;
    font-size:20px;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

$bg:#FFFFFF;
$dark_gray:#889aa4;
$light_gray:#eee;

$codeWidth: 320px;

.login-container {
  display: flex;
  min-height: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-section{
    flex: 1;
    padding: 30px 0 0;
    .title{
      font-size:24px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
    .section-container{
      text-align: center;
      .tip{
        font-size:38px;
        font-weight:400;
        color:rgba(39,134,223,1);
        line-height:90px;
      }
      .login-tip{
        font-size:15px;
        font-weight:400;
        color:rgba(155,155,155,1);
        line-height:50px;
      }
      .login-wrap{
        width: $codeWidth;
        margin: auto;
        &.login-scan{
          .login-code{
            height: $codeWidth * 1.2;
          }
          .login-account{
            margin-left: $codeWidth * 0.1;
            font-size:16px;
            font-weight:400;
            color:rgba(39,134,223,1);
            line-height:50px;
            text-align: left;
            cursor: pointer;
          }
        }
        &.login-account{

        }
        &.login-mobile{
          .getNoteCode{
            border-radius: 30px;
            cursor: pointer;
            user-select: none;
            span{
              line-height: 60px;
              color: #999;
            }
            &:hover{
              background:rgba(39,134,223,1);
              span{
                color: #FFF;
              }
            }
          }
          .code-wrap{
            .time-count-down{
              padding: 10px 10px 10px 0;
              font-size:15px;
              font-weight:400;
              color:rgba(255,0,0,1);
              line-height:60px;
              cursor: pointer;
              user-select: none;
            }
          }
        }

        .login-wechat{
          width: 45px;
          height: 45px;
          margin-top: 20px;
          cursor: pointer;
        }

        .login-form {
          position: relative;
          width: 520px;
          max-width: 100%;
          padding: 10px 0;
          margin: 0 auto;
          overflow: hidden;
        }

        .tips {
          @include clearfix;
          margin: 12px 0 16px;
          span {
            font-size:16px;
            font-weight:400;
            color:rgba(39,134,223,1);
            cursor: pointer;
            user-select: none;
            &:first-of-type {
              float: left;
              margin-left: 16px;
            }
            &:last-of-type {
              float: right;
              margin-right: 16px;
            }
          }
        }

        .svg-container {
          padding: 6px 5px 10px 15px;
          color: $dark_gray;
          vertical-align: middle;
          width: 30px;
          display: inline-block;
        }

        .title-container {
          position: relative;

          .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
          }
        }

        .show-pwd {
          position: absolute;
          right: 10px;
          top: 12px;
          font-size: 16px;
          color: $dark_gray;
          cursor: pointer;
          user-select: none;
        }
      }
    }
  }
  .login-bg{
    width: auto;
    height: 100vh;
    min-height: 700px;
  }
}
</style>
