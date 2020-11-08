<template>
  <div class="note-send-container">
    <div class="note-wrap">
      <el-form ref="form" :model="form" label-width="90px" size="small">
        <el-form-item label="客户类型：">
          <el-select v-model="form.customer" style="width: 30%;min-width: 170px;max-width: 360px;" placeholder="请选择接受客户类型">
            <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容：" class="note-rule clearfix" style="width: 80%;min-width: 260px;max-width: 600px;">
          <el-row type="flex">
            <el-input v-model="form.noteCont" :rows="4" type="textarea" placeholder="请输入短信内容" />
            <el-button type="primary" plain @click="templateSelectAction">短信模板</el-button>
          </el-row>
          <div class="form-tip">注：退订回T</div>
        </el-form-item>
        <el-form-item label="发送类型：">
          <el-radio-group v-model="form.sendStatus">
            <el-radio :label="0">实时发送</el-radio>
            <el-radio :label="1">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.sendStatus" label="发送时间：">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择发送时间"
          />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="primary" @click="formSaveAction">发送</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="dialogTemplateVisible">
      <div class="note-dialog">
        <div class="note-title">短信模板</div>
        <ul v-infinite-scroll="load" class="note-list" style="overflow:auto">
          <el-row v-for="(item, index) in 10" :key="index" class="note-item" type="flex" justify="space-between" align="middle">
            <div class="cont">1、规则说明规则说明规则说明规则说明规则说明规则说明规则说说明规则说明规则说明规则说明规则说明规则说明规则说明</div>
            <el-button type="primary" size="mini" @click="use()">使用</el-button>
          </el-row>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NoteSend',
  data() {
    return {
      customerList: [
        { id: 1, name: '客户类型1' },
        { id: 2, name: '客户类型2' },
        { id: 3, name: '客户类型3' }
      ],
      form: {
        customer: '',
        noteCont: '',
        sendStatus: 0,
        time: ''
      },
      dialogTemplateVisible: false
    }
  },
  methods: {
    formSaveAction() {},
    templateSelectAction() {
      this.dialogTemplateVisible = true
    },
    load() {},
    use() {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .note-send-container{
    .note-wrap{
      padding:24px 12px;
      background: #FFF;
      .note-rule{
        .el-textarea,
        .el-button{
          float: left;
        }
        .el-textarea{
          width: calc(100% - 90px);
          min-width: 140px;
        }
        .el-button{
          height: 32px;
          margin: 4px 0 0 10px;
        }
      }
      .action-list{
        .el-button:first-child{
          margin-left: 20%;
        }
      }
    }
    .note-dialog{
      padding: 18px 36px;
      .note-title{
        font-size:20px;
        font-weight:500;
        color:rgba(51,51,51,1);
        text-align: center;
      }
      .note-list{
        height: 360px;
        padding-left: 0;
        background: #EEE;
        .note-item{
          padding: 12px 16px 0;
          &:last-child{
            padding-bottom: 12px;
          }
          .cont{
            @include ellipsis;
            width: calc(100% - 80px);
          }
        }
      }
    }
  }
</style>
