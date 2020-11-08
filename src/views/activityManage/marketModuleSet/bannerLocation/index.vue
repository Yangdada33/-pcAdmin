<template>
  <div class="banner-location-container">
    <div class="banner-location-wrap">
      <div class="location-header">
        <span>注：选择您想要插入广告图的位置插入您的广告图, <i class="el-icon-picture-outline" />表示可以设置模块内广告图</span>
      </div>
      <div class="location-section">
        <el-form ref="form" :model="form" label-width="120px" size="small">
          <el-form-item label="广告图位置：">
            <ul class="section-list">
              <li
                v-for="(item, index) in sectionList"
                :key="item.id"
                :class="['section-item', (!item.marketing_module_id || moduleTypeData[item.marketing_module_id]) ? 'click-able' : '']"
                @click="sectionClickAction(index, item)"
              >
                <span v-if="item.marketing_module_id">
                  <i v-if="moduleTypeData[item.marketing_module_id]" class="el-icon-picture-outline" />
                  <span> {{ item.name }}</span>
                </span>
                <template v-else>
                  <template v-if="item.adv_id">
                    <el-image
                      style="display: block; width: 100%; height: 100%"
                      fit="cover"
                      :src="item.url"
                    />
                    <i class="el-icon-delete" @click.stop="bannerRemoveAction(index)" />
                  </template>
                  <span v-else>{{ item.name }}</span>
                </template>
              </li>
            </ul>
          </el-form-item>
          <el-form-item class="action-list">
            <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
            <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog title="广告图库" :visible.sync="bannerDialogVisible" width="55%" center>
      <el-row v-if="bannerList.length" class="banner-list" type="flex">
        <div v-for="(item,index) in bannerList" :key="item.img.id" class="banner-item">
          <el-image
            :src="item.img.url"
            style="width: 150px; height: 150px;border-radius: 8px"
            fit="cover"
          />
          <div class="tip">
            <el-button type="primary" size="small" @click="bannerSelectedAction(index)">选 择</el-button>
          </div>
        </div>
      </el-row>
      <div v-else class="empty-message">暂无广告图</div>
    </el-dialog>

    <el-dialog title="模块内广告" :visible.sync="moduleDialogVisible" width="55%" center>
      <el-row class="module-list" type="flex">
        <div v-for="(item,index) in moduleList" :key="index" class="module-item" @click="moduleChangeAction(index)">
          <el-image v-if="item.id" :src="item.url" fit="cover" class="avatar" />
          <span v-else>选择广告图</span>
        </div>
      </el-row>
      <div class="moduleSaveAction">
        <el-button type="primary" size="small" @click="moduleSaveAction">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stepAction } from '../utils/index'
import { bannerData, bannerSectionData, bannerSectionSet, moduleBannerList, moduleBannerSet } from '@/api/activityManage/marketModuleSet'

export default {
  name: 'BannerLocation',
  data() {
    return {
      loading: false,
      sectionList: [],
      sectionIndex: '',
      bannerList: [],
      form: {},
      bannerDialogVisible: false,
      moduleDialogVisible: false,
      moduleTypeData: { 2: 3, 3: 5, 4: 2, 5: 1 },
      moduleType: '',
      moduleList: [],
      moduleIndex: ''
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  async created() {
    await this.getBannerSectionData()
    this.getBannerData()
  },
  methods: {
    getBannerSectionData() {
      return new Promise((resolve, reject) => {
        bannerSectionData(this.activityData.id).then(response => {
          const resultData = response.data
          if (resultData && response.data.length) {
            this.sectionList = resultData.reduce((total, item, index) => ([...total, { ...item }, {
              id: (item.id + '-' + index),
              name: '插入广告',
              market_id: item.marketing_module_id,
              adv_id: item.adv_info ? item.adv_info.id : '',
              url: item.adv_info ? item.adv_info.img.url : ''
            }]), [])
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    getBannerData() {
      bannerData(this.activityData.id).then(response => {
        const resultData = response.data
        resultData && resultData.length && (this.bannerList = resultData)
      })
    },
    sectionClickAction(index, item) {
      if (!item.marketing_module_id) {
        this.sectionIndex = index
        this.bannerDialogVisible = true
      } else {
        this.moduleType = this.moduleTypeData[item.marketing_module_id]
        moduleBannerList({ activityId: this.activityData.id, type: this.moduleType }).then(response => {
          const resultData = response.data
          if (resultData) {
            this.moduleList = response.data
            this.moduleDialogVisible = true
          } else {
            this.$message.info('该模块内暂无广告位')
          }
        })
      }
    },
    bannerSelectedAction(index) {
      const bannerItem = this.bannerList[index]
      if (!this.moduleDialogVisible) {
        const sectionItem = this.sectionList[this.sectionIndex]
        this.sectionList.splice(this.sectionIndex, 1, {
          ...sectionItem,
          adv_id: bannerItem.id,
          url: bannerItem.img.url
        })
      } else {
        this.moduleList.splice(this.moduleIndex, 1, {
          ...bannerItem.img,
          adv_id: bannerItem.id
        })
      }
      this.bannerList.splice(index, 1, bannerItem)
      this.bannerDialogVisible = false
    },
    bannerRemoveAction(index) {
      const sectionItem = this.sectionList[index]
      this.sectionList.splice(index, 1, {
        id: sectionItem.id,
        name: '插入广告',
        market_id: sectionItem.market_id,
        adv_id: '',
        url: ''
      })
    },
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.loading = true
      bannerSectionSet({
        activityId: this.activityData.id,
        sectionList: this.sectionList.filter((item, index) => (index % 2 === 1))
      }).then(response => {
        this.$message.success(response.msg)
        this.loading = false
        stepAction('next')
      }).catch(() => {
        this.loading = false
      })
    },
    moduleChangeAction(index) {
      this.moduleIndex = index
      this.bannerDialogVisible = true
    },
    moduleSaveAction() {
      moduleBannerSet({ activityId: this.activityData.id, type: this.moduleType, moduleList: this.moduleList.map(item => item.adv_id) }).then(response => {
        this.$message.success(response.msg)
        this.moduleDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner-location-container{
    .banner-location-wrap{
      background: #FFF;
      .location-header{
        padding: 12px 0;
        border-bottom: 1px solid #EEE;
        font-size: 14px;
        font-weight: 400;
        color: #FF4478;
        line-height: 33px;
        span{
          padding-left: 12px;
        }
      }
      .location-section{
        padding: 20px 20px 12px;
        .section-list{
          margin: 0;
          padding-left: 12px;
          .section-item{
            position: relative;
            width: 160px;
            min-height: 40px;
            margin-bottom: 12px;
            border-radius: 2px;
            text-align: center;
            line-height: 40px;
            list-style: none;
            &.click-able{
              cursor: pointer;
              user-select: none;
            }
            &:nth-child(2n + 1){
              background: #545454;
              border: 1px solid #545454;
              color: #FFF;
            }
            &:nth-child(2n+2) {
              background: rgba(39, 134, 223, 0.08);
              border: 1px solid #2786DF;
              color: #2786DF;
            }
            .el-icon-delete{
              position: absolute;
              top: 0;
              right: 0;
              padding: 4px;
              background: #000;
              font-size: 18px;
              color: #FFF;
            }
          }
        }
        .action-list{
          .el-button:first-child{
            // margin-left: 24px
            margin-left: 65px;
          }
        }
      }
    }

    .el-dialog{
      .banner-list{
        padding: 20px;
        .banner-item{
          margin: 12px 13px;
          .tip{
            margin: 8px 0 0;
            text-align: center;
          }
        }
      }
      .empty-message{
        padding: 50px 0;
        text-align: center;
      }

      .module-list{
        padding: 0 24px 12px;
        .module-item{
          width: 120px;
          height: 120px;
          border: 1px solid #DDD;
          text-align: center;
          cursor: pointer;
          .el-image{
            width: 100%;
            height: 100%;
          }
          span{
            line-height: 120px;
          }
        }
      }
      .moduleSaveAction{
        padding-bottom: 12px;
        text-align: center;
      }
    }
  }
</style>

<style lang="scss">
  .banner-location-container{
    .el-dialog{
      .el-dialog__header{
        padding: 15px 0;
      }
    }
  }
</style>
