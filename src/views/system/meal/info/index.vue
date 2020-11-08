<template>
  <div class="meal-info-container">
    <div class="meal-header">
      <svg-icon class-name="mealIcon" icon-class="system_icon_meal" />
      <span>套餐情况</span>
    </div>
    <div class="meal-main">
      <div class="main-header">
        <img class="meal-icon" src="@/assets/system/meal_icon.png" alt="">
        <span>当前套餐</span>
      </div>
      <div class="main-cont">
        <div class="wrap clearfix">
          <div v-if="false" class="item">时间：<span>12</span>个月</div>
          <div class="item">到期时间：<span>{{ userMealData.end_time || '暂无' }}</span> <span class="tip">（优先使用本套餐，本套餐到期后按次数扣除）</span> </div>
        </div>
        <div class="wrap clearfix">
          <div class="item">总次数：<span>{{ userMealData.total_times }}</span>次</div>
          <div class="item">已使用：<span>{{ userMealData.use_times }}</span>次</div>
          <div class="item">剩余：<span>{{ userMealData.left_times }}</span>次</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userMealData } from '@/api/system/meal'

export default {
  name: 'MealInfo',
  data() {
    return {
      userMealData: {}
    }
  },
  created() {
    this.getUserMealData()
  },
  methods: {
    getUserMealData() {
      userMealData().then(response => {
        this.userMealData = response.data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .meal-info-container{
    .meal-header{
      padding: 18px;
      font-size:16px;
      font-weight:500;
      color: $themeColor;
      line-height:25px;
      .mealIcon{
        margin-right: 8px;
        font-size: 18px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
    .meal-main{
      padding: 36px 36px 60px;
      background: #FFF;
      .main-header{
        padding-bottom: 16px;
        font-size:18px;
        font-weight:400;
        color:rgba(0,0,0,1);
        .meal-icon{
          width: 24px;
          margin-right: 12px;
          vertical-align: middle;
        }
        span{
          vertical-align: middle;
        }
      }
      .main-cont{
        .wrap{
          .item{
            float: left;
            margin: 16px 0;
            padding: 2px 50px;
            border-right: 2px solid #EEE;
            font-size: 15px;
            &:last-child{
              border-right: none;
            }
            &>span:first-child{
              font-size: 22px;
              color: #FF7300;
            }
            .tip{
              font-size: 14px;
              color: #9B9B9B;
            }
          }
        }
      }
    }
  }
</style>
