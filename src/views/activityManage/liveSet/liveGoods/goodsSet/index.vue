<template>
  <div class="live-goods-set-container">
    <div class="live-goods-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="所属品牌：" prop="brand">
          <el-select v-model="form.brand" style="width: 240px;" filterable placeholder="请选择所属品牌">
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="form.name" style="width: 240px;" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品图片：" prop="picture">
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
          <div class="form-tip">注：尺寸：400*400，建议大小不超过1M</div>
        </el-form-item>
        <el-form-item label="商品规格：" prop="standards">
          <el-input v-model="form.standards" :rows="4" type="textarea" style="width: 480px;" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="库存：" prop="storage">
          <el-input-number v-model="form.storage" :min="0" />
        </el-form-item>
        <el-form-item label="原价：" prop="originalPrice">
          <el-input v-model="form.originalPrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="直播价：" prop="typePrice">
          <el-input v-model="form.typePrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="预付款：" prop="payPrice">
          <el-input v-model="form.payPrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="佣金：" prop="income">
          <el-input v-model="form.income" style="width: 160px;" placeholder="请输入金额">
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
    <div v-if="goodsTableData.length" class="live-goods-table-wrap">
      <live-goods-table :goods-table-data="goodsTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LiveGoodsTable from '../components/goodsTable/index'
import { navigatePath } from '@/router'
import { brandList, goodsDetail, goodsSet } from '@/api/activityManage/marketModuleSet'
import { fileUpload } from '@/api/user'
import { validateMoney } from '@/utils/validate'
import { goodsTypeData } from '@/utils/data'

export default {
  name: 'LiveGoodsSet',
  components: {
    LiveGoodsTable
  },
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePicture = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        callback(new Error('请上传商品图片'))
      }
    }
    return {
      loading: false,
      brandList: [
        { id: 1, name: '品牌1' },
        { id: 2, name: '品牌2' },
        { id: 3, name: '品牌3' }
      ],
      form: {
        brand: '',
        name: '',
        picture: {},
        standards: '',
        storage: 0,
        originalPrice: '',
        typePrice: '',
        payPrice: '',
        income: '',
        sort: 0
      },
      rules: {
        brand: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        name: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        standards: [{ required: true, message: '请输入商品规格', trigger: 'blur' }],
        originalPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        typePrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        payPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        income: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      goodsTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getBrandList()
    this.goodsId && this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail() {
      goodsDetail({ activityId: this.activityData.id, goodsId: this.goodsId }).then(response => {
        const { brand_id, goods_name, goods_image, sku, storage, old_price, ms_price, front_money, commission, sort } = response.data
        this.form = {
          ...response.data,
          brand: brand_id,
          name: goods_name,
          picture: goods_image,
          standards: sku,
          storage,
          originalPrice: old_price,
          typePrice: ms_price,
          payPrice: front_money,
          income: commission,
          sort
        }
      })
    },
    getBrandList() {
      brandList(this.activityData.id).then(response => {
        this.brandList = response.data
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
          this.loading = true
          goodsSet({
            activityId: this.activityData.id,
            type: goodsTypeData.live,
            ...this.form
          }).then(response => {
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
  .live-goods-set-container{
    .live-goods-form-wrap{
      padding:24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 160px;
        }
      }
    }
    .live-goods-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
