<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="preview-data-container">
    <el-row class="preview-header" type="flex" justify="space-between" align="middle">
      <breadcrumb />
      <div>
        <span class="sponsor-title">
          <span>当前主办方：</span>
          <span class="title">{{ sponsorName }}</span>
        </span>
        <el-button class="back-sponsor-list" type="primary" size="small" @click="backSponsorListAction">返回主办方列表</el-button>
      </div>
    </el-row>
    <!-- 所有活动数据汇总 -->
    <data-section left-side-bg="linear-gradient(180deg,rgba(126,198,255,1) 0%,rgba(58,120,255,1) 100%)" title="所有活动数据汇总">
      <template v-slot:header-right>
        <data-filter :type-list="typeList" :type-index="typeValue" @dataFilterType="dataFilterType" @timeList="timeList" @timeEmpty="timeEmpty" />
      </template>
      <template v-slot:default>
        <data-section-item item-color="#2786DF" :data-list="activity_data" />
      </template>
    </data-section>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import DataSection from '@/components/DataSection'
import DataFilter from '@/components/DataFilter'
import DataSectionItem from '@/components/DataSection/DataSectionItem'
import { navigatePath } from '@/router'
import { mainList } from '@/api/sponsorList/index'

export default {
  name: 'PreviewData',
  components: {
    Breadcrumb,
    DataSection,
    DataSectionItem,
    DataFilter
  },
  props: {
    sponsorId: {
      type: String,
      default: ''
    },
    sponsorName: {
      type: String,
      default: ''
    }
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
      activity_data: [],
      typeValue: 1,
      startTime: '',
      endTime: ''
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
      this.typeValue = typeIndex
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
      this.typeValue = value
      this.startTime = ''
      this.endTime = ''
      this.getTableList()
    },
    getTableList() {
      mainList({
        type: this.typeValue,
        sponsorId: this.sponsorId,
        start_time: this.startTime,
        end_time: this.endTime
      }).then(res => {
        // console.log('res:', res)

        const activity = res.data

        activity.forEach(ele => {
          switch (ele.type) {
            case 1:
              ele.icon = require('../../../assets/icon/apply2.png')
              break
            case 2:
              ele.icon = require('../../../assets/icon/live2.png')
              break
            case 3:
              ele.icon = require('../../../assets/icon/live2.png')
              break
            case 4:
              ele.icon = require('../../../assets/icon/eye.png')
              break
            case 5:
              ele.icon = require('../../../assets/icon/apply.png')
              break
            case 6:
              ele.icon = require('../../../assets/icon/sale.png')
              break
            case 7:
              ele.icon = require('../../../assets/icon/bag.png')
              break
            case 8:
              ele.icon = require('../../../assets/icon/percent0.png')
              break
            case 9:
              ele.icon = require('../../../assets/icon/live.png')
              break
            case 10:
              ele.icon = require('../../../assets/icon/form.png')
              break
            case 11:
              ele.icon = require('../../../assets/icon/bag.png')
              break
            case 12:
              ele.icon = require('../../../assets/icon/only.png')
              break
            case 13:
              ele.icon = require('../../../assets/icon/bag.png')
              break
            case 14:
              ele.icon = require('../../../assets/icon/ticket.png')
              break
            case 15:
              ele.icon = require('../../../assets/icon/ticket.png')
              break
            case 16:
              ele.icon = require('../../../assets/icon/percent1.png')
              break
            case 17:
              ele.icon = require('../../../assets/icon/percent2.png')
              break
            case 18:
              ele.icon = require('../../../assets/icon/handshake.png')
              break
            default:
              ele.icon = require('../../../assets/icon/apply2.png')
          }
        })
        this.activity_data = activity
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .sponsor-title{
    padding-right: 12px;
    font-size:15px;
    font-weight:500;
    color:rgba(51,51,51,1);
    &:first-child{
      padding-left: 0;
    }
    .title{
      color: $themeColor;
    }
  }
</style>
