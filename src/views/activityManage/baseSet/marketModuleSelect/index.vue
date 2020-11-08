<template>
  <div class="market-module-select-container">
    <el-form v-if="moduleSectionList.length" ref="form" label-width="0" size="small">
      <div class="form-tip-red">注：现金券和现金券礼包只能二选一</div>
      <el-form-item>
        <el-row class="module-list" type="flex">
          <el-form-item v-for="(item,index) in moduleSectionList" :key="item.id" class="module-item clearfix">
            <div class="title-status">
              <div class="title">{{ item.name }}</div>
              <el-switch v-model="item.status" active-color="#13ce66" @change="handleSwitchChange(index, item.tag, $event)" />
            </div>
            <img class="icon" :src="iconData[item.tag].icon" alt="">
          </el-form-item>
        </el-row>
      </el-form-item>
      <el-form-item class="action-list">
        <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
        <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import variables from '@/styles/variables.scss'
import { moduleList, moduleSet } from '@/api/activityManage/baseSet'
import { activityModuleData } from '@/utils/data'
import { deepClone } from '@/utils/index'

export default {
  name: 'MarketModuleSelect',
  data() {
    return {
      variables,
      loading: false,
      iconData: activityModuleData,
      moduleSectionList: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'moduleList'
    ])
  },
  created() {
    this.getModuleList()
  },
  methods: {
    getModuleList() {
      moduleList(this.activityData.id).then(response => {
        const moduleSectionList = response.data
        const selectedIdList = (this.activityData.menu || []).map(item => item.id)
        this.moduleSectionList = moduleSectionList.map(item => {
          item.status = selectedIdList.includes(item.id)
          return item
        })
      })
    },
    handleSwitchChange(index, type, value) {
      if (type === 'activity_voucher' && value) {
        this.moduleSectionList[index + 1].status = false
      } else if (type === 'activity_voucher_group' && value) {
        this.moduleSectionList[index - 1].status = false
      }
    },
    prevStepAction() {
      navigatePath('/activityManage/baseSet/prizeSet')
    },
    formSaveAction() {
      this.loading = true
      moduleSet({ activityId: this.activityData.id, moduleList: this.moduleSectionList }).then(response => {
        this.$message.success(response.msg)
        this.loading = false
        this.$store.commit('activity/setActivityData', { ...this.activityData, menu: this.moduleSectionList.filter(item => item.status) })
        const moduleChildList = this.moduleSectionList.reduce((total, item) => {
          item.status && total.push(this.iconData[item.tag].path)
          return total
        }, [])
        const moduleListClone = deepClone(this.moduleList)
        const moduleIndex = this.moduleList.findIndex(item => item.path === 'marketModuleSet')
        if (moduleChildList.length) {
          moduleChildList.includes('banner') && moduleChildList.push('bannerLocation')
          if (moduleIndex !== -1) {
            moduleListClone[moduleIndex].children = moduleChildList
          } else {
            moduleListClone.splice(1, 0, { path: 'marketModuleSet', children: moduleChildList })
          }
          this.$store.commit('activity/setModuleList', moduleListClone)
          navigatePath('/activityManage/marketModuleSet/' + moduleChildList[0])
        } else {
          if (moduleIndex !== -1) {
            moduleListClone.splice(1, 1)
            this.$store.commit('activity/setModuleList', moduleListClone)
          }
          if (this.moduleList.some(item => item.path === 'liveSet')) {
            navigatePath('/activityManage/liveSet/anchorSet')
          } else {
            navigatePath('/activityManage/employeeManage/stepSet')
          }
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .market-module-select-container{
    .el-form{
      padding: 20px 16px;
      background: #FFF;
      .form-tip-red{
        text-align: right;
      }
      &>.el-form-item{
        text-align: center;
      }
      .module-list{
        .module-item{
          width: calc((100% - 96px) / 4);
          min-width: 220px;
          margin: 12px;
          padding: 18px 20px;
          background: #FFF;
          box-shadow:0 0 10px 0 rgba(0,0,0,0.24);
          border-radius: 8px;
          .title-status{
            float: left;
            text-align: left;
            .title{
              padding-bottom: 6px;
              font-size: 14px;
            }
          }
          .icon{
            float: right;
            height: 40px;
            margin-top: 16px;
          }
        }

        @media screen and (min-width: 1366px) {
          .module-item {
            width: calc((100% - 120px) / 5);
            min-width: 180px;
          }
        }
      }
    }
  }
</style>
