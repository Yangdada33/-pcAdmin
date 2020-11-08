<template>
  <div class="module-section-container">
    <el-row class="section-header" type="flex" justify="space-between" align="middle">
      <div class="section-title">
        <span :style="{'background': leftSideBg}" />
        <span>{{ title }}</span>
      </div>
      <slot name="header-right" />
    </el-row>
    <div class="section-main">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataSection',
  props: {
    leftSideBg: {
      type: String,
      default: '#DDD'
    },
    title: {
      type: String,
      default: '模块标题',
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .module-section-container{
    .section-header{
      flex-wrap: wrap;
      position: relative;
      padding: 10px 0 0;
      .section-title{
        margin: 8px 0;
        span:first-child{
          padding: 0 2px;
          background: #DDD;
        }
        span:last-child{
          padding-left: 10px;
          font-size:16px;
          font-weight:600;
          color:rgba(0,0,0,1);
        }
      }
    }
  }
</style>
