<template>
  <div class="goods-filter-container">
    <el-form :inline="true" :model="searchData" class="demo-form-inline clearfix" size="mini">
      <el-form-item label="所属品牌：">
        <el-select v-model="searchData.brandId" filterable placeholder="请选择所属品牌">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchData.goodsName" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onGoodsSearchAction">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <slot />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { brandList } from '@/api/activityManage/marketModuleSet'
import { EventBus } from '@/utils/eventBus'

export default {
  name: 'GoodsFilter',
  data() {
    return {
      brandList: [{ id: 0, name: '全部' }],
      searchData: {
        goodsName: '',
        brandId: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getBrandList()
  },
  methods: {
    getBrandList() {
      brandList(this.activityData.id).then(response => {
        const resultData = response.data
        if (resultData && resultData.length) {
          this.brandList = [...this.brandList, ...response.data]
        }
      })
    },
    onGoodsSearchAction() {
      EventBus.$emit('onGoodsSearchAction', this.searchData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-filter-container{
    padding: 12px;
    background: #FFF;
    .el-form-item{
      margin: 2px 8px;
      &:last-child{
        float: right;
        margin-right: 0;
      }
    }
  }
</style>
