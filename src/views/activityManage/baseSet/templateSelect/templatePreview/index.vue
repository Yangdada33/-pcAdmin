<template>
  <div class="template-preview-container">
    <el-row class="preview-list" type="flex" justify="space-between">
      <div class="title">模板预览</div>
      <div class="action-list">
        <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
        <el-button type="primary" size="mini" @click="nextStepAction">立即制作</el-button>
      </div>
    </el-row>
    <div class="preview-picture">
      <img :src="templateUrl" alt="">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'

export default {
  name: 'TemplatePreview',
  data() {
    return {
      templateUrl: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    if (to.query.templateKey) {
      next()
    } else {
      next('/activityManage/baseSet/contentSet')
    }
  },
  computed: {
    ...mapGetters([
      'templateList'
    ])
  },
  created() {
    if (!Object.keys(this.templateList).length) {
      this.prevStepAction()
    } else {
      const [styleId, themeId] = this.$route.query.templateKey.split('-')
      this.templateUrl = this.templateList[styleId].find(item => item.id === Number(themeId)).image
    }
  },
  methods: {
    prevStepAction() {
      navigatePath('/activityManage/baseSet/templateSelect')
    },
    nextStepAction() {
      navigatePath('/activityManage/baseSet/contentSet')
    }
  }
}
</script>

<style lang="scss" scoped>
  .template-preview-container{
    .preview-list{
      padding: 16px 0;
      font-size:18px;
      font-weight:600;
      color:rgba(51,51,51,1);
      .action-list{
        .el-button{
          margin-left: 12px;
        }
      }
    }
    .preview-picture{
      padding:36px 0;
      background: #FFF;
      text-align: center;
      img{
        width:28%;
      }
    }
  }
</style>
