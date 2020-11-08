<template>
  <div class="sponsor-filter">
    <slot name="form-top" />
    <el-form ref="sponsorSearchForm" :inline="true" :model="sponsorSearchForm" class="demo-form-inline" size="mini" label-width="60px" label-position="left">
      <el-row class="filter-item" type="flex" justify="start" align="middle">
        <el-form-item label="时间：">
          <el-button
            v-for="(item, index) in timeTypeList"
            :key="index"
            :type="index === sponsorSearchForm.type ? 'primary' : 'default'"
            size="mini"
            @click="timeTypeSelectedAction(index)"
          >{{ item }}</el-button>
        </el-form-item>
        <el-form-item class="date-range">
          <el-date-picker
            v-model="sponsorSearchForm.rangeTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            @change="timePickerSelectedAction"
          />
        </el-form-item>
      </el-row>
      <el-row class="filter-item" type="flex" justify="start" align="middle">
        <el-form-item label="搜索：">
          <el-input v-model="sponsorSearchForm.keyword" :placeholder="placeholder" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!sponsorSearchForm.keyword" type="primary" @click="onSponsorSearchAction">搜索</el-button>
          <el-button :disabled="!sponsorSearchForm.keyword" type="primary" @click="onSponsorClearAction">清空</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SponsorSearch',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data() {
    return {
      timeTypeList: ['全部', '近一周', '近一个月', '近三个月', '近一年'],
      sponsorSearchForm: {
        type: 0,
        rangeTime: [],
        keyword: ''
      }
    }
  },
  methods: {
    timeTypeSelectedAction(index) {
      this.sponsorSearchForm.rangeTime = ''
      this.sponsorSearchForm.type = index
      const timeList = []

      switch (index) {
        case 0:
          break
        case 1:
          timeList.push(this.getDay(-7))
          timeList.push(this.getDay(0))
          break
        case 2:
          timeList.push(this.getDay(-30))
          timeList.push(this.getDay(0))
          break
        case 3:
          timeList.push(this.getDay(-90))
          timeList.push(this.getDay(0))
          break
        case 4:
          timeList.push(this.getDay(-365))
          timeList.push(this.getDay(0))
          break
      }

      this.sponsorSearchForm.timeList = timeList
      this.$emit('timeTypeList', this.sponsorSearchForm)
    },
    timePickerSelectedAction(value) {
      if (value) { // 确定
        this.sponsorSearchForm.type = ''
        this.sponsorSearchForm.rangeTime = value
        this.sponsorSearchForm.timeList = this.sponsorSearchForm.rangeTime.map(item => (new Date(item).getTime() / 1000))
      } else { // 清空
        this.sponsorSearchForm.type = 0
        this.sponsorSearchForm.rangeTime = []
        this.sponsorSearchForm.timeList = []
        console.log(this.sponsorSearchForm)
      }
      this.$emit('timeTypeList', this.sponsorSearchForm)
    },
    onSponsorSearchAction() {
      const { type, rangeTime } = this.sponsorSearchForm
      let timeList = []
      if (rangeTime.length) {
        timeList = this.sponsorSearchForm.rangeTime.map(item => (new Date(item).getTime() / 1000))
      } else {
        if (type) {
          const nowTime = new Date().getTime() / 1000
          const dayTime = 24 * 60 * 60
          const timeDiffList = [0, 7 * dayTime, 30 * 7 * dayTime, 365 * 7 * dayTime]
          timeList = [Math.round(nowTime - timeDiffList[type - 1]), Math.round(nowTime)]
        }
      }
      this.sponsorSearchForm.timeList = timeList
      this.$emit('searchAction', this.sponsorSearchForm)
    },
    onSponsorClearAction() {
      // this.sponsorSearchForm = { type: 0, rangeTime: [], keyword: '' }
      this.sponsorSearchForm = { ...this.sponsorSearchForm, keyword: '' }
      this.$emit('searchAction', this.sponsorSearchForm)
    },
    getDay(day) {
      const today = new Date()
      const time = today.getTime() + 1000 * 60 * 60 * 24 * day
      return Math.round(time / 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .sponsor-filter{
    margin-top: 6px;
    padding: 12px 0;
    background: #FFF;
    .el-form{
      .el-form-item:first-child{
        width: 100%;
      }
      .el-row{
        .el-form-item{
          width: auto;
        }
        .date-range{
          margin-left: 20px;
        }
      }
      .filter-item{
        flex-wrap: wrap;
        margin: 8px 12px;
        padding: 6px 12px;
        border: 1px solid rgba(151,151,151,0.5);
        border-radius:5px;
        &>.el-form-item{
          margin: 2px 20px 2px 0;
          .el-form-item{
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
