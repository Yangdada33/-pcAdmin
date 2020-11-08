<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="preview-data-container">
    <el-row class="preview-header" type="flex" justify="space-between" align="middle">
      <breadcrumb />
      <div>
        <span class="sponsor-title">
          <span>当前主办方：</span>
          <span class="title">{{ sponsorName }}</span>
        </span>
        <el-button class="back-sponsor-list" type="primary" size="small" @click="backSponsorListAction">返回主办方列表</el-button>
      </div>
    </el-row>
    <activity-list :sponsor-id="sponsorId" />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import ActivityList from '@/components/ActivityList'
import { navigatePath } from '@/router'

export default {
  name: 'PreviewActivity',
  components: {
    Breadcrumb,
    ActivityList
  },
  props: {
    sponsorId: {
      type: String,
      default: ''
    },
    sponsorName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    backSponsorListAction() {
      navigatePath({
        backStatus: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .sponsor-title{
    padding-right: 12px;
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
</style>

<style lang="scss">
  .activity-list-container{
    .module-section-container{
      .section-header{
        padding-top: 0;
      }
    }
  }
</style>
