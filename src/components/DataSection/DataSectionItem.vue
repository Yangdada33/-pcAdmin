<template>
  <div class="data-section-item-container">
    <el-row class="section-item-list" type="flex">
      <div v-for="(item, index) in dataList" :key="index" class="section-item">
        <div class="value">{{ item.value }}{{ item.unit }}</div>
        <div class="key" :style="{color: itemColor}">{{ item.title }}</div>
        <div class="icon-img">
          <img :src="item.icon">
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DataSectionItem',
  props: {
    itemColor: {
      type: String,
      default: '#DDD',
      require: true
    },
    dataList: {
      type: Array,
      default: () => [],
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
  $itemColor: var(--itemColor);

  .data-section-item-container{
    .section-item-list{
      flex-wrap: wrap;
      .section-item{
        position: relative;
        min-width: 140px;
        width: calc((100% - 84px) / 7);
        margin: 12px 6px 0;
        padding: 12px 16px;
        background: #FFF;
        line-height:20px;
        overflow: hidden;
        border-radius: 10px;
        .value{
          font-size:12px;
          font-weight:400;
          color:rgba(0,0,0,1);
        }
        .key{
          font-size:12px;
          font-weight:400;
        }

        .icon-img{
          width: 50px;
          height: 45px;
          position: absolute;
          top: -1px;
          right: -1px;

          img{
           width: 100%;
           height: 100%;
          }
        }
      }
    }
  }
</style>
