<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="OrderStatistics">
    <template v-slot:default>
      <div class="order-list-container">
        <div class="order-list-wrap">
          <div class="order-data-section">
            <el-row class="data-header" type="flex" justify="space-between" align="middle">
              <div class="header-left">
                <span>总余额：</span>
                <span>{{ allBalance }} 元</span></div>
              <div class="header-right">
                <el-button class="recharge-button" type="primary" plain round @click="withdrawDeposit">提现</el-button>
                <el-button class="recharge-button" type="primary" plain round @click="addRechargeAction">充值</el-button>
              </div>
            </el-row>

            <div class="cardBox">
              <div v-for="(item , index) in dataList" :key="index" class="card">
                <div class="cardImg">
                  <img :src="item.icon" alt="">
                </div>
                <div class="cardRight">
                  <div class="text">{{ item.title }}</div>
                  <div class="number">{{ item.number }}元</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提现 -->
          <el-dialog
            :visible.sync="dialogVisible"
            width="25%"
            top="23vh"
            :show-close="false"
          >
            <div class="money">
              <div class="remaining">余额提现</div>
              <div class="path">提现到<span class="pathImg"><img :src="pathImg"></span> 微信零钱</div>
              <div class="takeMoney">
                <div class="take_title">提现金额</div>

                <div class="take_all">账户余额 ¥ <span>{{ allBalance }}</span> </div>
              </div>
              <button class="confirm" :class="{'confirm_no':allBalance < 0.31}" @click="confirm()">确定提现</button>
            </div>
          </el-dialog>

        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import LayoutSubChild from '@/layout/indexSubChild'
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import { applyWithdraw } from '@/api/activityManage/withdrawDeposit'

export default {
  name: 'OrderStatistics',
  components: {
    LayoutSubChild
  },
  data() {
    return {
      dataList: [
        { icon: require('@/assets/finance/finance_icon3.png'), title: '推广余额', name: 'activityMoney', number: 0.00 },
        { icon: require('@/assets/finance/finance_icon1.png'), title: '奖金余额', name: 'prizeMoney', number: 0.00 },
        { icon: require('@/assets/finance/finance_icon4.png'), title: '订单收入金额', name: 'orderMoney', number: 0.00 }
      ],
      dialogVisible: false,
      pathImg: require('@/assets/finance/money.png'),
      allBalance: 0.00
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    const money = this.activityData.activity_config

    if (money !== null) {
      this.dataList[0].number = money.surplus_promote_fee
      this.dataList[1].number = money.surplus_reward_money
      this.dataList[2].number = money.order_total_money
      const allMoney = +money.surplus_promote_fee + +money.surplus_reward_money + +money.order_total_money
      this.allBalance = allMoney.toFixed(2)
    }
  },
  methods: {
    addRechargeAction() {
      navigatePath('/activityManage/financeManage/orderStatistics/rechargeSet')
    },
    // 提现显示弹框
    withdrawDeposit() {
      this.dialogVisible = true
    },
    //  确定
    confirm() {
      if (this.allBalance >= 0.31) {
        this.withdraw()
      } else {
        this.open()
      }
    },
    // 提现
    withdraw() {
      this.dialogVisible = false
      var activityId = window.localStorage.getItem('activityId')
      applyWithdraw({
        activity_id: activityId,
        amount: this.allBalance
      }).then(res => {
        // console.log(res)
        this.$message.success('申请成功,等待审核')

        const money = 0
        this.dataList.forEach(value => {
          value.number = money.toFixed(2)
        })

        this.allBalance = money.toFixed(2)
      }).catch(res => {
        // console.log(res)
      })
    },
    // 提示消息
    open() {
      this.$message.error('余额需大于0.31元,才可提现')
    }
  }
}
</script>

<style lang="scss" scoped>
  input{
    background:none;
    outline:none;
    border:none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  }

  button{
    border: 0;
    background-color: transparent;
    outline: none;
  }

  .order-list-container{
    .order-list-wrap{

      .order-data-section{
        .data-header{
          height: 151px;
          padding: 0 50px 0 84px;
          background: #fff;

          .header-left{
            font-size:28px;
            font-weight:400;
            color:rgba(0,0,0,1);
            span{
              vertical-align: middle;
              &:last-child{
                font-size:40px;
                font-weight:500;
                color:rgba(255,0,0,1);
              }
            }
          }
          .header-right{
            .recharge-button{
              width: 195px;
              height: 70px;
              border-radius: 35px;
              font-size: 30px;
              margin: 0 21px;
            }
          }
        }
      }

      .cardBox{
        margin-top: 30px;
        overflow: hidden;

        .card{
          min-width: 32%;
          background: #fff;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          float: left;
          margin-left:2%;
          padding: 60px 0;

          &:nth-child(1){
            margin-left: 0;
          }

          .cardImg{
            width: 31%;

            img{
              width: 100%;
              height: 100%;
            }
          }

          .cardRight{

            .text{
              color: #4A4A4A;
              text-align: center;
              font-size: 20px;
            }

            .number{
              color: #000000;
              font-size: 30px;
              text-align: center;
              margin-top: 2px;
            }
          }

        }
      }

      .money{
        cursor: default;

        .remaining{
          font-size: 22px;
          text-align: center;
          height:94px;
          line-height: 94px;
          font-weight: 500;
          background-color: #F3F3F3;
          color: #282828;
          border-radius: 2px;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .path{
          height: 110px;
          text-align: left;
          font-size: 20px;
          padding: 53px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #F3F3F3;

          .pathImg{
            margin-left: 35px;
            margin-right: 10px;
          }
        }

        .takeMoney{
          height: 110px;
          font-size: 20px;
          position: relative;

          .take_title{
            position: absolute;
            top: 31px;
            left: 55px;
          }

          .take_number{
            height: 50px;
            line-height: 50px;
            width: 78%;
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            border-bottom: 1px solid #F3F3F3;

            input{
              width: 100%;
              height: 100%;
              margin-left: 10px;
              position: absolute;
            }
          }

          .take_all{
            position: absolute;
            top: 90px;
            left: 55px;
            color: #989898;
            font-size: 30px;

            span{
              color: red;
              font-size: 40px;
              margin-left: 20px;
            }
          }
        }

        .confirm{
          width: 82%;
          height: 65px;
          font-size: 24px;
          color: #fff;
          background-color: #2786DF;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          margin: 60px 0 55px;
          border-radius: 5px;
          cursor: pointer;
        }

        .confirm_no{
          cursor: not-allowed;
          background-color: #D8D8D8;
        }

      }
    }
  }

</style>

<style>
  .el-dialog{
    border-radius: 20px;
  }
</style>
