<template>
  <div class="recharge-set-container">
    <div class="recharge-wrap">
      <el-form v-if="!stepIndex" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="充值类目：">
          <el-radio-group v-model="form.type">
            <el-radio v-for="item in typeList" :key="item.value" :label="item.value" @change="rechargeType">{{ item.label }}</el-radio>
          </el-radio-group>
          <div class="form-tip-red">{{ formatTypeTip }}</div>
        </el-form-item>
        <el-form-item label="充值金额：" prop="money">
          <el-input v-model="form.money" style="width: 180px;" placeholder="请输入充值金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">确 认</el-button>
        </el-form-item>
      </el-form>
      <div v-else-if="stepIndex === 1" class="code-wrap">
        <el-row class="code-title" type="flex" justify="space-between" align="middle">
          <span>扫码充值</span>
          <el-button type="primary" size="mini" @click="stepBackAction">返回</el-button>
        </el-row>
        <div class="code-header">充值：{{ form.money }} 元</div>
        <div class="code-main">
          <div class="tip">请扫码支付</div>
          <el-image
            style="width: 360px; height: 360px"
            fit="contain"
            :src="payCodeUrl"
          />
        </div>
      </div>
      <div v-else-if="stepIndex === 2" class="code-wrap">
        <el-row class="code-title" type="flex" justify="space-between" align="middle">
          <span>充值成功</span>
          <el-button type="primary" size="mini" @click="stepBackAction">返回</el-button>
        </el-row>
        <div class="code-main">
          <svg-icon icon-class="result_icon_success" class-name="result_icon_success" />
          <div class="tip">您已成功充值{{ form.money }}元</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { validateMoney } from '@/utils/validate'
import { rechargeSet, rechargeOrderData } from '@/api/activityManage/marketModuleSet'
import { mapGetters } from 'vuex'
import QRCode from 'qrcode'

export default {
  name: 'RechargeSet',
  data() {
    return {
      loading: false,
      stepIndex: 0, // 0-充值前 1-扫码充值 2-充值成功
      typeList: [
        // { value: 1, label: '短信充值', des: '此费用将充到短信账户余额，将用于活动短信发送' },
        { value: 1, label: '活动费用充值', des: '此费用将充值到主办方活动账户余额，可用于浏览红包、裂变红包、购卡红包奖励、品牌以上层级挑战奖励、奖金池金币兑换等费用支出' },
        { value: 2, label: '奖金充值', des: '此费用将充值到奖金账户，此费用将用于任务、挑战等奖金发放' }
      ],
      typeIndex: 0,
      form: {
        type: 1,
        money: ''
      },
      rules: {
        money: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      rechargeTypeData: 11, // 默认第一个
      payCodeUrl: ''
    }
  },
  computed: {
    formatTypeTip() {
      return this.typeList.find(item => item.value === this.form.type).des
    },
    ...mapGetters([
      'activityData'
    ])
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
          rechargeSet({
            activityId: this.activityData.id,
            money: this.form.money,
            type: this.rechargeTypeData
          }).then(res => {
            const { code_url, order_sn } = res.data
            this.codeCreator(code_url)
            this.stepIndex = 1
            this.circleRechargeOrderValidate(order_sn)
          })
        } else {
          return false
        }
      })
    },
    stepBackAction() {
      this.stepIndex = 0
    },
    nextStepAction() {
      this.stepIndex = 2
    },
    rechargeType(value) {
      switch (value) {
        // case 1:
        //   this.rechargeTypeData = 10 //短信
        //   break
        case 1:
          this.rechargeTypeData = 11 // 活动推广
          break
        case 2:
          this.rechargeTypeData = 12 // 奖金
          break
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .recharge-set-container{
    .recharge-wrap{
      padding:12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 60px;
        }
      }
      .code-wrap{
        background: #FFF;
        .code-title{
          padding-bottom: 10px;
          border-bottom: 1px solid #EEE;
          font-size:16px;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        .code-header{
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
  }
</style>
