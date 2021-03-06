<template>
  <div class="shop-gift-container">
    <div class="shop-gift-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="礼品名称：" prop="name">
          <el-input v-model="form.name" style="width: 240px;" placeholder="请输入礼品名称" />
        </el-form-item>
        <el-form-item label="礼品图片：" prop="picture">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUploadAction"
          >
            <img v-if="form.picture.id" :src="form.picture.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸200*200；建议大小不超过1M</div>
        </el-form-item>
        <el-form-item label="礼品库存：" prop="storage">
          <el-input-number v-model="form.storage" :min="0" />
        </el-form-item>
        <el-form-item label="领取规则：" prop="ruleCont" class="shop-gift-rule clearfix">
          <el-row type="flex">
            <el-input v-model="form.ruleCont" :rows="5" type="textarea" style="width: 480px;" placeholder="请输入领取规则" />
            <el-button type="primary" plain @click="ruleTemplateDialogAction">规则模板</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="领取条件：" prop="medalNum">
          <span class="text-cont">集满 </span>
          <el-input-number v-model="form.medalNum" :min="0" />
          <span class="text-cont"> 个逛店章</span>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" width="40%">
      <div class="coupon-template-dialog">
        <div class="title">逛店章规则</div>
        <el-form label-width="90px" size="small">
          <el-form-item label-width="0">
            <div class="template-table">
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
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import { stepAction } from '../utils/index'
import { medalGiftData, medalGiftSet } from '@/api/activityManage/marketModuleSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { fileUpload } from '@/api/user'
import { ruleTypeData } from '@/utils/data'

export default {
  name: 'ShopGift',
  components: {
    PaginationSection
  },
  data() {
    const validatePicture = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        callback(new Error('请上传礼品图片'))
      }
    }
    return {
      loading: false,
      form: {
        name: '',
        picture: {},
        storage: 0,
        ruleCont: '',
        medalNum: 0
      },
      rules: {
        name: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        ruleCont: [{ required: true, message: '请输入领取规则', trigger: 'blur' }]
      },
      dialogTemplateVisible: false,
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
  created() {
    this.getMedalGiftData()
  },
  methods: {
    getMedalGiftData() {
      medalGiftData({ activityId: this.activityData.id, medalType: 0 }).then(response => {
        const resultData = response.data
        if (resultData) {
          const { id, name, img, storage, rule, target } = resultData
          this.form = {
            id,
            name,
            picture: img,
            storage,
            ruleCont: rule,
            medalNum: target
          }
        }
      })
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('请上传图片文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!')
      }
      return isImage && isLt2M
    },
    fileUploadAction(options) {
      fileUpload(options.file).then(response => {
        this.$message.success(response.msg)
        const { resource_id, url } = response.data
        this.form.picture = { id: resource_id, url }
      })
    },
    async ruleTemplateDialogAction() {
      if (!this.templateTableData.length) {
        await this.getRuleTemplateList()
      }
      this.dialogTemplateVisible = true
    },
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          medalGiftSet({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            stepAction('next')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.templatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    getRuleTemplateList() {
      return new Promise((resolve, reject) => {
        ruleTemplateList({ ...this.templatePageData, type: ruleTypeData.shopGift }).then(response => {
          const { data, total } = response.data
          this.templatePageData.total = total
          this.templateTableData = data
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    handleSizeChange(value) {
      this.templatePageData.size = value
      this.getRuleTemplateList()
    },
    handleCurrentChange(value) {
      this.templatePageData.index = value
      this.getRuleTemplateList()
    },
    templateSelectedAction(scope) {
      this.form.ruleCont = scope.row.content
      this.dialogTemplateVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .shop-gift-container{
    .shop-gift-wrap{
      padding:24px 12px;
      background: #FFF;
      .shop-gift-rule{
        .el-textarea,
        .el-button{
          float: left;
        }
        .el-textarea{
          width: calc(100% - 90px);
          min-width: 140px;
        }
        .el-button{
          height: 32px;
          margin: 4px 0 0 10px;
        }
      }
      .text-cont{
        color: #666666;
      }
      .action-list{
        .el-button:first-child{
          // margin-left: 160px;
          margin-left: 220px;
        }
      }
    }

    .el-dialog{
      min-width:300px;
      .coupon-template-dialog{
        padding: 24px 20px;
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
  }
</style>
