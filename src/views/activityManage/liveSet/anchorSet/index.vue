<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="anchor-set-container">
    <div class="anchor-wrap">
      <div v-if="false" class="step-list">
        <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
        <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
      </div>
      <div class="anchor-table clearfix">
        <el-button :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteAnchorAction">批量删除</el-button>
        <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="inviteAnchorAction">邀请主播</el-button>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%;"
          size="small"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="name"
            label="主播姓名"
            align="center"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="mobile"
            label="手机号"
            width="160"
            align="center"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            align="center"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="created_at"
            label="邀请时间"
            align="center"
            header-align="center"
          />
          <el-table-column label="操作" width="150" align="center" header-align="center">
            <template slot-scope="scope">
              <el-tooltip v-if="false" class="item" effect="dark" content="编辑" placement="top">
                <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm title="确定删除吗？" @onConfirm="handleDeleteAction(scope)">
                  <svg-icon slot="reference" icon-class="table_icon_delete" class-name="table-action" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog :show-close="false" :visible.sync="dialogInviteVisible">
      <div class="invite-wrap">
        <div class="title">邀请主播</div>
        <el-image class="code" fit="contain" :src="inviteData.shareImg" />
        <div class="tip">鼠标右击保存图片发送给主播</div>
        <el-row class="link-url" type="flex" justify="space-between">
          <span>{{ inviteData.linkUrl }}</span>
          <el-button type="primary" size="mini" @click="onCopyLinkAction(inviteData.linkUrl, $event)">复制</el-button>
        </el-row>
        <div class="tip">复制上方链接发送给主播</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clip from '@/utils/clipboard'
import { navigatePath } from '@/router'
import { anchorList, anchorDelete, anchorInvite } from '@/api/activityManage/liveSet'

export default {
  name: 'AnchorSet',
  data() {
    return {
      form: {
        fileName: ''
      },
      tableData: [],
      multipleSelection: [],
      dialogInviteVisible: false,
      inviteData: {
        shareImg: '',
        linkUrl: '',
        qrCode: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'moduleList'
    ])
  },
  created() {
    this.getAnchorList()
  },
  methods: {
    getAnchorList() {
      anchorList(this.activityData.id).then(response => {
        this.tableData = response.data
      })
    },
    prevStepAction() {
      const marketModuleData = this.moduleList.find(item => item.path === 'marketModuleSet')
      if (marketModuleData) {
        navigatePath('/activityManage/marketModuleSet/' + marketModuleData.children[marketModuleData.children.length - 1])
      } else {
        navigatePath('/activityManage/baseSet/marketModuleSelect')
      }
    },
    nextStepAction() {
      navigatePath('/activityManage/liveSet/liveGoods')
    },
    deleteCommonFn(idList, scope) {
      anchorDelete({ activityId: this.activityData.id, idList }).then(response => {
        this.$message.success(response.msg)
        this.getAnchorList()
      })
    },
    batchDeleteAnchorAction() {
      this.deleteCommonFn(this.multipleSelection.map(item => item.id))
    },
    inviteAnchorAction() {
      if (!this.inviteData.linkUrl) {
        anchorInvite(this.activityData.id).then(response => {
          const { img, qrcode, url } = response.data
          this.inviteData = {
            shareImg: img,
            linkUrl: url,
            qrCode: qrcode
          }
          this.dialogInviteVisible = true
        })
      } else {
        this.dialogInviteVisible = true
      }
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleEditAction(scope) {
      console.log(scope)
    },
    handleDeleteAction(scope) {
      this.deleteCommonFn([scope.row.id], scope)
    },
    onCopyLinkAction(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .anchor-set-container{
    .anchor-wrap{
      &>div{
        padding: 12px 0;
        background: #FFF;
      }
      .step-list{
        text-align: right;
        .el-button:last-child{
          margin-right: 12px;
        }
      }
      .anchor-table{
        margin-top: 12px;
        .el-button{
          margin: 0 12px 12px;
        }
        .delete-button{
          float: left;
        }
        .add-button{
          float: right;
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .table-action{
            margin: 0 8px;
            font-size: 18px;
            cursor: pointer;
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
        line-height:60px;
      }
      .code{
        width: 250px;
        height: 250px;
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
