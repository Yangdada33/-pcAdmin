<template>
  <div class="ranking-gift-set-container">
    <div class="ranking-gift-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="礼品名称：" prop="name">
          <el-input v-model="form.name" style="width: 300px;" placeholder="请输入礼品名称" />
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
        <el-form-item v-if="false" label="礼品数量：" prop="amount">
          <el-input-number v-model="form.amount" :min="0" />
        </el-form-item>
        <el-form-item label="所属名次：" prop="rangeNum">
          <el-input v-model="form.rangeNum" style="width: 300px;" placeholder="请输入名次，例：第1-3名" />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="giftTableData.length" class="ranking-gift-table-wrap">
      <ranking-gift-table :gift-table-data="giftTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RankingGiftTable from '../components/giftTable/index'
import { navigatePath } from '@/router'
import { rankingGiftAdd, rankingGiftEdit } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'

export default {
  name: 'RankingGiftSet',
  components: {
    RankingGiftTable
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
        callback(new Error('请上传礼品图片'))
      }
    }
    return {
      loading: false,
      form: {
        name: '',
        picture: {},
        amount: 0,
        rangeNum: ''
      },
      rules: {
        name: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        rangeNum: [{ required: true, message: '请输入所属名次', trigger: 'blur' }]
      },
      giftTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'giftData'
    ])
  },
  created() {
    this.giftId && this.getGiftData()
  },
  methods: {
    getGiftData() {
      const { id, goods_name, image, storage, name } = this.giftData
      this.form = {
        id,
        name: goods_name,
        picture: image,
        amount: storage,
        rangeNum: name
      }
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
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.giftId ? rankingGiftAdd : rankingGiftEdit
          this.loading = true
          requestName({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.formBackAction()
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
  .ranking-gift-set-container{
    .ranking-gift-form-wrap{
      padding: 24px 12px;
      background: #FFF;
      .separator{
        margin: 0 8px;
      }
      .action-list{
        .el-button:first-child{
          margin-left: 80px;
        }
      }
    }
    .ranking-gift-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
