<template>
  <div class="goods-set-container">
    <div class="goods-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <!--
        <el-form-item label="直播商品：" style="width: 580px">
          <PaginationSection :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              border
              size="mini"
              @select="handleChange"
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
                header-align="center"
              />
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
                header-align="center"
                :index="indexMethod"
              />
              <el-table-column
                prop="goods_name"
                label="商品名称"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="goods_image.url"
                label="商品图片"
                width="80"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    placement="right-end"
                    width="200"
                    trigger="hover"
                  >
                    <el-image
                      style="display: block;max-width: 360px; max-height: 360px"
                      fit="cover"
                      :src="scope.row.goods_image.url"
                    />
                    <el-image
                      slot="reference"
                      style="display:block;width: 32px; height: 32px;margin: auto;"
                      fit="cover"
                      :src="scope.row.goods_image.url"
                    />
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </PaginationSection>
        </el-form-item>
        -->
        <el-form-item label="直播商品：" prop="selectList">
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
          <el-button type="primary" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import PaginationSection from '@/components/PaginationSection'
// import { goodsList } from '@/api/activityManage/marketModuleSet'
import { goodsTimeListWidthNoPage } from '@/api/activityManage/marketModuleSet'
import { liveGoodsIdList, liveGoodsIdSet } from '@/api/activityManage/liveSet'
import { goodsTypeData } from '@/utils/data'

export default {
  name: 'LiveGoodsSet',
  components: {
    // PaginationSection
  },
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateArray = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请选择秒杀时间'))
      }
    }
    return {
      loading: false,
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      goodsList: [],
      transferProps: {
        key: 'id',
        label: 'goods_name',
        disabled: false
      },
      form: {
        selectList: []
      },
      rules: {
        selectList: [{ required: true, validator: validateArray, trigger: 'blur' }]
      },
      filterMethod(query, item) {
        return item.goods_name.indexOf(query) > -1
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  async created() {
    if (this.liveId) {
      const response = await this.getLiveGoodsIdList()
      response.data && (this.form.selectList = response.data)
    }
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      /*
        goodsList({ ...this.pageData, activityId: this.activityData.id, type: goodsTypeData.live }).then(response => {
          const { data, total } = response.data
          this.pageData.total = total
          this.tableData = data
          this.$nextTick(() => {
            data.forEach(item => {
              const selectItem = this.form.selectList.find(itemVal => itemVal === item.id)
              selectItem && this.$refs['multipleTable'].toggleRowSelection(item, true)
            })
          })
        })
        */
      goodsTimeListWidthNoPage({ activityId: this.activityData.id, timeType: goodsTypeData.live }).then(response => {
        this.goodsList = response.data
      })
    },
    getLiveGoodsIdList() {
      return liveGoodsIdList({ activityId: this.activityData.id, liveId: this.liveId })
    },
    handleChange(value) {
      console.log(value)
      this.form.selectList = value.map(item => item.id)
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getGoodsList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getGoodsList()
    },
    prevStepAction() {
      this.$emit('stepAction', { type: 'prev' })
    },
    formSaveAction() {
      this.loading = true
      liveGoodsIdSet({
        activityId: this.activityData.id,
        liveId: this.liveId,
        goodsIdList: this.form.selectList
      }).then(response => {
        this.$message.success(response.msg)
        this.loading = false
        this.$emit('stepAction', { type: 'next' })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-set-container{
    .goods-wrap{
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 220px;
        }
      }
    }
  }
</style>
