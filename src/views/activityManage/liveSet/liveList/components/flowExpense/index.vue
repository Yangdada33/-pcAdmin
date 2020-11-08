<template>
  <div class="flow-expense-container">
    <div v-if="!stepIndex" class="expense-wrap">
      <el-row class="expense-header" type="flex" justify="space-between" align="middle">
        <div class="title">预存直播流量</div>
        <div class="money">当前流量账户：<span>{{ activityData.activity_config.live_prepayment_account }}</span>元</div>
      </el-row>
      <div class="expense-form">
        <el-form ref="form" :model="form" label-width="120px" size="small">
          <el-form-item label="充值金额：">
            <el-row type="flex" align="middle">
              <el-form-item v-for="(item, index) in expenseData.payList" :key="index" label-width="0">
                <el-button type="primary" :plain="index !== form.payIndex" @click="paySelectedAction(index)">{{ item.value }}</el-button>
                <div class="form-tip-gray">{{ item.content }}</div>
              </el-form-item>
              <el-form-item label-width="0">
                <el-input v-model="form.money" style="width: 140px;" placeholder="其他金額" @focus="moneyFocusAction">
                  <template slot="append">元</template>
                </el-input>
                <div class="form-tip-gray">自定义金额</div>
              </el-form-item>
            </el-row>
            <div v-if="expenseData.desCont" class="expense-des">
              <svg-icon icon-class="tip" />
              <div v-html="expenseData.desCont" />
            </div>
          </el-form-item>
          <el-form-item class="action-list">
            <el-button :loading="loading" :disabled="validatePayDisabled" type="primary" @click="formSaveAction">确认充值</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-else-if="stepIndex === 1" class="code-wrap">
      <el-row class="code-title" type="flex" justify="space-between" align="middle">
        <span>预存直播流量</span>
        <el-button type="primary" size="mini" @click="stepBackAction">返回</el-button>
      </el-row>
      <div class="code-header">充值：{{ payMoney }}元</div>
      <div class="code-main">
        <div class="tip">请扫码支付</div>
        <el-image style="width: 360px; height: 360px" fit="contain" :src="payCodeUrl" />
      </div>
    </div>
    <div v-else-if="stepIndex === 2" class="code-wrap">
      <el-row class="code-title" type="flex" justify="space-between" align="middle">
        <span>预存直播流量</span>
        <el-button type="primary" size="mini" @click="stepBackAction">返回</el-button>
      </el-row>
      <div class="code-main">
        <svg-icon icon-class="result_icon_success" class-name="result_icon_success" />
        <div class="tip">您已成功充值直播流量费{{ payMoney }}元</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { livePayDetail } from '@/api/platformSet/livePay'
import { rechargeSet, rechargeOrderData } from '@/api/activityManage/marketModuleSet'
import { rechargeTypeData } from '@/utils/data'
import QRCode from 'qrcode'

export default {
  name: 'LiveFlowExpense',
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      stepIndex: 0, // 0-充值前 1-扫码充值 2-充值成功
      expenseData: {
        payList: [],
        desCont: ''
      },
      form: {
        payIndex: '',
        money: ''
      },
      payCodeUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ]),
    validatePayDisabled() {
      const { payIndex, money } = this.form
      return payIndex === '' && !money
    },
    payMoney() {
      const { payIndex, money } = this.form
      if (payIndex !== '') {
        return this.expenseData.payList[payIndex].value
      } else if (money) {
        return money
      }
      return '0.00'
    }
  },
  created() {
    this.getLivePayDetail()
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    getLivePayDetail() {
      livePayDetail().then(response => {
        const { fee, remark } = response.data
        this.expenseData = {
          payList: fee,
          desCont: remark
        }
      })
    },
    paySelectedAction(index) {
      this.form = {
        payIndex: index,
        money: ''
      }
    },
    moneyFocusAction() {
      this.form.payIndex = ''
    },
    codeCreator(codeUrl) {
      QRCode.toDataURL(codeUrl, {
        width: 400,
        margin: 2
      }, (error, url) => {
        if (error) {
          console.log(error)
        } else {
          this.payCodeUrl = url
        }
      })
    },
    circleRechargeOrderValidate(orderSn) {
      this.timer = setInterval(() => {
        rechargeOrderData({ activityId: this.activityData.id, orderSn }).then(response => {
          const { pay_status, account: activity_config } = response.data
          if (pay_status) {
            clearInterval(this.timer)
            this.$store.commit('activity/setActivityData', { ...this.activityData, activity_config })
            this.nextStepAction()
          }
        })
      }, 4000)
    },
    formSaveAction() {
      this.loading = true
      const money = this.form.payIndex !== '' ? this.expenseData.payList[this.form.payIndex].value : this.form.money
      rechargeSet({
        activityId: this.activityData.id,
        liveId: this.liveId,
        money,
        type: rechargeTypeData.live
      }).then(response => {
        this.loading = false
        const { code_url, order_sn } = response.data
        this.codeCreator(code_url)
        this.stepIndex = 1
        this.circleRechargeOrderValidate(order_sn)
      }).catch(() => {
        this.loading = false
      })
    },
    stepBackAction() {
      this.timer && clearInterval(this.timer)
      this.stepIndex = 0
    },
    nextStepAction() {
      this.stepIndex = 2
    }
  }
}
</script>

<style lang="scss" scoped>
  .flow-expense-container{
    .expense-wrap{
      padding-bottom: 12px;
      background: #FFF;
      .expense-header{
        padding: 12px 16px;
        border-bottom: 1px solid #EEE;
        font-size:14px;
        font-weight:400;
        color:rgba(74,74,74,1);
        line-height:28px;
        .title{
          font-size: 16px;
          font-weight: 500;
        }
        .money{
          span{
            color:rgba(255,68,120,1);
            font-size: 20px;
          }
        }
      }
      .expense-form{
        padding-top: 20px;
        .el-row{
          .el-form-item{
            margin-bottom: 0;
            padding-right: 24px;
          }
        }
        .expense-des{
          position: relative;
          margin-top: 16px;
          font-size:12px;
          font-weight:400;
          color:rgba(255,68,120,1);
          line-height: 20px;
          text-align: justify;
          .svg-icon{
            position: absolute;
            top: 2px;
            left: 0;
            width: 16px;
            height: 16px;
          }
          &>div{
            margin-left: 20px;
            margin-right: 12px;
          }
        }
        .action-list{
          .el-button:first-child{
            margin-left: 120px;
          }
        }
      }
    }
    .code-wrap{
      background: #FFF;
      .code-title{
        padding: 12px 12px 12px 0;
        border-bottom: 1px solid #EEE;
        font-size:16px;
        font-weight:400;
        color:rgba(51,51,51,1);
        span{
          padding: 0 12px;
        }
      }
      .code-header{
        padding-left: 12px;
        font-size:18px;
        font-weight:400;
        color:rgba(255,0,0,1);
        line-height:36px;
      }
      .code-main{
        padding: 36px 0;
        text-align: center;
        .tip{
          font-size:16px;
          font-weight:400;
          color:rgba(0,0,0,1);
          line-height:37px;
        }
        .el-image{
          background: #EEE;
        }
        .result_icon_success{
          font-size: 80px;
        }
      }
    }
  }
</style>
