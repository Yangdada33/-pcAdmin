<template>
  <div class="banner-container">
    <div class="banner-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="广告图：">
          <el-upload
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :show-file-list="true"
            :file-list="form.pictureList"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUploadAction"
            :on-remove="handleAvatarRemove"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸750*400，建议大小不超过1M</div>
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
import { bannerData, bannerSet } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'

export default {
  name: 'Banner',
  data() {
    const validatePictureList = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请上传广告图'))
      }
    }
    return {
      loading: false,
      form: {
        sectionId: '',
        pictureList: []
      },
      rules: {
        pictureList: [{ required: true, validator: validatePictureList, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getBannerData()
  },
  methods: {
    getBannerData() {
      bannerData(this.activityData.id).then(response => {
        const resultData = response.data
        if (resultData && resultData.length) {
          this.form = {
            sectionId: resultData[0].id,
            pictureList: resultData.map(item => item.img)
          }
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
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const bannerList = this.form.pictureList.map(item => ({ img: item.id }))
          bannerList.length && (bannerList[0].id = this.form.sectionId)
          bannerSet({
            activityId: this.activityData.id,
            bannerList
          }).then(response => {
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
  .banner-container{
    .banner-wrap {
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          // margin-left: 30px
          margin-left: 40px;
        }
      }
    }
  }
</style>
