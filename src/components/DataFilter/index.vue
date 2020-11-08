<template>
  <div class="data-filter-container">
    <el-button
      v-for="(item, index) in typeList"
      :key="item.value"
      :type="index === typeIndex ? 'primary' : 'default'"
      size="mini"
      @click="typeSelectedAction(index)"
    >{{ item.label }}</el-button>

    <el-date-picker
      v-if="searchTimeType===0"
      v-model="rangeTime"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="mini"
      align="right"
      @change="affirmTime"
    />
    <el-button v-if="searchTimeType===0" type="primary" size="mini" :disabled="status" @click="search">搜索</el-button>
  </div>
</template>

<script>
export default {
  name: 'DataFilter',
  props: {
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeIndex: {
      type: Number,
      default: 0
    },
    searchTimeType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rangeTime: [],
      searchTime: {
        start: '',
        end: ''
      },
      status: true
    }
  },
  methods: {
    typeSelectedAction(index) {
      this.$emit('dataFilterType', index)
    },
    affirmTime(value) {
      if (value) { // 确定
        this.rangeTime = value
        this.status = false
      } else { // 清空
        this.rangeTime = []
        this.status = true

        this.$emit('timeEmpty', 0)
      }
    },
    search() {
      this.searchTime.start = Math.round(new Date(this.rangeTime[0]) / 1000)
      this.searchTime.end = Math.round(new Date(this.rangeTime[1]) / 1000)
      this.$emit('timeList', this.searchTime)
    }
  }
}
</script>

<style lang="scss" scoped>
  .data-filter-container{
    .el-button{
      margin: 2px 4px;
    }

    .el-range-editor--mini.el-input__inner{
      margin: 0 15px;
    }
  }
</style>
