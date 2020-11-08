<template>
  <div class="point-time-set-container">
    <div class="point-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择秒杀开始时间"
          />
        </el-form-item>
        <el-form-item label="持续时间：" prop="keepHour">
          <el-input-number v-model="form.keepHour" :min="0" />
          <div class="form-tip">注：单位小时</div>
        </el-form-item>
        <el-form-item label="商品关联：" prop="selectList">
          <el-transfer
            v-model="form.selectList"
            filterable
            :titles="['所有商品', '已选商品']"
            :data="goodsList"
            :props="transferProps"
            :filter-method="filterMethod"
            filter-placeholder="请输入城市拼音"
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
  name: 'PointTimeSet',
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
        startTime: '',
        keepHour: 1,
        selectList: []
      },
      rules: {
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
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
      const { id, start_time, keep, goods_arr } = this.goodsTimeData
      this.form = {
        id,
        startTime: string2Date(start_time),
        keepHour: keep,
        selectList: goods_arr.map(item => Number(item))
      }
    },
    getGoodsList() {
      goodsTimeListWidthNoPage({ activityId: this.activityData.id, timeType: goodsTypeData.point }).then(response => {
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
          const { startTime, keepHour, selectList } = this.form
          this.loading = true
          goodsTimeSet({
            activityId: this.activityData.id,
            timeType: 1,
            goodsTimeId: this.goodsTimeId,
            startTime: parseTime(startTime),
            keepHour,
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
  .point-time-set-container{
    .point-wrap{
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
