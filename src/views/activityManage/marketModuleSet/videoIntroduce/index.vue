<template>
  <div class="video-introduce-container">
    <div class="video-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="活动视频：">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUploadAction"
          >
            <video v-if="form.video.id" :src="form.video.url" class="avatar" controls />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：建议大小不超过30M</div>
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
import { videoDetail, videoSet } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'
import { stepAction } from '../utils/index'

export default {
  name: 'VideoIntroduce',
  data() {
    const validateVideo = (rule, value, callback) => {
      if (value.id) {
        callback()
      } else {
        callback(new Error('请上传活动视频！'))
      }
    }
    return {
      loading: false,
      form: {
        video: {
          id: '',
          url: ''
        }
      },
      rules: {
        video: [{ required: true, validator: validateVideo, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getVideoData()
  },
  methods: {
    getVideoData() {
      videoDetail(this.activityData.id).then(response => {
        if (response.data) {
          const { video_url } = response.data
          this.form = {
            video: video_url
          }
        }
      })
    },
    beforeAvatarUpload(file) {
      const isVideo = file.type.startsWith('video')
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isVideo) {
        this.$message.error('请上传视频文件')
      }
      if (!isLt30M) {
        this.$message.error('上传视频大小不能超过30MB!')
      }
      return isVideo && isLt30M
    },
    fileUploadAction(options) {
      const messageObject = this.$message.info({
        message: '文件上传中，请等候...',
        duration: 0
      })
      fileUpload(options.file).then(response => {
        this.$message.success(response.msg)
        const { resource_id, url } = response.data
        this.form.video = { id: resource_id, url }
        messageObject.close()
      }).catch(() => {
        messageObject.close()
      })
    },
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          videoSet({ videoId: this.form.video.id, activityId: this.activityData.id }).then(response => {
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
  .video-introduce-container{
    .video-wrap {
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          // margin-left: 0;
          margin-left: 36px;
        }
      }
    }
  }
</style>
