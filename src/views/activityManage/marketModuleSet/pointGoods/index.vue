<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="PointGoods">
    <template v-slot:default>
      <div class="point-goods-container">
        <goods-time goods-type="point" :step-action="stepAction" />
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import LayoutSubChild from '@/layout/indexSubChild'
import GoodsTime from '@/components/goodsSection/goodsTime'
import { stepAction } from '../utils/index'

export default {
  name: 'PointGoods',
  components: {
    LayoutSubChild,
    GoodsTime
  },
  data() {
    return {
      stepAction
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
