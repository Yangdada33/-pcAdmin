<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="activity-list-container">
    <data-section left-side-bg="linear-gradient(180deg,rgba(126,198,255,1) 0%,rgba(58,120,255,1) 100%)" title="活动列表">
      <template v-slot:default>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="活动列表" name="list">
            <sponsor-search @searchAction="activitySearchAction" @timeTypeList="timeTypeList">
              <template v-slot:form-top>
                <div v-if="!sponsorId" class="button-wrap clearfix">
                  <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addActivityAction">新增活动</el-button>
                </div>
              </template>
            </sponsor-search>
            <div
              v-loading="activityLoadingStatus"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.6)"
              class="activity-list-wrap"
            >
              <pagination-section v-if="activityListData[activeName].length" :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
                <template v-slot:default>
                  <div class="activity-list-list">
                    <div class="activity-list">
                      <div v-for="(item, index) in activityListData[activeName]" :key="item.id" class="activity-item">
                        <el-row class="item-top" type="flex" justify="space-between" align="middle">
                          <el-row class="item-top-left" type="flex" align="middle">
                            <el-image fit="cover" lazy :src="item.main_image.url">
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" />
                              </div>
                            </el-image>
                            <div class="item-top-cont">
                              <div class="theme">
                                <span>活动主题：{{ item.name }}</span>
                                <svg-icon v-if="item.is_live" icon-class="live" />
                              </div>
                              <div class="time-status clearfix">
                                <div class="time">活动时间：{{ item.start_time }} 至 {{ item.end_time }}</div>
                                <div v-if="!item.activity_status" class="status status-ready">活动未开始</div>
                                <div v-else-if="item.activity_status === 1" class="status status-now">活动进行中</div>
                                <div v-else-if="item.activity_status === 2" class="status status-over">活动已结束</div>
                              </div>
                              <div class="sponsor">主办方：{{ item.hoster_info.name }}</div>
                            </div>
                          </el-row>
                          <el-row class="item-top-right" type="flex" align="middle">
                            <div class="action">
                              <el-row>
                                <el-col :span="6">
                                  <div @click="previewPictureAction(index, 'activity')">
                                    <svg-icon icon-class="activity_qrcode" />
                                    <div class="tip">活动二维码</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="activitySetAction(item)">
                                    <svg-icon icon-class="activity_setting" />
                                    <div class="tip">活动设置</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="reviewManageAction(item)">
                                    <svg-icon icon-class="activity_review" />
                                    <div class="tip">审核管理</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="activityCopyAction(item)">
                                    <svg-icon icon-class="activity_copy" />
                                    <div class="tip">一键复制</div>
                                  </div>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="6">
                                  <div @click="previewPictureAction(index, 'kpi')">
                                    <svg-icon icon-class="activity_qrcode" />
                                    <div class="tip">kpi注册码</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="financeManageAction(item)">
                                    <svg-icon icon-class="activity_finance" />
                                    <div class="tip">财务管理</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="noteManageAction(item)">
                                    <svg-icon icon-class="activity_note" />
                                    <div class="tip">短信管理</div>
                                  </div>
                                </el-col>
                                <el-col :span="6">
                                  <div @click="dataExportAction(item)">
                                    <svg-icon icon-class="activity_export" />
                                    <div class="tip">数据导出</div>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
                          </el-row>
                        </el-row>
                        <el-row class="item-bottom" type="flex" style="justify-content: space-between;align-items: center">
                          <div v-if="item.manager_list.length" class="manager">
                            <span>活动管理员：</span>
                            <span v-for="(itemItem,indexIndex) in item.manager_list" :key="indexIndex">
                              <el-popconfirm title="确定取消关联吗？" @onConfirm="unRelateActivityAdminAction(index, indexIndex)">
                                <span slot="reference" style="cursor: pointer">{{ itemItem.true_name }}</span>
                              </el-popconfirm>
                              <span v-if="indexIndex < item.manager_list.length - 1">、</span>
                            </span>
                          </div>
                          <el-button type="primary" plain round icon="el-icon-s-promotion" size="mini" @click="inviteAdminAction(item)">邀请活动管理员</el-button>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </template>
              </pagination-section>
              <div v-else class="empty-message">
                <span v-if="!activityLoadingStatus">暂无活动信息</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="活动草稿" name="temp">
            <sponsor-search @searchAction="activitySearchAction">
              <template v-slot:form-top>
                <div v-if="!sponsorId" class="button-wrap clearfix">
                  <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addActivityAction">新增活动</el-button>
                </div>
              </template>
            </sponsor-search>
            <div
              v-loading="activityLoadingStatus"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.6)"
              class="activity-list-wrap"
            >
              <pagination-section v-if="activityListData[activeName].length" :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
                <div class="activity-list-list">
                  <div class="activity-list">
                    <div v-for="(item,index) in activityListData[activeName]" :key="item.id" class="activity-item">
                      <el-row class="item-top" type="flex" justify="space-between" align="middle">
                        <el-row class="item-top-left" type="flex" align="middle">
                          <el-image fit="cover" lazy :src="item.main_image.url">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline" />
                            </div>
                          </el-image>
                          <div class="item-top-cont">
                            <div class="theme">
                              <span>活动主题：{{ item.name || '暂无' }}</span>
                              <svg-icon v-if="item.is_live" icon-class="live" />
                            </div>
                            <div class="time-status clearfix">
                              <div v-if="item.start_time || item.end_time" class="time">活动时间：{{ item.start_time }} 至 {{ item.end_time }}</div>
                              <div v-else class="time">活动时间：暂无</div>
                              <div v-if="false" class="status" @click="activitySetAction(item)">
                                <i class="el-icon-edit" />
                                <span>活动编辑</span>
                              </div>
                            </div>
                            <div class="sponsor">主办方：{{ item.hoster_info.name }}</div>
                          </div>
                        </el-row>
                        <!--
                        <el-row class="item-top-right publish-activity-wrap" type="flex" align="middle">
                          <el-button :disabled="!item.name" class="publish-activity" type="warning" icon="el-icon-s-promotion" round size="mini" @click="activityPublishAction(item)">发布活动</el-button>
                          <el-button class="delete-activity" type="warning" plain icon="el-icon-delete" round size="mini" @click="activityDeleteAction(item)">删除活动</el-button>
                        </el-row>
                        -->
                        <el-row class="item-top-right" type="flex" align="middle">
                          <div class="picture" @click="previewPictureAction(index, 'kpi')">
                            <!--
                            <el-image fit="contain" lazy :src="item.kpi_qrcode">
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" />
                              </div>
                            </el-image>
                            -->
                            <svg-icon icon-class="activity_qrcode" />
                            <div>kpi注册码</div>
                          </div>
                          <div class="action">
                            <el-row>
                              <el-col :span="12">
                                <div @click="activitySetAction(item)">
                                  <svg-icon icon-class="activity_setting" />
                                  <div class="tip">活动设置</div>
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div @click="activityCopyAction(item)">
                                  <svg-icon icon-class="activity_copy" />
                                  <div class="tip">一键复制</div>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <div @click="financeManageAction(item)">
                                  <svg-icon icon-class="activity_finance" />
                                  <div class="tip">财务管理</div>
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div @click="reviewManageAction(item)">
                                  <svg-icon icon-class="activity_review" />
                                  <div class="tip">审核管理</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </el-row>
                      </el-row>
                      <div class="item-bottom">
                        <el-button class="delete-activity" type="warning" plain icon="el-icon-delete" round size="mini" @click="activityDeleteAction(item)">删除活动</el-button>
                        <el-button :disabled="!item.name" class="publish-activity" type="warning" icon="el-icon-s-promotion" round size="mini" @click="activityPublishAction(item)">发布活动</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </pagination-section>
              <div v-else class="empty-message">
                <span v-if="!activityLoadingStatus">暂无活动信息</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </data-section>

    <el-dialog :show-close="false" :visible.sync="dialogData.status" :width="dialogData.width || '50%'">
      <div v-if="dialogData.type === 'picture'" class="picture-wrap">
        <el-carousel v-if="false" :autoplay="false" arrow="always" style="height: 400px;">
          <el-carousel-item v-for="item in dialogData.pictureList" :key="item.id">
            <el-image fit="contain" :src="item.url" />
          </el-carousel-item>
        </el-carousel>
        <template v-if="dialogData.typeName === 'activity'">
          <h3>活动二维码</h3>
          <el-image style="width: 320px;height: 320px;" :src="dialogData.picture" />
          <div class="info-wrap">
            <div class="info-item clearfix">
              <div class="item-left">活动名称：</div>
              <div class="item-right">{{ dialogData.activityData.name }}</div>
            </div>
            <div class="info-item clearfix">
              <div class="item-left">活动时间：</div>
              <div class="item-right">{{ dialogData.activityData.start_time }} 至 {{ dialogData.activityData.end_time }} </div>
            </div>
            <div class="info-item clearfix">
              <div class="item-left">主办方：</div>
              <div class="item-right">{{ dialogData.activityData.hoster_info.name }}</div>
            </div>
          </div>
        </template>
        <template v-else-if="dialogData.typeName === 'kpi'">
          <h3>员工注册码</h3>
          <el-image style="width: 320px;height: 320px;" :src="dialogData.picture" />
          <div class="info-wrap">
            <div class="info-item clearfix">
              <div class="item-left">活动名称：</div>
              <div class="item-right">{{ dialogData.activityData.name }}</div>
            </div>
            <div class="info-item clearfix">
              <div class="item-left">活动时间：</div>
              <div class="item-right">{{ dialogData.activityData.start_time }} 至 {{ dialogData.activityData.end_time }} </div>
            </div>
            <div class="info-item clearfix">
              <div class="item-left">主办方：</div>
              <div class="item-right">{{ dialogData.activityData.hoster_info.name }}</div>
            </div>
          </div>
        </template>
      </div>
      <div v-else-if="dialogData.type === 'invite'" class="invite-wrap">
        <div class="title">邀请活动管理员</div>
        <el-image class="code" fit="contain" :src="require('@/assets/system/inviteAdminPic.png')" />
        <div v-if="false" class="tip">鼠标右击保存图片发送给活动管理员</div>
        <el-row class="link-url" type="flex" justify="space-between">
          <span>{{ linkUrl }}</span>
          <el-button type="primary" size="mini" @click="onCopyLinkAction(linkUrl, $event)">复制</el-button>
        </el-row>
        <div class="tip">复制上方链接发送给活动管理员</div>
      </div>
      <div v-else-if="dialogData.type === 'publish'" class="publish-wrap">
        <div class="tip">确定发布该活动吗？</div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="publishCancelAction">取 消</el-button>
          <el-button type="primary" size="small" @click="publishSubmitAction">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clip from '@/utils/clipboard'
import DataSection from '@/components/DataSection'
import SponsorSearch from '@/components/SponsorSearch'
import PaginationSection from '@/components/PaginationSection'
import {
  navigatePath,
  activityAddModuleList,
  activitySetModuleList,
  activitySetModuleListWidthLive,
  reviewManageModuleList,
  financeManageModuleList,
  // noteManageModuleList,
  dataExportModuleList
} from '@/router'
import {
  activityList, activityCopy, activityPublish, activityDelete,
  activityAdminUnRelate, activityAdminInvite, activityQrCodeData
} from '@/api/activityManage/index'

export default {
  name: 'ActivityList',
  components: {
    DataSection,
    SponsorSearch,
    PaginationSection
  },
  props: {
    sponsorId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activityLoadingStatus: true,
      searchData: {
        startTime: '',
        endTime: '',
        keyword: ''
      },
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      activeName: 'list',
      activityListData: {
        list: [],
        temp: []
      },
      dialogData: {
        status: false,
        type: '',
        typeName: '',
        width: '',
        picture: '',
        activityData: {}
      },
      linkUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'moduleList'
    ])
  },
  created() {
    this.getActivityList()
  },
  methods: {
    getActivityList() {
      this.activityLoadingStatus = true
      activityList({
        ...this.pageData,
        ...this.searchData,
        sponsorId: this.sponsorId,
        status: Number(this.activeName === 'list')
      }).then((response) => {
        const { data, total } = response.data
        this.pageData.total = total
        this.activityListData[this.activeName] = data
        this.activityLoadingStatus = false
      }).catch(() => {
        this.activityLoadingStatus = false
      })
    },
    activitySearchAction(searchData) {
      const { timeList: [startTime, endTime], keyword } = searchData
      this.searchData = { startTime, endTime, keyword }
      this.pageData.index = 1
      this.getActivityList()
    },
    timeTypeList(value) {
      const { timeList: [startTime, endTime], keyword } = value
      this.searchData = { startTime, endTime, keyword }
      this.pageData.index = 1
      this.getActivityList()
    },
    addActivityAction() {
      this.$store.commit('activity/setActivityData', {})
      navigatePath({
        targetUrl: '/activityManage/baseSet/templateSelect',
        moduleList: activityAddModuleList
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
      this.searchData = {
        startTime: '',
        endTime: '',
        keyword: ''
      }
      this.pageData = {
        index: 1,
        size: 10,
        total: 0
      }
      this.getActivityList()
    },
    initDialogData() {
      this.dialogData = {
        status: false,
        type: '',
        picture: '',
        activityData: {}
      }
    },
    previewPictureAction(index, type) {
      const activityData = this.activityListData[this.activeName][index]
      const typeData = { 'activity': { name: 'activityCode', value: 1 }, 'kpi': { name: 'kpiCode', value: 2 }}
      const codeUrl = activityData[typeData[type].name]
      if (codeUrl) {
        this.dialogData = {
          status: true,
          type: 'picture',
          typeName: type,
          width: '400px',
          picture: codeUrl,
          activityData: activityData
        }
      } else {
        activityQrCodeData({ activityId: activityData.id, type: typeData[type].value }).then(response => {
          const resultData = response.data
          if (resultData) {
            activityData[typeData[type].name] = resultData
            this.activityListData[this.activeName].splice(index, 1, { ...activityData })
            this.dialogData = {
              status: true,
              type: 'picture',
              typeName: type,
              width: '400px',
              picture: response.data,
              activityData: activityData
            }
          }
        })
      }
    },
    async activitySetAction(activityData) {
      await this.$store.dispatch('activity/setActivityData', { activityData, defaultModuleList: (activityData.is_live ? activitySetModuleListWidthLive : activitySetModuleList) })
      navigatePath('/activityManage/baseSet/templateSelect')
    },
    async reviewManageAction(activityData) {
      await this.$store.dispatch('activity/setActivityData', { activityData, defaultModuleList: reviewManageModuleList })
      navigatePath('/activityManage/reviewManage/materialReview?id=' + activityData.id)
      localStorage.setItem('activityId', activityData.id)
    },
    activityCopyAction(activityData) {
      this.$confirm('确定复制该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activityCopy(activityData.id).then(response => {
          this.$message.success(response.msg)
          this.activeName = 'temp'
          this.handleClick()
        })
      })
    },
    async financeManageAction(activityData) {
      await this.$store.dispatch('activity/setActivityData', { activityData, defaultModuleList: financeManageModuleList })
      navigatePath('/activityManage/financeManage/orderStatistics?id=' + activityData.id)
      localStorage.setItem('activityId', activityData.id)
    },
    async noteManageAction(activityData) {
      return this.$message.info('功能开发中，敬请期待')
      // await this.$store.dispatch('activity/setActivityData', { activityData, defaultModuleList: noteManageModuleList })
      // navigatePath('/activityManage/noteManage/noteList')
    },
    async dataExportAction(activityData) {
      await this.$store.dispatch('activity/setActivityData', { activityData, defaultModuleList: dataExportModuleList })
      navigatePath('/activityManage/dataExport/dataPreview?id=' + activityData.id)
      localStorage.setItem('activityId', activityData.id)
    },
    activityPublishAction(activityData) {
      this.dialogData = {
        status: true,
        type: 'publish',
        width: '300px',
        picture: '',
        activityData
      }
    },
    activityDeleteAction(activityData) {
      this.$confirm('确定删除该草稿活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activityDelete({ activityId: activityData.id }).then(response => {
          this.$message.success(response.msg)
          this.getActivityList()
        })
      })
    },
    inviteAdminAction(item) {
      activityAdminInvite(item.id).then(response => {
        this.linkUrl = response.data
        this.dialogData = {
          status: true,
          type: 'invite',
          width: '900px',
          picture: '',
          activityData: {}
        }
      })
    },
    onCopyLinkAction(text, event) {
      clip(text, event)
    },
    unRelateActivityAdminAction(index, indexIndex) {
      const activityItem = this.activityListData.list[index]
      const activityAdminItem = activityItem.manager_list[indexIndex]
      activityAdminUnRelate({ activityId: activityItem.id, adminId: activityAdminItem.id }).then(response => {
        this.$message.success(response.msg)
        activityItem.manager_list.splice(indexIndex, 1)
        this.activityListData.list.splice(index, 1, activityItem)
      })
    },
    publishCancelAction() {
      this.initDialogData()
    },
    publishSubmitAction() {
      const activityId = this.dialogData.activityData.id
      this.initDialogData()
      activityPublish(activityId).then(response => {
        this.$message.success(response.msg)
        this.activeName = 'list'
        this.getActivityList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getActivityList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getActivityList()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .activity-list-container{
    .button-wrap{
      .add-button{
        float: right;
        margin: 0 12px 4px 0;
      }
    }
    .activity-list-wrap{
      margin-top: 12px;
      padding-bottom: 12px;
      background: #FFF;
      .activity-list-list{
        overflow-x: auto;
        .activity-list{
          min-width: 800px;
          .activity-item{
            border-bottom: 10px solid #F7F7F7;
            &:last-child{
              border-bottom: none;
            }
            .item-top{
              border-bottom: 1px solid #E7E7E7;
              .item-top-left{
                flex: 1;
                padding-left: 12px;
                .el-image{
                  width: 120px;
                  height: 80px;
                  border-radius: 4px;
                  box-shadow: 0 0 2px #BBB;
                }
                .item-top-cont{
                  position: relative;
                  flex: 1;
                  padding: 0 16px;
                  text-align: left;
                  font-size:14px;
                  font-weight:400;
                  color:rgba(51,51,51,1);
                  line-height:20px;
                  .theme{
                    .svg-icon{
                      margin: 0 0 2px 12px;
                      font-size: 16px;
                    }
                  }
                  .time-status{
                    .time{
                      float: left;
                    }
                    .status{
                      float: right;
                      color: #649CFF;
                      cursor: pointer;
                      user-select: none;
                      i{
                        position: relative;
                        top: -6px;
                        left: 36px;
                      }
                      span{
                        position: relative;
                        top: 12px;
                      }
                      &.status-ready{
                        color: #FF7300;
                      }
                      &.status-now{
                        color: #00A706;
                      }
                      &.status-over{
                        color: #A5A5A5;
                      }
                    }
                  }
                }
              }
              .item-top-right{
                margin-left: 16px;
                font-size:12px;
                font-weight:400;
                line-height:18px;
                text-align: center;
                .picture{
                  margin-right: 15px;
                  padding-left: 15px;
                  border-left: 1px solid #DDD;
                  color:rgba(0,0,0,0.6);
                  cursor: pointer;
                  user-select: none;
                  .el-image{
                    width: 60px;
                    height: 80px;
                    border: 1px solid #EEE;
                  }
                  .svg-icon{
                    margin-bottom: 5px;
                    padding: 2px;
                    border: 1px solid #1296db;
                    border-radius: 5px;
                    font-size: 24px;
                    opacity: 0.8;
                  }
                  div{
                    transform: scale(0.9);
                  }
                }
                .action{
                  color:rgba(0,0,0,0.5);
                  .el-col{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 68px;
                    height: 68px;
                    box-shadow: 0 0 2px #DDD;
                    cursor: pointer;
                    user-select: none;
                  }
                  .svg-icon{
                    font-size: 22px;
                  }
                  .tip{
                    line-height:20px;
                    transform: scale(0.8);
                  }
                }
                &.publish-activity-wrap{
                  flex-direction: column;
                  margin: 40px 12px 40px 16px;
                  .el-button{
                    margin: 4px 0;
                  }
                }
              }
              .image-slot{
                height: 100%;
                i{
                  width: 100%;
                  text-align: center;
                  line-height: 80px;
                  font-size: 20px;
                  color: #BBB;
                }
              }
            }
            .item-bottom{
              margin: 8px 12px;
              text-align: right;
              .manager{
                font-size:12px;
                font-weight:400;
                color:rgba(74,74,74,1);
                span{
                  color: $themeColor;
                }
              }
            }
          }
        }
      }
      .empty-message{
        padding: 80px 0;
        text-align: center;
        color: #BBB;
      }
    }

    .picture-wrap{
      text-align: center;
      .el-carousel{
        height: 420px;
        .el-image{
          width: 80%;
          height: calc(100% - 40px);
          margin: 20px 10%;
        }
      }
      .info-wrap{
        padding-bottom: 12px;
        .info-item{
          width: 90%;
          margin: 8px auto;
          font-size: 12px;
          font-weight: 400;
          color: #333333;
          .item-left{
            width: 25%;
            float: left;
            text-align: right;
          }
          .item-right{
            float: left;
            width: 75%;
            text-align: left;
          }
        }
      }
    }
    .invite-wrap{
      padding: 24px;
      text-align: center;
      .title{
        font-size:18px;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:80px;
      }
      .code{
        width: 200px;
        height: 200px;
        border: 1px solid #EEE;
        &+.tip{
          text-align: center;
        }
      }
      .link-url{
        width: 60%;
        min-width: 240px;
        margin: 20px auto 8px;
        padding: 4px 10px;
        border-bottom: 1px solid #DDD;
        span{
          line-height: 28px;
        }
      }
      .tip{
        width: 60%;
        min-width: 240px;
        margin: auto;
        font-size:12px;
        font-weight:400;
        color:rgba(255,68,120,1);
        line-height:28px;
        text-align: left;
      }
    }
    .publish-wrap{
      padding: 20px;
      text-align: right;
      .tip{
        padding: 12px 0 36px;
        text-align: center;
        font-size: 18px;
      }
    }
  }
</style>
<style lang="scss">
  .picture-wrap{
    .el-carousel{
      .el-carousel__container{
        height: 100%;
      }
      .el-carousel__indicators{
        display: none;
      }
    }
  }
</style>
