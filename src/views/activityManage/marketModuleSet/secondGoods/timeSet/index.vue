<template>
  <div class="second-time-set-container">
    <div class="second-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="秒杀时间：" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            style="width: 360px;"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item label="商品关联：" prop="selectList">
          <el-transfer
            v-model="form.selectList"
            filterable
            :titles="['所有商品', '已选商品']"
            :data="goodsList"
            :props="transferProps"
            :filter-method="filterMethod"
            filter-placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import { goodsTimeListWidthNoPage, goodsTimeSet } from '@/api/activityManage/marketModuleSet'
import { parseTime, string2Date } from '@/utils/index'
import { goodsTypeData } from '@/utils/data'

export default {
  name: 'SecondTimeSet',
  props: {
    goodsTimeId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateArray = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        const msgData = {
          timeRange: '请选择秒杀时间',
          selectList: '请选择关联商品'
        }
        callback(new Error(msgData[rule.field]))
      }
    }
    return {
      loading: false,
      goodsList: [],
      transferProps: {
        key: 'id',
        label: 'goods_name',
        disabled: false
      },
      form: {
        timeRange: [],
        selectList: []
      },
      rules: {
        timeRange: [{ required: true, validator: validateArray, trigger: 'blur' }],
        selectList: [{ required: true, validator: validateArray, trigger: 'blur' }]
      },
      filterMethod(query, item) {
        return item.goods_name.indexOf(query) > -1
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'goodsTimeData'
    ])
  },
  created() {
    this.goodsTimeId && this.getGoodsTimeData()
    this.getGoodsList()
  },
  methods: {
    getGoodsTimeData() {
      const { id, start_time, end_time, goods_arr } = this.goodsTimeData
      this.form = {
        id,
        timeRange: [string2Date(start_time), string2Date(end_time)],
        selectList: goods_arr.map(item => Number(item))
      }
    },
    getGoodsList() {
      goodsTimeListWidthNoPage({ activityId: this.activityData.id, timeType: goodsTypeData.second }).then(response => {
        this.goodsList = response.data
      })
    },
    prevStepAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { timeRange: [startTime, endTime], selectList } = this.form
          this.loading = true
          goodsTimeSet({
            activityId: this.activityData.id,
            timeType: 2,
            goodsTimeId: this.goodsTimeId,
            startTime: parseTime(startTime),
            endTime: parseTime(endTime),
            goodsIdList: selectList
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.prevStepAction()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .second-time-set-container{
    .second-wrap{
      padding:24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 220px;
        }
      }
    }
  }
</style>
