<template>
  <div class="activity-prize-set-container">
    <div class="activity-prize-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="奖品名称：" prop="name">
          <el-input v-model="form.name" style="width: 240px;" placeholder="请输入奖品名称" />
        </el-form-item>
        <el-form-item label="奖品图片：" prop="picture">
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
          <div class="form-tip">注：尺寸750*400，建议大小不超过1M</div>
        </el-form-item>
        <el-form-item label="奖品数量：" prop="amount">
          <el-input-number v-model="form.amount" :min="0" />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返 回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="prizeTableData.length" class="activity-prize-table-wrap">
      <activity-prize-table :prize-table-data="prizeTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActivityPrizeTable from '../components/prizeTable/index'
import { navigatePath } from '@/router'
import { exchangeAndPrizeGiftDetail, exchangeAndPrizeGiftAdd, exchangeAndPrizeGiftEdit } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'

export default {
  name: 'ActivityPrizeSet',
  components: {
    ActivityPrizeTable
  },
  props: {
    giftId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePicture = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        callback(new Error('请上传活动详情图片'))
      }
    }
    return {
      loading: false,
      form: {
        name: '',
        picture: {},
        amount: 0
      },
      rules: {
        name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }]
      },
      prizeTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.giftId && this.getGiftData()
  },
  methods: {
    getGiftData() {
      exchangeAndPrizeGiftDetail({ activityId: this.activityData.id, giftId: this.giftId }).then(response => {
        const { id, goods_name, img, storage } = response.data
        this.form = {
          id,
          name: goods_name,
          picture: img,
          amount: storage
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
        this.form.picture = { id: resource_id, url }
      })
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.giftId ? exchangeAndPrizeGiftAdd : exchangeAndPrizeGiftEdit
          this.loading = true
          requestName({ activityId: this.activityData.id, ...this.form, giftType: 1 }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
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
  .activity-prize-set-container{
    .activity-prize-form-wrap{
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 40px;
        }
      }
    }
    .activity-prize-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
