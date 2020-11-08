<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="live-goods-container">
        <div class="live-goods-wrap">
          <div v-if="false" class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
          <div class="goods-table clearfix">
            <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
            <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addGoodsAction">新增商品</el-button>
            <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
              <template v-slot:default>
                <live-goods-table :goods-table-data="goodsTableData" :page-date="pageData" :set-path-data="setPathData" @handleDeleteAction="handleDeleteAction" />
              </template>
            </pagination-section>
          </div>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import LiveGoodsTable from './components/goodsTable/index'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { goodsList, goodsDelete } from '@/api/activityManage/marketModuleSet'
import { goodsTypeData } from '@/utils/data'

export default {
  name: 'LiveGoods',
  components: {
    LayoutSubChild,
    LiveGoodsTable,
    PaginationSection
  },
  data() {
    return {
      routeName: 'LiveGoods',
      setPathData: '/activityManage/liveSet/liveGoods/goodsSet',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      goodsTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getGoodsList()
    }
  },
  methods: {
    getGoodsList() {
      goodsList({ ...this.pageData, activityId: this.activityData.id, type: goodsTypeData.live }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.goodsTableData = data
      })
    },
    prevStepAction() {
      navigatePath('/activityManage/liveSet/anchorSet')
    },
    nextStepAction() {
      navigatePath('/activityManage/liveSet/liveList')
    },
    addGoodsAction() {
      navigatePath(this.setPathData)
    },
    handleDeleteAction(scope) {
      goodsDelete({ activityId: this.activityData.id, goodsId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getGoodsList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getGoodsList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .live-goods-container{
    .live-goods-wrap{
      &>div{
        padding: 12px 0;
        background: #FFF;
      }
      .step-list{
        text-align: right;
        .el-button:last-child{
          margin-right: 12px;
        }
      }
      .goods-table{
        margin-top: 12px;
        .el-button{
          margin: 0 12px 12px;
        }
        .delete-button{
          float: left;
        }
        .add-button{
          float: right;
        }
      }
    }
  }
</style>
