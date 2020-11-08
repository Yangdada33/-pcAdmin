<template>
  <div class="goods-table-container">
    <el-table
      ref="multipleTable"
      :data="setPathData? goodsTableData : newGoodsTableData"
      style="width: 100%;"
      size="small"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <el-table-column
        v-if="false"
        type="selection"
        width="60"
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
        min-width="120"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="goods_image.url"
        label="商品图片"
        width="120"
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
      <el-table-column
        prop="activityName"
        label="所属活动"
        min-width="120"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template>
          <span>{{ activityData.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="brand_name"
        label="所属品牌"
        min-width="120"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="old_price"
        label="原价"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="ms_price"
        :label="formatPriceData.title"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-link v-if="Number(scope.row.status)" :underline="false" type="success" style="cursor: default">已上架</el-link>
          <el-link v-else :underline="false" type="warning" style="cursor: default">已下架</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="80"
        align="center"
        header-align="center"
      />
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="Number(scope.row.status) ? '下架' : '上架'" placement="top">
            <el-popconfirm :title="`确定${Number(scope.row.status) ? '下架' : '上架'}吗？`" @onConfirm="handleSaleAction(scope)">
              <svg-icon slot="reference" :icon-class="Number(scope.row.status) ? 'table_icon_down' : 'table_icon_up'" class-name="table-action" />
            </el-popconfirm>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-popconfirm title="确定删除吗？" @onConfirm="handleDeleteAction(scope)">
              <svg-icon slot="reference" icon-class="table_icon_delete" class-name="table-action" />
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import { goodsList, goodsSale } from '@/api/activityManage/marketModuleSet'
import { goodsTypeData } from '@/utils/data'
import { EventBus } from '@/utils/eventBus'

export default {
  name: 'GoodsTable',
  props: {
    goodsType: {
      type: String,
      default: ''
    },
    pageData: {
      type: Object,
      default: function() {
        return { index: 1, size: 10, total: 0 }
      }
    },
    setPathData: {
      type: String,
      default: ''
    },
    multipleSelection: {
      type: Array,
      default: function() {
        return []
      }
    },
    newGoodsTableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      searchData: {
        goodsName: '',
        brandId: ''
      },
      goodsTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ]),
    formatPriceData() {
      const { name } = this.$route
      const priceDataData = [
        { type: 'HotGoods', name: 'hotPrice', title: '爆款价' },
        { type: 'SpecialGoods', name: 'specialPrice', title: '特价' },
        { type: 'SecondGoods', name: 'secondPrice', title: '秒杀价' },
        { type: 'PointGoods', name: 'pointPrice', title: '秒杀价' }
      ]
      return priceDataData.find(item => name.startsWith(item.type))
    }
  },
  created() {
    this.goodsType && this.getGoodsList()
  },
  mouonted() {
    EventBus.$on('onGoodsSearchAction', (searchData) => {
      this.searchData = searchData
      this.getGoodsList()
    })
    EventBus.$on('onTableDataAction', () => {
      this.getGoodsList()
    })
  },
  beforeDestroy() {
    EventBus.$off('onGoodsSearchAction')
  },
  methods: {
    getGoodsList() {
      goodsList({
        ...this.pageData,
        activityId: this.activityData.id,
        type: goodsTypeData[this.goodsType],
        ...this.searchData
      }).then(response => {
        const { data, total } = response.data
        this.$emit('onTablePageAction', { ...this.pageData, total })
        this.goodsTableData = data
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value)
    },
    handleSaleAction(scope) {
      goodsSale({ goodsId: scope.row.id, type: 1 - Number(scope.row.status) }).then(response => {
        this.$message.success(response.msg)
        this.getGoodsList()
      })
    },
    handleEditAction(scope) {
      if (this.setPathData) {
        navigatePath(this.setPathData + '?id=' + scope.row.id)
      } else {
        console.log('设置页面编辑!')
      }
    },
    handleDeleteAction(scope) {
      this.$emit('handleDeleteAction', scope)
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-table-container{
    .el-table{
      border-top: 1px solid #EBEEF5;
      .table-action{
        margin: 0 8px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
</style>
