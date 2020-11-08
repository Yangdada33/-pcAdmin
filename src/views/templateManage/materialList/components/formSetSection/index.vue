<template>
  <div class="form-set-section-container">
    <div class="header-wrap">
      <div class="title">{{ title }}</div>
    </div>
    <div class="form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <slot />
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返 回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSetSection',
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return { content: '', media: '' }
      }
    },
    rules: {
      type: Object,
      default: () => {
        return { content: [] }
      }
    },
    materialFnData: {
      type: Object,
      default: () => {
        return { listFn: '', addFn: '', editFn: '', deleteFn: '' }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    formBackAction(param) {
      this.$emit('tabStepAction', { stepIndex: 0, backStatus: param !== undefined })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const requestName = !this.form.id ? this.materialFnData.addFn : this.materialFnData.editFn
          const params = { ...this.form }
          if (this.type === 'music') {
            params.type = 2
            params.resourceId = this.form.file.id
          } else if (this.type === 'note') {
            params.type = 0
          } else if (this.type === 'wechat') {
            params.resourceIds = this.form.fileList.map(item => item.id)
          } else if (this.type === 'live') {
            params.type = 1
          }
          requestName(params).then(response => {
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
  .form-set-section-container{
    background: #FFF;
    .header-wrap{
      padding: 16px 12px;
      border-bottom: 1px solid #EEE;
    }
    .form-wrap{
      padding-bottom: 24px;
      .el-form{
        margin-top: 20px;
        .el-form-item{
          &:last-child{
            margin-left: 180px;
          }
        }
      }
    }
  }
</style>
