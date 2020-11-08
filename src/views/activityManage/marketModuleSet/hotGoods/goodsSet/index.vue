<template>
  <div class="hot-goods-set-container">
    <div class="hot-goods-form-wrap">
      <goods-set goods-type="hot" :goods-id="goodsId" />
    </div>
    <div v-if="newGoodsTableData.length" class="hot-goods-table-wrap">
      <hot-goods-table :new-goods-table-data="newGoodsTableData" />
    </div>
  </div>
</template>

<script>
import GoodsSet from '@/components/goodsSection/goodsSet'
import HotGoodsTable from '@/components/goodsSection/goodsTable'

export default {
  name: 'HotGoodsSet',
  components: {
    GoodsSet,
    HotGoodsTable
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
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .hot-goods-set-container{
    .hot-goods-form-wrap{
      padding: 24px 0 12px;
      background: #FFF;
    }
    .hot-goods-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
