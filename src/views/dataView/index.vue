<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="data-view-container">
    <div v-if="status === 0">
      <!-- 平台活动数据汇总 -->
      <data-section left-side-bg="linear-gradient(180deg,rgba(126,198,255,1) 0%,rgba(58,120,255,1) 100%)" title="平台活动数据汇总">
        <template v-slot:header-right>
          <data-filter :type-list="typeList" :type-index="typeIndex" @dataFilterType="dataFilterType" @timeList="timeList" @timeEmpty="timeEmpty" />
        </template>
        <template v-slot:default>
          <data-section-item item-color="#2786DF" :data-list="activity_data" />
        </template>
      </data-section>
      <!-- 平台营销模块使用汇总 -->
      <data-section left-side-bg="linear-gradient(180deg,rgba(255,181,150,1) 0%,rgba(255,89,0,1) 100%)" title="平台营销模块使用汇总">
        <template v-slot:default>
          <data-section-item item-color="#FF7300" :data-list="module_data" />
        </template>
      </data-section>
      <!-- 平台素材库汇总 -->
      <data-section left-side-bg="linear-gradient(180deg,rgba(255,181,150,1) 0%,rgba(255,89,0,1) 100%)" title="平台素材库汇总">
        <template v-slot:default>
          <data-section-item item-color="#FF4478" :data-list="material_data" />
        </template>
      </data-section>
    </div>

    <div v-else-if="status === 1">
      <!-- 所有活动数据汇总 -->
      <data-section left-side-bg="linear-gradient(180deg,rgba(126,198,255,1) 0%,rgba(58,120,255,1) 100%)" title="所有活动数据汇总">
        <template v-slot:header-right>
          <data-filter :type-list="typeList" :type-index="typeIndex" @dataFilterType="dataFilterType" @timeList="timeList" @timeEmpty="timeEmpty" />
        </template>
        <template v-slot:default>
          <data-section-item item-color="#2786DF" :data-list="activity_allData" />
        </template>
      </data-section>
    </div>

  </div>
</template>

<script>
import DataSection from '@/components/DataSection'
import DataSectionItem from '@/components/DataSection/DataSectionItem.vue'
import DataFilter from '@/components/DataFilter'
import { mainList } from '@/api/dataView/index'
import { mapGetters } from 'vuex'

export default {
  name: 'DataView',
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
      activity_data: [], // title ,value ,unit ,icon
      module_data: [],
      material_data: [],
      activity_allData: [],
      status: 0, // 0-平台 1-主办方,
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getTableList()

    this.status = this.userInfo.type
  },
  methods: {
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
      mainList({
        type: this.typeIndex,
        start_time: this.startTime,
        end_time: this.endTime
      }).then(res => {
        if (this.status === 0) {
          const activity = res.data.activity_data
          const modules = res.data.module_data
          const material = res.data.material_data

          // 活动
          activity.forEach(ele => {
            switch (ele.type) {
              case 1:
                ele.icon = require('@/assets/icon/apply2.png')
                break
              case 2:
                ele.icon = require('@/assets/icon/live2.png')
                break
              case 3:
                ele.icon = require('@/assets/icon/live2.png')
                break
              case 4:
                ele.icon = require('@/assets/icon/eye.png')
                break
              case 5:
                ele.icon = require('@/assets/icon/apply.png')
                break
              case 6:
                ele.icon = require('@/assets/icon/sale.png')
                break
              case 7:
                ele.icon = require('@/assets/icon/bag.png')
                break
              case 8:
                ele.icon = require('@/assets/icon/percent0.png')
                break
              case 9:
                ele.icon = require('@/assets/icon/live.png')
                break
              case 10:
                ele.icon = require('@/assets/icon/form.png')
                break
              case 11:
                ele.icon = require('@/assets/icon/bag.png')
                break
              case 12:
                ele.icon = require('@/assets/icon/only.png')
                break
              case 13:
                ele.icon = require('@/assets/icon/bag.png')
                break
              case 14:
                ele.icon = require('@/assets/icon/ticket.png')
                break
              case 15:
                ele.icon = require('@/assets/icon/ticket.png')
                break
              case 16:
                ele.icon = require('@/assets/icon/percent1.png')
                break
              case 17:
                ele.icon = require('@/assets/icon/percent2.png')
                break
              case 18:
                ele.icon = require('@/assets/icon/handshake.png')
                break
              default:
                ele.icon = require('@/assets/icon/apply2.png')
            }
          })
          this.activity_data = activity

          // 模块
          modules.forEach(ele => {
            switch (ele.type) {
              case 'module_0':
                ele.icon = require('@/assets/icon/chapter1.png')
                break
              case 'module_1':
                ele.icon = require('@/assets/icon/fire.png')
                break
              case 'module_2':
                ele.icon = require('@/assets/icon/ticket_0.png')
                break
              case 'module_3':
                ele.icon = require('@/assets/icon/alarm.png')
                break
              case 'module_4':
                ele.icon = require('@/assets/icon/alarm.png')
                break
              case 'module_5':
                ele.icon = require('@/assets/icon/money.png')
                break
              case 'module_6':
                ele.icon = require('@/assets/icon/ticket_0.png')
                break
              case 'module_7':
                ele.icon = require('@/assets/icon/chapter1.png')
                break
              case 'module_8':
                ele.icon = require('@/assets/icon/ranking.png')
                break
              case 'module_9':
                ele.icon = require('@/assets/icon/conversion.png')
                break
              case 'module_10':
                ele.icon = require('@/assets/icon/award.png')
                break
              case 'module_11':
                ele.icon = require('@/assets/icon/gift.png')
                break
              case 'module_12':
                ele.icon = require('@/assets/icon/chapter1.png')
                break
              case 'module_13':
                ele.icon = require('@/assets/icon/chapter.png')
                break
              default:
                ele.icon = require('@/assets/icon/chapter1.png')
            }
          })
          this.module_data = modules

          // 素材库
          material.forEach(ele => {
            switch (ele.type) {
              case 'sms':
                ele.icon = require('@/assets/icon/sms.png')
                break
              case 'music':
                ele.icon = require('@/assets/icon/music.png')
                break
              case 'wechat':
                ele.icon = require('@/assets/icon/wechat.png')
                break
              default:
                ele.icon = require('@/assets/icon/wechat.png')
            }
          })
          this.material_data = material
        }

        // 所有 - 主办方
        if (this.status === 1) {
          res.data.forEach(value => {
            switch (value.type) {
              case 1:
                value.icon = require('@/assets/icon/apply2.png')
                break
              case 2:
                value.icon = require('@/assets/icon/live2.png')
                break
              case 3:
                value.icon = require('@/assets/icon/live2.png')
                break
              case 4:
                value.icon = require('@/assets/icon/eye.png')
                break
              case 5:
                value.icon = require('@/assets/icon/apply.png')
                break
              case 6:
                value.icon = require('@/assets/icon/sale.png')
                break
              case 7:
                value.icon = require('@/assets/icon/bag.png')
                break
              case 8:
                value.icon = require('@/assets/icon/percent0.png')
                break
              case 9:
                value.icon = require('@/assets/icon/live.png')
                break
              case 10:
                value.icon = require('@/assets/icon/form.png')
                break
              case 11:
                value.icon = require('@/assets/icon/bag.png')
                break
              case 12:
                value.icon = require('@/assets/icon/only.png')
                break
              case 13:
                value.icon = require('@/assets/icon/bag.png')
                break
              case 14:
                value.icon = require('@/assets/icon/ticket.png')
                break
              case 15:
                value.icon = require('@/assets/icon/ticket.png')
                break
              case 16:
                value.icon = require('@/assets/icon/percent1.png')
                break
              case 17:
                value.icon = require('@/assets/icon/percent2.png')
                break
              case 18:
                value.icon = require('@/assets/icon/handshake.png')
                break
              default:
                value.icon = require('@/assets/icon/apply2.png')
            }
          })
          this.activity_allData = res.data
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
