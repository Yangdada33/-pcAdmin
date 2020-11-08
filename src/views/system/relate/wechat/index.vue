<template>
  <div class="relate-wechat-container">
    <div class="wechat-header">
      <svg-icon class-name="relateIcon" icon-class="system_icon_relate" />
      <span>关联微信</span>
    </div>
    <div v-if="requestFinishStatus" class="wechat-main">
      <div v-if="!relateData.status" class="relate-yes">
        <div class="title">扫码关联微信</div>
        <div id="relate-code-container" />
      </div>
      <div v-else class="relate-no">
        <span>您已关联微信</span>
        <img class="avatar" :src="relateData.avatar" alt="">
        <el-button type="primary" size="small" plain @click="unRelateAction">解除关联</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { wechatRelateValidate, wechatUnRelateSet } from '@/api/system/relate'
import { appId } from '@/api/user'
import { wechatRelateFilter } from '@/utils/data'

export default {
  name: 'RelateWechat',
  data() {
    return {
      requestFinishStatus: false,
      relateData: {
        status: false,
        userId: '',
        avatar: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userInfo'
    ])
  },
  created() {
    this.getWechatRelateStatus()
  },
  methods: {
    initRelativeCode() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        new WxLogin({
          id: 'relate-code-container',
          appid: appId,
          scope: 'snsapi_login',
          redirect_uri: encodeURIComponent(wechatRelateFilter),
          state: 'bear',
          style: 'black',
          href: ''
        })
      })
    },
    getWechatRelateStatus() {
      wechatRelateValidate().then(response => {
        const { is_bind, user_id, avatar } = response.data
        this.relateData = {
          status: is_bind,
          userId: user_id,
          avatar: avatar || this.avatar
        }
        this.requestFinishStatus = true
        if (!is_bind) {
          this.initRelativeCode()
        }
      })
    },
    unRelateAction() {
      wechatUnRelateSet().then(response => {
        this.$message.success(response.msg)
        this.relateData = { status: false, userId: '', avatar: '' }
        this.getWechatRelateStatus()
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .relate-wechat-container{
    .wechat-header{
      padding: 18px;
      font-size:16px;
      font-weight:500;
      color: $themeColor;
      line-height:25px;
      .relateIcon{
        margin-right: 8px;
        font-size: 18px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
    .wechat-main{
      padding: 36px 0 60px;
      background: #FFF;
      .relate-yes{
        font-size:18px;
        font-weight:400;
        color:rgba(255,68,120,1);
        line-height:60px;
        text-align: center;
        .wechat{
          width: 200px;
          height: 200px;
          margin: auto;
          background: #EEE;
        }
      }
      .relate-no{
        &>span{
          padding-left: 40px;
          vertical-align: middle;
        }
        .avatar{
          width: 40px;
          height: 40px;
          margin: 0 60px 0 24px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .el-button{
          vertical-align: middle;
        }
      }
    }
  }
</style>
