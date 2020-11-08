<template>
  <div class="brand-edit-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model="form.name" style="width: 240px;" placeholder="请输入品牌名称" />
      </el-form-item>
      <el-form-item label="品牌logo：" prop="logo">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="fileUploadAction"
        >
          <img v-if="form.logo.id" :src="form.logo.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <div class="form-tip">注：尺寸300*200，建议大小不超过1M</div>
      </el-form-item>
      <el-form-item label="负责人：" prop="manager">
        <el-select v-model="form.manager" filterable placeholder="请选择品牌负责人">
          <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number v-model="form.sort" :min="0" />
        <div class="form-tip">注：以10、20、30等为基础数值，数值越大排序越靠前，中间可插，比如12，就介于10、20之间</div>
      </el-form-item>
      <el-form-item class="action-list">
        <el-button type="default" @click="formBackAction">返 回</el-button>
        <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { fileUpload } from '@/api/user'
import { departmentDetail, departmentAdd, departmentEdit, employeeList } from '@/api/activityManage/baseSet'

export default {
  name: 'BrandSet',
  props: {
    brandId: {
      type: String,
      default: ''
    },
    activityId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateBrandLogo = (rule, value, callback) => {
      if (value.id) {
        callback()
      } else {
        callback(new Error('请上传品牌logo！'))
      }
    }
    return {
      loading: false,
      employeeList: [],
      form: {
        name: '',
        logo: {},
        manager: 0,
        sort: 0
      },
      rules: {
        name: [{ required: true, message: '请输入品牌名称！', trigger: 'blur' }],
        logo: [{ required: true, validator: validateBrandLogo, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEmployeeList()
    if (this.brandId) {
      this.getBrandData()
    }
  },
  methods: {
    getBrandData() {
      departmentDetail({ activityId: this.activityId, departmentId: this.brandId }).then(response => {
        const resultData = response.data
        if (resultData) {
          this.form = { ...resultData, manager: resultData.charge_uid }
        }
      })
    },
    getEmployeeList() {
      employeeList({ activityId: this.activityId, pageStatus: false }).then(response => {
        const resultData = response.data
        if (resultData) {
          this.employeeList = [{ id: 0, name: '暂无主管' }, ...resultData]
        } else {
          this.employeeList = [{ id: 0, name: '暂无主管' }]
        }
      })
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image')
      const isLt2M = file.size / 1024 / 1024
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
        this.form.logo = { id: resource_id, url }
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
          const requestName = !this.brandId ? departmentAdd : departmentEdit
          this.loading = true
          const { name, logo, manager, sort } = this.form
          requestName({
            id: this.brandId,
            activityId: this.activityId,
            type: 1,
            name,
            logo,
            manager,
            sort
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
  .brand-edit-container{
    padding:36px 12px;
    background: #FFF;
    .action-list{
      .el-button:first-child{
        margin-left: 40px;
      }
    }
  }
</style>
