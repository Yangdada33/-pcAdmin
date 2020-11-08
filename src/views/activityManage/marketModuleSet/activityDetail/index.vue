<template>
  <div class="activity-detail-container">
    <div class="activity-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="活动详情图：" prop="picture">
          <el-upload
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :limit="5"
            :show-file-list="true"
            :file-list="form.pictureList"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUploadAction"
            :on-remove="handleAvatarRemove"
            :on-exceed="handleAvatarExceed"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸750*400，建议大小不超过1M，最多可上传5张图片</div>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stepAction } from '../utils/index'
import { detailData, detailSet } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'

export default {
  name: 'ActivityDetail',
  data() {
    const validateArray = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请上传活动详情图片'))
      }
    }
    return {
      loading: false,
      form: {
        pictureList: []
      },
      rules: {
        pictureList: [{ required: true, validator: validateArray, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getPictureData()
  },
  methods: {
    getPictureData() {
      detailData(this.activityData.id).then(response => {
        const resultData = response.data
        if (resultData && resultData.length) {
          this.form.pictureList = resultData.map(item => item.image)
        }
      })
    },
    beforeAvatarUpload(file) {
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
        this.form.pictureList.push({ id: resource_id, url, uid: options.file.uid })
      })
    },
    handleAvatarRemove(file, fileList) {
      const removeIndex = this.form.pictureList.findIndex(item => item.uid === file.uid)
      if (removeIndex > -1) {
        this.form.pictureList.splice(removeIndex, 1)
      }
    },
    handleAvatarExceed(files, fileList) {
      console.log(files, fileList)
      this.$message.error('最多上传5张活动详情图片')
    },
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          detailSet({ activityId: this.activityData.id, idList: this.form.pictureList.map(item => item.id) }).then(response => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .activity-detail-container{
    .activity-wrap {
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 36px;
        }
      }
    }
  }
</style>
