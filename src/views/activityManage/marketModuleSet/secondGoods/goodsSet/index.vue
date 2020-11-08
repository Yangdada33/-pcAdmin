<template>
  <div class="second-goods-set-container">
    <div class="second-goods-form-wrap">
      <goods-set goods-type="second" :goods-id="goodsId" />
    </div>
    <div v-if="newGoodsTableData.length" class="second-goods-table-wrap">
      <Second-goods-table :new-goods-table-data="newGoodsTableData" />
    </div>
  </div>
</template>

<script>
import GoodsSet from '@/components/goodsSection/goodsSet'
import SecondGoodsTable from '@/components/goodsSection/goodsTable'

export default {
  name: 'SecondGoodsSet',
  components: {
    GoodsSet,
    SecondGoodsTable
  },
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newGoodsTableData: []
    }
  }
}
</script>

<style lang="scss" scoped>
  .second-goods-set-container{
    .second-goods-form-wrap{
      padding: 24px 0 12px;
      background: #FFF;
    }
    .second-goods-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
