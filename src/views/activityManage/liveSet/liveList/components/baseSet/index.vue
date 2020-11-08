<template>
  <div class="base-set-container">
    <div class="base-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="直播主题：" prop="theme">
          <el-input v-model="form.theme" style="width: 240px;" placeholder="请输入直播主题" />
        </el-form-item>
        <el-form-item label="直播地址：" prop="link">
          <el-input v-model="form.link" style="width: 360px;" placeholder="请输入直播地址" />
        </el-form-item>
        <el-form-item label="选择主播：" prop="anchor">
          <el-select v-model="form.anchor" multiple placeholder="请选择">
            <el-option
              v-for="item in anchorOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开播时间：" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开播时间"
          />
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item label="公告状态：" prop="noticeStatus">
          <el-radio-group v-model="form.noticeStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.noticeStatus" label="直播公告：" prop="notice">
          <el-input v-model="form.notice" style="width: 400px;" placeholder="请输入直播公告" />
        </el-form-item>
        <el-form-item label="直播图片：" prop="picture">
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
          <div class="form-tip">注：尺寸比例：2:3，建议800*1200，大小不超过1M</div>
        </el-form-item>
        <el-form-item label="在线人数基数：" prop="lineBase">
          <el-input-number v-model="form.lineBase" :min="0" />
        </el-form-item>
        <el-form-item label="在线人数峰值：" prop="lineMax">
          <el-input-number v-model="form.lineMax" :min="0" />
        </el-form-item>
        <el-form-item label="点赞基数：" prop="praiseBase">
          <el-input-number v-model="form.praiseBase" :min="0" />
        </el-form-item>
        <el-form-item label="直播说明：" prop="activityDes">
          <el-input v-model="form.activityDes" :rows="5" type="textarea" style="width: 400px" placeholder="请输入直播活动说明" />
        </el-form-item>
        <el-form-item label="福利发放规则：" class="rule-cont clearfix" prop="ruleCont">
          <el-row type="flex">
            <el-input v-model="form.ruleCont" :rows="5" type="textarea" style="width: 400px" placeholder="请输入福利发放规则" />
            <el-button type="primary" plain @click="ruleTemplateDialogAction">规则模板</el-button>
          </el-row>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" width="40%">
      <div class="coupon-template-dialog">
        <div class="title">福利发放规则</div>
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
import { anchorList, liveDetail, liveAdd, liveEdit } from '@/api/activityManage/liveSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { fileUpload } from '@/api/user'
import { ruleTypeData } from '@/utils/data'
import { parseTime, string2Date } from '@/utils/index'

export default {
  name: 'LiveBaseSet',
  components: {
    PaginationSection
  },
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateArray = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请选择主播'))
      }
    }
    const validatePicture = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        callback(new Error('请上传直播图片'))
      }
    }
    return {
      loading: false,
      anchorOptions: [],
      form: {
        theme: '',
        link: '',
        anchor: [],
        startTime: '',
        endTime: '',
        noticeStatus: 0,
        notice: '',
        picture: {},
        lineBase: 100,
        lineMax: 100,
        praiseBase: 100,
        activityDes: '',
        ruleCont: ''
      },
      rules: {
        theme: [{ required: true, message: '请输入直播主题', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择直播开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择直播结束时间', trigger: 'blur' }],
        notice: [{ required: true, message: '请输入直播公告', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        activityDes: [{ required: true, message: '请输入直播说明', trigger: 'blur' }],
        ruleCont: [{ required: true, message: '请输入福利发放规则', trigger: 'blur' }]
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
    this.getAnchorList()
    this.liveId && this.getLiveData()
  },
  methods: {
    getAnchorList() {
      anchorList(this.activityData.id).then(response => {
        this.anchorOptions = response.data
      })
    },
    getLiveData() {
      liveDetail({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        const { id, name, link, anchor_ids, start_time, end_time, notice, invite_img, online_people, online_people_max, number_of_likes, live_remark, welfare_rule } = response.data
        this.form = {
          id,
          theme: name,
          link,
          anchor: anchor_ids,
          startTime: string2Date(start_time),
          endTime: string2Date(end_time),
          noticeStatus: notice ? 1 : 0,
          notice,
          picture: invite_img,
          lineBase: online_people,
          lineMax: online_people_max,
          praiseBase: number_of_likes,
          activityDes: live_remark,
          ruleCont: welfare_rule
        }
      })
    },
    async beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('请上传图片文件')
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
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.liveId ? liveAdd : liveEdit
          this.loading = true
          requestName({
            activityId: this.activityData.id,
            ...this.form,
            startTime: parseTime(this.form.startTime),
            endTime: parseTime(this.form.endTime)
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.$emit('stepAction', { type: 'next', liveId: response.data })
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
        ruleTemplateList({ ...this.templatePageData, type: ruleTypeData.liveBenefit }).then(response => {
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
  .base-set-container{
    .base-wrap {
      padding: 24px 12px;
      background: #FFF;
      .rule-cont{
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
      .action-list{
        .el-button:first-child{
          margin-left: 180px;
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
