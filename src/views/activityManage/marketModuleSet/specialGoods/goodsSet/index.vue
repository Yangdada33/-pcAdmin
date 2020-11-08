<template>
  <div class="special-goods-set-container">
    <div class="special-goods-form-wrap">
      <goods-set goods-type="special" :goods-id="goodsId" />
    </div>
    <div v-if="newGoodsTableData.length" class="special-goods-table-wrap">
      <special-goods-table :new-goods-table-data="newGoodsTableData" />
    </div>
  </div>
</template>

<script>
import GoodsSet from '@/components/goodsSection/goodsSet'
import SpecialGoodsTable from '@/components/goodsSection/goodsTable'

export default {
  name: 'SpecialGoodsSet',
  components: {
    GoodsSet,
    SpecialGoodsTable
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
  .special-goods-set-container{
    .special-goods-form-wrap{
      padding: 24px 0 12px;
      background: #FFF;
    }
    .special-goods-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
