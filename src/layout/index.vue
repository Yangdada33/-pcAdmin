<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar :message-status="messageStatus" @openMessageDialog="openMessageDialog" />
      </div>
      <app-main />
    </div>

    <el-dialog custom-class="message-dialog" title="消息列表" :visible.sync="dialogMessageVisible">
      <div slot="title" class="dialog-title">
        <div class="title-icon">
          <i class="el-icon-message-solid" />
        </div>
        <div class="title-tip">消息列表</div>
      </div>
      <div class="dialog-main">
        <ul
          v-if="messageList.length"
          v-infinite-scroll="messageLoad"
          class="infinite-list"
          style="overflow:auto"
          infinite-scroll-distance="40"
        >
          <li v-for="(item,index) in messageList" :key="item.id" class="infinite-list-item">
            <div class="message-time">{{ item.created_at }}</div>
            <div class="message-cont">
              <el-row type="flex" justify="space-between" align="middle">
                <div class="cont-left">
                  <div class="left-top">{{ item.title }}</div>
                  <div class="left-bottom">{{ item.content }}</div>
                </div>
                <div v-if="item.is_read" class="cont-right">消息已读</div>
                <div v-else class="cont-right no-read" @click="messageReadAction(item, index)">标为已读</div>
              </el-row>
              <el-badge v-if="!item.is_read" is-dot class="badge-item" />
            </div>
          </li>
        </ul>
        <div v-else class="empty-message">暂无可读消息</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { messageList, messageReadSet } from '@/api/system/message'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      dialogMessageVisible: false,
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      messageList: []
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    messageStatus() {
      return Boolean(this.messageList.filter(item => !item.is_read).length)
    }
  },
  created() {
    this.getMessageList()
  },
  methods: {
    getMessageList() {
      messageList(this.pageData).then(response => {
        const { list, total } = response.data
        this.pageData.total = total
        this.messageList.push(...list)
      })
    },
    messageReadAction(item, index) {
      messageReadSet(item.id).then(response => {
        this.$message.success(response.msg)
        this.messageList[index].is_read = 1
      })
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    openMessageDialog() {
      this.dialogMessageVisible = true
    },
    messageLoad() {
      if (this.pageData.index === 1) {
        if (this.messageList.length === this.pageData.size) {
          this.pageData.index += 1
          this.getMessageList()
        }
      } else {
        this.pageData.index += 1
        this.getMessageList()
      }
    }
  }
}
</script>

<style lang="scss">
  // dialog
  .el-dialog{
    min-width: 280px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
      overflow: hidden;
    }
  }
</style>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .message-dialog{
    .dialog-title{
      padding: 12px 0;
      border-bottom: 1px solid #CACACA;
      .title-icon{
        display: inline-block;
        width: 34px;
        height: 34px;
        margin: 0 12px 0 20px;
        background: #2786DF;
        border-radius: 50%;
        text-align: center;
        line-height: 34px;
        font-size: 16px;
        color: #FFF;
      }
      .title-tip{
        display: inline-block;
        font-size:16px;
        font-weight:500;
        color:rgba(74,74,74,1);
      }
    }
    .dialog-main{
      .infinite-list{
        height: 400px;
        padding: 0 24px 0 36px;
        list-style: none;
        .infinite-list-item{
          &:last-child{
            margin-bottom: 12px;
          }
          .message-time{
            text-align: center;
            font-size:13px;
            font-weight:400;
            color:#7F7F7F;
            line-height:48px;
          }
          .message-cont{
            position: relative;
            padding: 16px;
            background:rgba(255,255,255,1);
            box-shadow:0 0 6px 0 rgba(0,0,0,0.33);
            border-radius:6px;
            .cont-left{
              .left-top{
                padding-bottom: 8px;
                font-size:15px;
                font-weight:500;
                color:rgba(0,0,0,1);
                line-height:20px;
              }
              .left-bottom{
                font-size:12px;
                font-weight:400;
                color:rgba(0,0,0,1);
                line-height:16px;
              }
            }
            .cont-right{
              margin: 8px 0;
              font-size:12px;
              font-weight:400;
              color: $themeColor;
              text-align: right;
              &.no-read{
                color: red;
                cursor: pointer;
              }
            }
            .badge-item{
              position: absolute;
              right: -12px;
              top: -4px;
            }
          }
        }
      }
      .empty-message{
        padding: 50px 0;
        text-align: center;
      }
    }
  }
</style>
