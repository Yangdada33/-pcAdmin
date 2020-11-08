<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="wechat-table-set-container">
    <div class="wechat-table-set-wrap">
      <div v-if="!stepIndex" class="wechat-table">
        <table-page-section
          type="wechat"
          :back-status="backStatus"
          :table-data-clone="tableDataClone"
          :page-data-clone="pageDataClone"
          :material-type="materialType"
          :material-fn-data="materialFnData"
          @tabStepAction="tabStepAction"
          @tableDataCloneAction="tableDataCloneAction"
        >
          <template v-slot:default>
            <el-table-column
              prop="content"
              label="文字内容"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div style="text-align: left">{{ scope.row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="resource_ids"
              label="图片/视频"
              width="200"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-row type="flex" justify="center">
                  <template v-for="(item,index) in scope.row.resource_ids">
                    <el-popover
                      v-if="validateImageSuffix(item.url)"
                      :key="index"
                      placement="right-end"
                      width="360"
                      trigger="hover"
                    >
                      <el-image fit="cover" :src="item.url" />
                      <el-image slot="reference" class="wechat-image" fit="cover" :src="item.url" />
                    </el-popover>
                    <el-popover
                      v-if="validateVideoSuffix(item.url)"
                      :key="index"
                      placement="right-end"
                      height="400"
                      trigger="hover"
                    >
                      <video :src="item.url" controls style="height: 400px;" />
                      <video slot="reference" class="wechat-video" :src="item.url" />
                    </el-popover>
                  </template>
                </el-row>
              </template>
            </el-table-column>
          </template>
        </table-page-section>
      </div>
      <div v-else class="wechat-set">
        <form-set-section
          type="wechat"
          :title="'微信素材库 / ' + (form.id ? '编辑' : '新增')"
          :form="form"
          :rules="rules"
          :material-fn-data="materialFnData"
          @tabStepAction="tabStepAction"
        >
          <template v-slot:default>
            <el-form-item label="文字内容：" prop="content">
              <el-row type="flex" class="wechat-rule clearfix">
                <el-input v-model="form.content" :rows="5" type="textarea" style="width: 500px;" placeholder="请输入文字内容" />
                <el-button type="primary" plain @click="leadInAction">平台导入</el-button>
              </el-row>
            </el-form-item>
            <el-form-item label="图片/视频：">
              <el-row type="flex">
                <el-upload
                  v-if="form.fileList.length === 1 && fileType === 2"
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :file-list="form.fileList"
                  :before-upload="beforeAvatarUpload"
                  :http-request="fileUploadAction"
                  :on-remove="handleAvatarRemove"
                >
                  <video :src="form.fileList[0].url" class="video-uploader" />
                </el-upload>
                <el-upload
                  v-else
                  class="avatar-uploader"
                  action=""
                  list-type="picture-card"
                  :show-file-list="true"
                  :file-list="form.fileList"
                  :before-upload="beforeAvatarUpload"
                  :http-request="fileUploadAction"
                  :on-remove="handleAvatarRemove"
                >
                  <i class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-row>
              <div class="form-tip">注：可上传多张图片或一个视频；图片尺寸比例：1:1，建议图片不超过1M；视频不超过30M</div>
            </el-form-item>
          </template>
        </form-set-section>
      </div>
    </div>

    <el-dialog :visible.sync="dialogMaterialVisible" :show-close="false">
      <div class="material-dialog">
        <div class="title">平台导入</div>
        <el-form ref="form" :model="materialForm" label-width="100px" size="small">
          <el-form-item label-width="0">
            <div class="material-table">
              <pagination-section :page-data="pageData" @handleSizeChange="handleMaterialSizeChange" @handleCurrentChange="handleMaterialCurrentChange">
                <el-table
                  ref="multipleTable"
                  :data="materialTableData"
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
                    :index="indexMaterialMethod"
                  />
                  <el-table-column
                    prop="content"
                    label="素材"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column label="操作" width="150" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-button type="warning" size="mini" plain @click="materialSelectedAction(scope)">使 用</el-button>
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
import TablePageSection from '../tablePageSection/index'
import FormSetSection from '../formSetSection/index'
import PaginationSection from '@/components/PaginationSection'
import { wechatMaterialList, wechatMaterialAdd, wechatMaterialEdit, wechatMaterialDelete } from '@/api/platformSet/material'
import { fileUpload } from '@/api/user'
import { imageSuffixList, videoSuffixList } from '@/utils/data'
import { validateSuffix } from '@/utils/validate'

export default {
  name: 'WechatTableSet',
  components: {
    TablePageSection,
    FormSetSection,
    PaginationSection
  },
  props: {
    materialType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      materialFnData: {
        listFn: wechatMaterialList,
        addFn: wechatMaterialAdd,
        editFn: wechatMaterialEdit,
        deleteFn: wechatMaterialDelete
      },
      stepIndex: 0, // 0-表格 1-表单
      backStatus: false, // 表单返回状态
      tableDataClone: [],
      pageDataClone: {
        index: 1,
        size: 10,
        total: 0
      },
      fileType: 0, // 已上传得文件类型 0-未上传文件 1-已上传图片 2-已上传视频
      form: {
        content: '',
        fileList: []
      },
      rules: {
        content: [{ required: true, message: '请输入文字内容', trigger: 'blur' }]
      },
      dialogMaterialVisible: false,
      materialForm: {},
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      materialTableData: []
    }
  },
  methods: {
    validateImageSuffix(url) {
      return validateSuffix(url, imageSuffixList)
    },
    validateVideoSuffix(url) {
      return validateSuffix(url, videoSuffixList)
    },
    tabStepAction({ stepIndex, form, backStatus }) {
      this.stepIndex = stepIndex
      if (form) {
        const firstFileUrl = form.resource_ids[0].url
        const fileSuffix = firstFileUrl.substr(firstFileUrl.lastIndexOf('.') + 1).toLowerCase()
        if (imageSuffixList.includes(fileSuffix)) {
          this.fileType = 1
        } else if (videoSuffixList.includes(fileSuffix)) {
          this.fileType = 2
        }
        this.form = { ...form, fileList: form.resource_ids }
      } else {
        if (!stepIndex) {
          this.backStatus = backStatus
          this.form = { content: '', fileList: [] }
        }
      }
    },
    tableDataCloneAction({ list, page, backStatus }) {
      this.tableDataClone = list
      this.pageDataClone = page
      this.backStatus = backStatus
    },
    leadInAction() {
      this.getMaterialTemplateList((data) => {
        if (data && data.length) {
          this.dialogMaterialVisible = true
        } else {
          this.$message.warning('暂无可选素材！')
        }
      })
    },
    beforeAvatarUpload(file) {
      const fileType = file.type.split('/')[0]
      const fileSuffix = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      const isImage = fileType === 'image' && imageSuffixList.includes(fileSuffix)
      const isVideo = fileType === 'video' && videoSuffixList.includes(fileSuffix)
      if (isImage) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过2MB!')
        }
        return isImage && isLt2M
      } else if (isVideo) {
        if (this.form.fileList.some(item => item.type === 'video')) {
          this.$message.error('只能上传一个视频文件!')
          return false
        } else {
          const isLt30M = file.size / 1024 / 1024 < 30
          if (!isLt30M) {
            this.$message.error('上传视频大小不能超过30MB!')
          }
          return isVideo && isLt30M
        }
      } else {
        this.$message.error('请上传png/jpg/gif图片或mp4/avi/flv视频文件!')
      }
      return false
    },
    fileUploadAction(options) {
      fileUpload(options.file).then(response => {
        this.$message.success(response.msg)

        const fileType = options.file.type.split('/')[0]
        if (fileType === 'image') {
          if (this.fileType === 2) {
            this.form.fileList = []
          }
          this.fileType = 1
        } else if (fileType === 'video') {
          if (this.fileType === 1) {
            this.form.fileList = []
          }
          this.fileType = 2
        }
        const { resource_id, url } = response.data
        this.form.fileList.push({ id: resource_id, url, uid: options.file.uid })
      })
    },
    handleAvatarRemove(file, fileList) {
      const removeIndex = this.form.fileList.findIndex(item => item.uid === file.uid)
      if (removeIndex > -1) {
        this.form.fileList.splice(removeIndex, 1)
      }
    },
    deleteFileAction(index) {
      this.form.fileList.splice(index, 1)
    },
    getMaterialTemplateList(callback) {
      wechatMaterialList({ ...this.pageData, sponsorId: 0 }).then(response => {
        const { total, data } = response.data
        this.pageData.total = total
        this.materialTableData = data
        callback && callback()
      })
    },
    indexMaterialMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    materialSelectedAction(scope) {
      this.form.content = scope.row.content
      // 重置
      this.dialogMaterialVisible = false
      this.pageData = {
        index: 1,
        size: 10,
        total: 0
      }
      this.materialTableData = []
    },
    handleMaterialSizeChange(value) {
      this.pageData.size = value
      this.getMaterialTemplateList()
    },
    handleMaterialCurrentChange(value) {
      this.pageData.index = value
      this.getMaterialTemplateList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .wechat-table-set-container{
    .wechat-table-set-wrap{
      .wechat-table{
        .wechat-image,
        .wechat-video{
          display:block;
          width: 50px;
          height: 50px;
          margin: 2px;
        }
      }
      .wechat-set{
        .wechat-rule{
          .el-textarea,
          .el-button{
            float: left;
          }
          .el-textarea{
            width: calc(100% - 200px);
            min-width: 140px;
          }
          .el-button{
            height: 32px;
            margin: 4px 0 0 10px;
          }
        }
        .file-list{
          position: relative;
          margin-right: 8px;
          border-radius: 6px;
          overflow: hidden;
          .delete-icon{
            position: absolute;
            top: 4px;
            right: 4px;
            color: #F00;
            font-size: 16px;
            cursor: pointer;
          }
        }

        .video-uploader{
          width: 124px;
          height: 124px;
        }
      }
    }

    .el-dialog{
      min-width:300px;
      .material-dialog{
        padding: 24px 20px 12px;
        .title{
          padding-bottom: 10px;
          font-size:16px;
          font-weight:500;
          color:rgba(51,51,51,1);
          text-align: center;
        }
        .el-form{
          margin-top: 20px;
          .el-form-item{
            .material-table{
              padding-top: 0;
              line-height: 1;
            }
            &:last-child{
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
