<template>
  <div class="exchange-gift-set-container">
    <div class="exchange-gift-form-wrap">
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
        <el-form-item label="礼品描述：" prop="desCont">
          <el-input v-model="form.desCont" :rows="5" type="textarea" style="width: 480px;" placeholder="请输入限购说明" />
        </el-form-item>
        <el-form-item label="礼品数量：" prop="amount">
          <el-input-number v-model="form.amount" :min="0" />
        </el-form-item>
        <el-form-item label="每人限兑：" prop="echangeNum">
          <el-input-number v-model="form.exchangeNum" :min="0" :max="form.amount" />
        </el-form-item>
        <el-form-item label="兑换积分：" prop="exchangeScore">
          <el-input-number v-model="form.exchangeScore" :min="0" />
        </el-form-item>
        <el-form-item label="购买金额：" prop="purchasePrice">
          <el-input v-model="form.purchasePrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
          <div class="form-tip">注：以10、20、30等为基础数值，数值越大排序越靠前，中间可插，比如12，就介于10、20之间</div>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="giftTableData.length" class="exchange-gift-table-wrap">
      <exchange-gift-table :gift-table-data="giftTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExchangeGiftTable from '../components/giftTable/index'
import { navigatePath } from '@/router'
import { exchangeAndPrizeGiftDetail, exchangeAndPrizeGiftAdd, exchangeAndPrizeGiftEdit } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'ExchangeGiftSet',
  components: {
    ExchangeGiftTable
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
        picture: '',
        desCont: '',
        amount: 0,
        exchangeNum: 0,
        exchangeScore: 0,
        purchasePrice: '',
        sort: 0
      },
      rules: {
        name: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        desCont: [{ required: true, message: '请输入礼品描述', trigger: 'blur' }],
        purchasePrice: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      giftTableData: []
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
        const { id, goods_name, img, content, storage, goods_limit, point, price, sort } = response.data
        this.form = {
          id,
          name: goods_name,
          picture: img,
          desCont: content,
          amount: storage,
          exchangeNum: goods_limit,
          exchangeScore: point,
          purchasePrice: price,
          sort
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
          requestName({ activityId: this.activityData.id, ...this.form, giftType: '0' }).then(response => {
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
  .exchange-gift-set-container{
    .exchange-gift-form-wrap{
      padding: 24px 12px;
      background: #FFF;
      .separator{
        margin: 0 8px;
      }
      .action-list{
        .el-button:first-child{
          margin-left: 160px;
        }
      }
    }
    .exchange-gift-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
