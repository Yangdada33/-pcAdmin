<template>
  <div class="live-set-container">
    <el-tabs v-model="liveIndex" @tab-click="handleClick">
      <el-tab-pane label="基础设置">
        <live-base-set :live-id="liveId" @stepAction="stepAction" />
      </el-tab-pane>
      <template v-if="liveId">
        <el-tab-pane label="商品管理">
          <live-goods-set :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
        <el-tab-pane label="敏感词替换">
          <live-word-replace :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
        <el-tab-pane label="直播章设置">
          <live-medal-set :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
        <el-tab-pane label="直播章礼品">
          <live-medal-gift :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
        <el-tab-pane label="直播素材">
          <live-material-center :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
        <el-tab-pane label="充值流量费">
          <live-flow-expense :live-id="liveId" @stepAction="stepAction" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LiveBaseSet from '../components/baseSet/index'
import LiveGoodsSet from '../components/goodsSet/index'
import LiveWordReplace from '../components/wordReplace/index'
import LiveMedalSet from '../components/medalSet/index'
import LiveMaterialCenter from '../components/materialCenter/index'
import LiveMedalGift from '../components/medalGift/index'
import LiveFlowExpense from '../components/flowExpense/index'

export default {
  name: 'LiveListSet',
  components: {
    LiveBaseSet,
    LiveGoodsSet,
    LiveWordReplace,
    LiveMedalSet,
    LiveMaterialCenter,
    LiveMedalGift,
    LiveFlowExpense
  },
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      liveIndex: '0'
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)d
    },
    stepAction({ type, liveId }) {
      const liveIndex = Number(this.liveIndex)
      switch (type) {
        case 'prev':
          this.liveIndex = (liveIndex - 1).toString()
          break
        case 'next':
          liveId && (this.liveId = liveId)
          this.liveIndex = (liveIndex + 1).toString()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .live-set-container{
    position: relative;
  }
</style>
