<template>
  <div class="layout-sub-container">
    <el-row class="layout-sub-header" type="flex" justify="space-between" align="middle">
      <breadcrumb />
      <el-row type="flex" align="middle">
        <div class="info-detail">
          <span v-if="activityData.id" class="activity-title">
            <span>当前活动：</span>
            <span class="title">{{ activityData.name }}</span>
          </span>
        </div>
        <template v-if="$route.meta.headerData">
          <div v-if="$route.meta.headerData.type === 'back'" class="back-action">
            <el-button type="primary" size="mini" @click="backPageAction">返回{{ $route.meta.headerData.title }}</el-button>
          </div>
        </template>
      </el-row>
    </el-row>
    <router-view class="layout-sub-content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import { navigatePath } from '@/router'

export default {
  name: 'LayoutSub',
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  methods: {
    backPageAction() {
      navigatePath({
        backStatus: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .layout-sub-container{
    .layout-sub-header{
      .info-detail{
        margin: 10px 0;
        &>span{
          padding-left: 12px;
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
      }
      .el-button{
        margin-left: 16px;
      }
    }
  }
</style>
