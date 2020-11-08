<template>
  <div class="medal-set-container">
    <div class="medal-wrap">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <el-form-item label="开启直播章：">
          <el-switch v-model="form.medalStatus" />
        </el-form-item>
        <el-form-item v-if="form.medalStatus" label="直播章设置：">
          <div class="medal-table clearfix">
            <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addMedalAction">新增直播章</el-button>
            <el-table
              ref="multipleTable"
              :data="form.brandList"
              style="width: 100%;"
              size="mini"
              border
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="name"
                label="直播章品牌"
                min-width="120"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column label="操作" width="80" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <svg-icon icon-class="table_icon_delete" class-name="table-action" @click="handleDeleteAction(scope)" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="primary" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog class="medal-dialog" title="直播章设置" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="120px" size="small">
        <el-form-item label="所属品牌：" prop="brand">
          <el-select v-model="dialogForm.brand" filterable placeholder="请选择所属品牌">
            <el-option v-for="(item) in brandList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="action-list" label-width="0">
          <el-button @click="dialogFormCancelAction">取 消</el-button>
          <el-button type="primary" @click="dialogFormSaveAction">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { brandList } from '@/api/activityManage/marketModuleSet'
import { liveMedalData, liveMedalSet } from '@/api/activityManage/liveSet'

export default {
  name: 'LiveMedalSet',
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      originBrandList: [],
      form: {
        medalStatus: false,
        brandList: []
      },
      dialogFormVisible: false,
      brandList: [],
      dialogForm: {
        brand: ''
      },
      dialogRules: {
        brand: [{ required: true, message: '请选择品牌', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'liveData'
    ])
  },
  created() {
    this.getBrandList()
    this.liveId && this.getLiveMedalData()
  },
  methods: {
    getLiveMedalData() {
      liveMedalData({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        const resultData = response.data
        if (resultData && resultData.length) {
          this.form = {
            ...this.form,
            medalStatus: Boolean(this.liveData.is_open),
            brandList: resultData
          }
        }
      })
    },
    getBrandList() {
      brandList(this.activityData.id).then(response => {
        this.brandList = response.data
      })
    },
    addMedalAction() {
      this.dialogFormVisible = true
    },
    handleEditAction(scope) {
      console.log(scope)
    },
    handleDeleteAction(scope) {
      this.form.brandList.splice(scope.$index, 1)
    },
    prevStepAction() {
      this.$emit('stepAction', { type: 'prev' })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const { medalStatus, brandList } = this.form
          const openStatus = Number(medalStatus)
          liveMedalSet({
            activityId: this.activityData.id,
            liveId: this.liveId,
            openStatus,
            brandList
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            if (openStatus) {
              this.getLiveMedalData()
            }
            this.$store.commit('live/SET_LIVE_DATA', { ...this.liveData, is_open: openStatus })
            this.$emit('stepAction', { type: 'next' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    dialogFormCancelAction() {
      this.dialogFormVisible = false
      this.$refs.dialogForm.resetFields()
    },
    dialogFormSaveAction() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          const brandItem = this.brandList.find(item => item.id === this.dialogForm.brand)
          brandItem.img = brandItem.logo
          this.form.brandList.push(brandItem)
          this.dialogFormCancelAction()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .medal-set-container{
    .medal-wrap{
      padding: 12px 0;
      background: #FFF;
      .medal-table{
        width: 480px;
        margin-top: 12px;
        .el-button{
          margin: 0 0 12px;
        }
        .delete-button{
          float: left;
        }
        .add-button{
          float: right;
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .table-action{
            margin: 0 8px;
            font-size: 18px;
            cursor: pointer;
          }
        }
      }
      .action-list{
        .el-button:first-child{
          margin-left: 180px;
        }
      }
    }
  }
</style>

<style lang="scss">
  .medal-dialog{
    .el-dialog__header{
      padding: 15px 0 24px 16px;
    }
    .action-list{
      padding: 12px 0;
      text-align: center;
    }
  }
</style>
