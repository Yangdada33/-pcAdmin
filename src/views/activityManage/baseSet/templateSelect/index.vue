<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="TemplateSelect">
    <template v-slot:default>
      <div class="template-select-container">
        <el-row class="template-list" type="flex">
          <template v-for="(value, key) in templateList">
            <div v-for="item in value" :key="key + '-' + item.id" :class="['template-item', {'active': templateKey === (key + '-' + item.id)}]">
              <div :style="`background: url('${item.preview_image}') no-repeat left top/100% 100%`" class="picture" title="点击预览大图" @click="previewAction(item)" />
              <div class="title">{{ item.name }}</div>
              <el-button v-if="templateKey === (key + '-' + item.id)" type="primary" size="mini">当前模板</el-button>
              <el-button v-else :loading="templateSelectedId === item.id" type="warning" size="mini" @click="templateSelectAction(key, item.id)">立即使用</el-button>
            </div>
          </template>
        </el-row>

        <el-dialog :visible.sync="dialogVisible" width="400px">
          <div style="padding-bottom: 10px">
            <h4>
              <span style="padding-left: 20px">预览图</span>
            </h4>
            <div style="width: 400px;height: 650px;overflow-y: auto">
              <el-image style="width: 100%" :src="previewUrl">
                <div slot="placeholder" class="image-slot" style="width: 100%; text-align: center;line-height: 600px; font-size: 18px">
                  <i class="el-icon-loading" style="color: #409EFF;" />
                </div>
              </el-image>
            </div>
          </div>
        </el-dialog>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import { navigatePath, activitySetModuleList } from '@/router'
import { activityBaseAdd, activityBaseEdit } from '@/api/activityManage/baseSet'

export default {
  name: 'TemplateSelect',
  components: {
    LayoutSubChild
  },
  data() {
    return {
      templateKey: '',
      templateSelectedId: '',
      dialogVisible: false,
      previewUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'templateList',
      'moduleList'
    ])
  },
  created() {
    this.getActivityTemplateList()
  },
  methods: {
    async getActivityTemplateList() {
      await this.$store.dispatch('activity/setTemplateList')
      this.activityData.id && (this.templateKey = this.activityData.style_id + '-' + this.activityData.theme_id)
    },
    templateSelectAction(key, id) {
      this.templateSelectedId = id
      const requestName = !this.activityData.id ? activityBaseAdd : activityBaseEdit
      requestName({
        id: this.activityData.id,
        activity_id: this.activityData.id,
        style_id: Number(key),
        theme_id: id
      }).then(response => {
        this.$message.success(response.msg)
        this.templateSelectedId = ''
        this.templateKey = key + '-' + id
        const activityData = {
          ...this.activityData,
          id: response.data || this.activityData.id,
          style_id: Number(key),
          theme_id: id
        }
        this.$store.commit('activity/setActivityData', activityData)
        this.$store.commit('activity/setModuleList', activitySetModuleList)
        navigatePath('/activityManage/baseSet/templateSelect/templatePreview?templateKey=' + this.templateKey)
      }).catch(() => {
        this.templateSelectedId = ''
      })
    },
    previewAction(item) {
      this.previewUrl = item.image
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .template-select-container{
    .template-list{
      flex-wrap: wrap;
      padding: 18px 10px;
      background: #FFF;
      .template-item {
        line-height: 20px;
        min-width: 140px;
        width: calc((100% - 128px) / 8 + 16px);
        padding: 12px 8px;
        font-size:14px;
        font-weight:400;
        color:rgba(51,51,51,1);
        text-align: center;
        .picture{
          height: 200px;
          cursor: pointer;
        }
        .title{
          padding: 2px 0 6px;
        }
        .el-button{
          width: 100%;
          margin: 0;
          background:linear-gradient(180deg,rgba(253,231,149,1) 0%,rgba(255,211,106,1) 100%);
          border: transparent;
          color: #333;
        }
        &.active{
          border-radius: 2px;
          box-shadow: 0 0 4px $themeColor;
          .el-button{
            background:linear-gradient(180deg,rgba(120,172,255,1) 0%,rgba(0,117,255,1) 100%);
            color: #FFF;
          }
        }
      }
    }
  }
</style>
