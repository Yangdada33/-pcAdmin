<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="admin-super-container">
    <div class="super-header">
      <svg-icon class-name="adminIcon" icon-class="system_icon_admin" />
      <span>超级管理员</span>
    </div>
    <div class="super-main">
      <div class="title">当前超级管理员</div>
      <template v-if="requestFinishStatus">
        <div v-if="!adminList.length" class="super-empty">
          <div class="tip">暂无超级管理员</div>
          <el-row class="action-list" type="flex" justify="center">
            <el-button type="primary" round plain @click="addAdminAction">添加超级管理员</el-button>
            <el-button type="primary" round plain @click="inviteAdminAction">邀请超级管理员</el-button>
          </el-row>
        </div>
        <div v-else class="super-list">
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <template v-slot:default>
              <el-row v-for="(item, index) in adminList" :key="index" class="super-item" type="flex" justify="space-between">
                <el-row class="avatar-username" type="flex" align="middle">
                  <el-avatar v-if="false" :size="36" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
                  <span>{{ item.mobile }}</span>
                </el-row>
                <el-popconfirm title="确定删除吗？" @onConfirm="handleDeleteAction(item)">
                  <el-button slot="reference" type="primary" size="mini">删除</el-button>
                </el-popconfirm>
              </el-row>
            </template>
          </pagination-section>
        </div>
      </template>
    </div>

    <el-dialog :show-close="false" :visible.sync="dialogInviteVisible" width="800px">
      <div class="invite-wrap">
        <div class="title">邀请超级管理员</div>
        <el-image class="code" fit="contain" :src="require('@/assets/system/inviteAdminPic.png')" />
        <div v-if="false" class="tip">鼠标右击保存图片发送给主播</div>
        <el-row class="link-url" type="flex" justify="space-between">
          <span>{{ linkUrl }}</span>
          <el-button type="primary" size="mini" @click="onCopyLinkAction(linkUrl, $event)">复制</el-button>
        </el-row>
        <div class="tip">复制上方链接发送给超级管理员</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { superAdminList, superAdminDelete, superAdminInvite } from '@/api/system/admin'
import { adminTypeData } from '@/utils/data'

export default {
  name: 'AdminSuper',
  components: {
    PaginationSection
  },
  data() {
    return {
      requestFinishStatus: false,
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      adminList: [],
      dialogInviteVisible: false,
      linkUrl: ''
    }
  },
  created() {
    this.getSuperAdminList()
    this.initInviteSuperAdmin()
  },
  methods: {
    getSuperAdminList() {
      superAdminList({ ...this.pageData, roleType: adminTypeData.super }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.adminList = data
        this.requestFinishStatus = true
      }).catch(() => {
        this.requestFinishStatus = true
      })
    },
    initInviteSuperAdmin() {
      superAdminInvite().then(response => {
        this.linkUrl = response.data
      })
    },
    addAdminAction() {
      navigatePath('/admin/super/add')
    },
    inviteAdminAction() {
      this.dialogInviteVisible = true
    },
    handleDeleteAction(item) {
      superAdminDelete(item.id).then(response => {
        this.$message.success(response.msg)
        this.getSuperAdminList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getSuperAdminList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getSuperAdminList()
    },
    onCopyLinkAction(text, event) {
      clip(text, event)
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
      .title{
        padding-left: 22px;
        border-bottom: 1px solid #EEE;
        font-size:16px;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:48px;
      }
      .super-empty{
        padding: 60px 0 120px;
        text-align: center;
        .tip{
          font-size:15px;
          font-weight:400;
          color:#979797;
          line-height: 80px;
        }
        .action-list{
          .el-button{
            margin: 0 16px;
          }
        }
      }
      .super-list{
        .super-item{
          padding: 12px 24px;
          border-bottom: 1px solid #DDD;
          &:last-child{
            border-bottom: none;
          }
          .avatar-username{
            .el-avatar{
              margin-right: 12px;
            }
          }
          .el-button{
            height: 32px;
            margin: 2px 0;
            padding: 0 15px;
            line-height: 32px;
          }
        }
      }
    }
    .invite-wrap{
      padding: 24px;
      text-align: center;
      .title{
        font-size:18px;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:80px;
      }
      .code{
        width: 200px;
        height: 200px;
        border: 1px solid #EEE;
        &+.tip{
          text-align: center;
        }
      }
      .link-url{
        width: 60%;
        min-width: 240px;
        margin: 20px auto 8px;
        padding: 4px 10px;
        border-bottom: 1px solid #DDD;
        span{
          line-height: 28px;
        }
      }
      .tip{
        width: 60%;
        min-width: 240px;
        margin: auto;
        font-size:12px;
        font-weight:400;
        color:rgba(255,68,120,1);
        line-height:28px;
        text-align: left;
      }
    }
  }
</style>
