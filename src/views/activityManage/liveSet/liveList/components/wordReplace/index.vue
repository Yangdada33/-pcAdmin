<template>
  <div class="word-replace-container">
    <div class="word-replace-wrap">
      <el-form ref="form" :model="form" label-width="100px" size="small">
        <el-form-item v-for="(item,index) in form.wordList" :key="index" :label="`敏感词${index + 1}：`" style="margin-bottom: 0">
          <el-row type="flex">
            <el-form-item
              label-width="0"
              :prop="'wordList.' + index + '.content'"
              :rules="[{ required: true, message: '请输入敏感词', trigger: 'blur' }]"
            >
              <el-input v-model="item.content" placeholder="请输入敏感词" />
            </el-form-item>
            <span class="separator"> 替换为 </span>
            <el-form-item
              label-width="0"
              :prop="'wordList.' + index + '.replace_content'"
              :rules="[{ required: true, message: '请输入替换词', trigger: 'blur' }]"
            >
              <el-input v-model="item.replace_content" placeholder="请输入替换词" />
            </el-form-item>
            <el-button v-if="form.wordList.length > 1" type="default" @click="deleteWordAction(index)">删除</el-button>
            <el-button v-if="form.wordList.length && index === form.wordList.length - 1" type="primary" @click="addWordAction">新增</el-button>
          </el-row>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="primary" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { liveWordList, liveWordSet } from '@/api/activityManage/liveSet'

export default {
  name: 'LiveWordReplace',
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        wordList: [{ content: '', replace_content: '' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.liveId && this.getLiveWordList()
  },
  methods: {
    getLiveWordList() {
      liveWordList({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        response.data && (this.form.wordList = response.data.content)
      })
    },
    addWordAction() {
      this.form.wordList.push({ content: '', replace_content: '' })
    },
    deleteWordAction(index) {
      this.form.wordList.splice(index, 1)
    },
    prevStepAction() {
      this.$emit('stepAction', { type: 'prev' })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          liveWordSet({ activityId: this.activityData.id, liveId: this.liveId, wordList: this.form.wordList }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.$emit('stepAction', { type: 'next' })
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
  .word-replace-container{
    .word-replace-wrap{
      padding:24px 12px;
      background: #FFF;
      .separator{
        padding: 0 8px;
        &~.el-button{
          height: 32px;
          margin-left: 12px;
        }
      }
      .action-list{
        .el-button:first-child{
          margin-left: 140px;
        }
      }
    }
  }
</style>
