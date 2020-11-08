<template>
  <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" :close-on-click-modal="false" width="40%">
    <div class="material-dialog">
      <div class="title">{{ materialTypeData[materialType] }}</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label-width="0" prop="content">
          <el-input v-model="form.content" :rows="4" type="textarea" :placeholder="`请输入${materialTypeData[materialType]}`" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="material-table">
            <pagination-section :page-data="templatePageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
              <el-table
                ref="multipleTable"
                :data="templateTableData"
                style="width: 100%"
                max-height="240px"
                size="small"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="60"
                  align="center"
                  header-align="center"
                  :index="indexMethod"
                />
                <el-table-column
                  prop="content"
                  label="模板"
                  align="center"
                  header-align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="150" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-button type="warning" size="mini" plain @click="templateSelectedAction(scope)">选 择</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </pagination-section>
          </div>
        </el-form-item>
        <el-form-item class="action-list" label-width="0">
          <el-button type="default" @click="formCancelAction">取消</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import { materialList, materialAdd, materialEdit } from '@/api/platformSet/material'
import { materialTypeData } from '@/utils/data'

export default {
  name: 'MaterialTemplateDialog',
  components: {
    PaginationSection
  },
  props: {
    liveId: {
      type: String,
      default: ''
    },
    materialType: {
      type: String,
      default: ''
    },
    materialData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogTemplateVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      materialTypeData: {
        note: '短信素材',
        live: '直播素材',
        music: '音乐素材'
      },
      form: {
        content: ''
      },
      rules: {
        content: [{ required: true, message: '请输入或选择素材', trigger: 'blur' }]
      },
      templatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  watch: {
    dialogTemplateVisible(newVal, oldVal) {
      if (newVal) {
        const { id, content } = this.materialData
        this.form = {
          id,
          content
        }
      }
    }
  },
  created() {
    this.getSponsorMaterialTemplateList()
  },
  methods: {
    indexMethod(indexIndex) {
      const { index, size } = this.templatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    templateSelectedAction(scope) {
      this.form.content = scope.row.content
    },
    getSponsorMaterialTemplateList() {
      materialList({
        ...this.templatePageData,
        type: materialTypeData[this.materialType],
        activityId: this.activityData.id,
        liveId: this.liveId,
        sponsorId: 0
      }).then(response => {
        const { total, data } = response.data
        this.templatePageData.total = total
        this.templateTableData = data
      })
    },
    handleSizeChange(value) {
      this.templatePageData.size = value
      this.getSponsorMaterialTemplateList()
    },
    handleCurrentChange(value) {
      this.templatePageData.index = value
      this.getSponsorMaterialTemplateList()
    },
    formCancelAction(content) {
      this.$emit('setDialogTemplateVisible', { status: false, content })
      this.$refs.form.clearValidate()
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const requestName = !this.materialData.id ? materialAdd : materialEdit
          requestName({
            activityId: this.activityData.id,
            liveId: this.liveId,
            type: materialTypeData[this.materialType],
            ...this.form
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formCancelAction(this.form.content)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog{
    min-width:300px;
    .material-dialog{
      padding: 24px 20px 10px;
      .title{
        font-size:18px;
        font-weight:500;
        color:rgba(51,51,51,1);
        text-align: center;
      }
      .el-form{
        margin-top: 20px;
        .el-form-item{
          &:last-child{
            text-align: center;
          }
        }
      }
    }
  }
</style>
