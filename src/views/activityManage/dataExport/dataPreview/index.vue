<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="data-preview-container">
    <!-- 本活动数据汇总 -->
    <data-section class="data-section" left-side-bg="linear-gradient(180deg,rgba(126,198,255,1) 0%,rgba(58,120,255,1) 100%)" title="本活动数据汇总">
      <template v-slot:header-right>
        <el-row type="flex" justify="end" align="middle">
          <data-filter :type-list="typeList" :type-index="typeIndex" @dataFilterType="dataFilterType" @timeList="timeList" @timeEmpty="timeEmpty" />
          <el-button v-if="false" class="export-button" type="danger" icon="el-icon-download" size="mini">导出</el-button>
        </el-row>
      </template>
      <template v-slot:default>
        <data-section-item item-color="#2786DF" :data-list="dataList" />
      </template>
    </data-section>
  </div>
</template>

<script>
import DataSection from '@/components/DataSection'
import DataFilter from '@/components/DataFilter'
import DataSectionItem from '@/components/DataSection/DataSectionItem'
import { navigatePath } from '@/router'
import { dataSummary } from '@/api/activityManage/dataExport'

export default {
  name: 'PreviewData',
  components: {
    DataSection,
    DataSectionItem,
    DataFilter
  },
  data() {
    return {
      typeList: [
        { value: 0, label: '汇总' },
        { value: 1, label: '今日' },
        { value: 2, label: '昨日' },
        { value: 3, label: '7日' },
        { value: 4, label: '30日' }
      ],
      typeIndex: 1,
      startTime: '',
      endTime: '',
      dataList: [
        {
          value: null,
          unit: '人',
          title: '浏览数量',
          icon: require('../../../../assets/icon/eye.png')
        },
        {
          value: null,
          unit: '人',
          title: '报名数量',
          icon: require('../../../../assets/icon/apply.png')
        },
        {
          value: null,
          unit: '单',
          title: '爆款秒杀订单数量',
          icon: require('../../../../assets/icon/sale.png')
        },
        {
          value: null,
          unit: '元',
          title: '爆款秒杀订单金额',
          icon: require('../../../../assets/icon/bag.png')
        },
        {
          value: null,
          unit: '人',
          title: '进直播间人数',
          icon: require('../../../../assets/icon/live.png')
        },
        {
          value: null,
          unit: '单',
          title: '直播间订单数量',
          icon: require('../../../../assets/icon/form.png')
        },
        {
          value: null,
          unit: '元',
          title: '直播间订单金额',
          icon: require('../../../../assets/icon/bag.png')

        },
        {
          value: null,
          unit: '单',
          title: '录单数量',
          icon: require('../../../../assets/icon/form.png')
        },
        {
          value: null,
          unit: '元',
          title: '录单金额',
          icon: require('../../../../assets/icon/bag.png')
        },
        {
          value: null,
          unit: '个',
          title: '现金券购买数量',
          icon: require('../../../../assets/icon/ticket.png')
        },
        {
          value: null,
          unit: '元',
          title: '现金券购买金额',
          icon: require('../../../../assets/icon/ticket.png')
        },
        {
          value: null,
          unit: '单',
          title: '现金券核销数量',
          icon: require('../../../../assets/icon/percent1.png')
        },
        {
          value: null,
          unit: '单',
          title: '直播间订单核销数量',
          icon: require('../../../../assets/icon/percent2.png')
        }
      ]
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    backSponsorListAction() {
      navigatePath({
        backStatus: true
      })
    },
    dataFilterType(typeIndex) {
      this.typeIndex = typeIndex
      this.startTime = ''
      this.endTime = ''
      this.getTableList()
    },
    timeList(value) {
      this.startTime = value.start
      this.endTime = value.end

      this.getTableList()
    },
    timeEmpty(value) {
      this.typeIndex = value
      this.startTime = ''
      this.endTime = ''
      this.getTableList()
    },
    getTableList() {
      var activityId = window.localStorage.getItem('activityId')
      dataSummary({
        activityId: activityId,
        time_tag: this.typeIndex,
        start_time: this.startTime,
        end_time: this.endTime
      }).then(response => {
        this.dataList[0].value = response.data.view_num
        this.dataList[1].value = response.data.sign_num
        this.dataList[2].value = response.data.hot_sell_num
        this.dataList[3].value = response.data.hot_sell_price
        this.dataList[4].value = response.data.room_num
        this.dataList[5].value = response.data.live_order_num
        this.dataList[6].value = response.data.live_order_price
        this.dataList[7].value = response.data.sub_order_num
        this.dataList[8].value = response.data.sub_order_price
        this.dataList[9].value = response.data.voucher_num
        this.dataList[10].value = response.data.voucher_amount
        this.dataList[11].value = response.data.voucher_probability
        this.dataList[12].value = response.data.live_order_probability
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .data-preview-container{
    .export-button{
      margin-left: 16px;
    }
  }
</style>

<style lang="scss">
  .data-preview-container{
    .data-section .section-header{
      padding-top: 0;
    }
  }
</style>
