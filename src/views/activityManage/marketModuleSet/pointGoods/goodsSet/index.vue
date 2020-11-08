<template>
  <div class="point-goods-set-container">
    <div class="point-goods-form-wrap">
      <goods-set goods-type="point" :goods-id="goodsId" />
    </div>
    <div v-if="newGoodsTableData.length" class="point-goods-table-wrap">
      <point-goods-table :new-goods-table-data="newGoodsTableData" />
    </div>
  </div>
</template>

<script>
import GoodsSet from '@/components/goodsSection/goodsSet'
import PointGoodsTable from '@/components/goodsSection/goodsTable'

export default {
  name: 'PointGoodsSet',
  components: {
    GoodsSet,
    PointGoodsTable
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
  .point-goods-set-container{
    .point-goods-form-wrap{
      padding: 24px 0 12px;
      background: #FFF;
    }
    .point-goods-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
