<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="music-table-set-container">
    <div class="music-table-set-wrap">
      <div v-if="!stepIndex" class="music-table">
        <table-page-section
          type="music"
          :back-status="backStatus"
          :table-data-clone="tableDataClone"
          :page-data-clone="pageDataClone"
          :material-type="materialType"
          :material-fn-data="materialFnData"
          :hide-edit-action="true"
          @tabStepAction="tabStepAction"
          @deleteExtraAction="deleteExtraAction"
          @tableDataCloneAction="tableDataCloneAction"
        >
          <template v-slot:default>
            <el-table-column
              prop="content"
              label="音乐标题"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <svg-icon icon-class="table_icon_music" />
                <span style="padding-left: 4px">{{ scope.row.content }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:action="scope">
            <svg-icon :icon-class="scope.row.id === musicData.id? 'table_icon_play' : 'table_icon_pause'" class-name="table-action audio-action" @click="handlePlayAction(scope)" />
          </template>
        </table-page-section>
      </div>
      <div v-else class="music-set">
        <form-set-section
          type="music"
          :title="'音乐素材库 / ' + (form.id ? '编辑' : '新增')"
          :form="form"
          :rules="rules"
          :material-fn-data="materialFnData"
          @tabStepAction="tabStepAction"
        >
          <template v-slot:default>
            <el-form-item label="本地上传：" prop="content">
              <el-row type="flex" align="middle">
                <el-input v-model="form.content" :disabled="!form.file.id" style="width: 300px;margin-right: 8px" placeholder="请输入音乐标题" />
                <el-upload
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="fileUploadAction"
                >
                  <el-button type="primary" icon="el-icon-folder-add" size="small">上传</el-button>
                </el-upload>
              </el-row>
              <div class="form-tip">注：请先上传或选择音乐文件，再编辑音乐标题。建议音频不超过15M</div>
            </el-form-item>
            <el-form-item label="平台导入：" style="width: 700px">
              <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  style="width: 100%"
                  size="mini"
                  border
                  @select="handleSelection"
                >
                  <el-table-column
                    type="selection"
                    width="60"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="content"
                    label="音乐标题"
                    min-width="160"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <svg-icon icon-class="table_icon_music" />
                      <span style="padding-left: 4px">{{ scope.row.content }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="试听" width="100" align="center" header-align="center">
                    <template slot-scope="scope">
                      <svg-icon :icon-class="scope.row.id === musicData.id? 'table_icon_play' : 'table_icon_pause'" class-name="table-action audio-action" @click="handlePlayAction(scope)" />
                    </template>
                  </el-table-column>
                </el-table>
              </pagination-section>
            </el-form-item>
          </template>
        </form-set-section>
      </div>
    </div>

    <audio ref="audioNode" :v-show="false" :src="musicData.resource_id.url" loop />
  </div>
</template>

<script>
import TablePageSection from '../tablePageSection/index'
import FormSetSection from '../formSetSection/index'
import PaginationSection from '@/components/PaginationSection'
import { materialList, materialAdd, materialEdit, materialDelete } from '@/api/platformSet/material'
import { fileUpload } from '@/api/user'
import { audioSuffixList, materialTypeData } from '@/utils/data'

export default {
  name: 'MusicTableSet',
  components: {
    TablePageSection,
    FormSetSection,
    PaginationSection
  },
  props: {
    materialType: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (!value) {
        if (this.form.file.id) {
          callback(new Error('请输入音乐标题！'))
        } else {
          callback(new Error('请上传音乐文件！'))
        }
      } else {
        callback()
      }
    }
    return {
      materialFnData: {
        listFn: materialList,
        addFn: materialAdd,
        editFn: materialEdit,
        deleteFn: materialDelete
      },
      stepIndex: 0, // 0-表格 1-表单
      backStatus: false, // 表单返回状态
      tableDataClone: [],
      pageDataClone: {
        index: 1,
        size: 10,
        total: 0
      },
      musicData: {
        resource_id: {
          id: '',
          url: ''
        },
        index: ''
      },
      fileName: '',
      form: {
        file: {
          id: '',
          url: ''
        },
        content: '',
        material: {}
      },
      rules: {
        content: [{ validator: validateFile, trigger: 'blur' }]
      },
      pageData: {
        index: 0,
        size: 10,
        total: 0
      },
      /*
      tableData: [{
        id: 1,
        content: '标题1',
        resource_id: {
          id: 33,
          url: 'https://img.fmlesson.cn/fmkj/20200828/91d2d33538929ea6b1680ece0b22334e.mp3'
        }
      }, {
        id: 2,
        content: '标题2',
        resource_id: {
          id: 34,
          url: 'https://img.fmlesson.cn/fmkj/20200828/a9ec3b5f29e2f9cc52bcdb92c1177930.mp3'
        }
      }],
      */
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    tabStepAction({ stepIndex, form, backStatus }) {
      this.stepIndex = stepIndex
      if (form) {
        this.form = form
      } else {
        this.musicData = {
          resource_id: {
            id: '',
            url: ''
          },
          index: ''
        }
        this.deleteExtraAction()
        if (!stepIndex) {
          this.backStatus = backStatus
          this.form = {
            file: { id: '', url: '' },
            content: '',
            material: {}
          }
        } else {
          this.getMusicMaterialList()
        }
      }
    },
    deleteExtraAction() {
      !this.$refs['audioNode'].paused && this.$refs['audioNode'].pause()
    },
    tableDataCloneAction({ list, page, backStatus }) {
      this.tableDataClone = list
      this.pageDataClone = page
      this.backStatus = backStatus
    },
    beforeAvatarUpload(file) {
      const fileType = file.type.split('/')[0]
      const fileSuffix = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      const isAudio = fileType === 'audio' && audioSuffixList.includes(fileSuffix)
      const isLt15M = file.size / 1024 / 1024 < 15
      if (!isAudio) {
        this.$message.error('请上传音频文件!')
      } else if (!isLt15M) {
        this.$message.error('上传音频大小不能超过15MB!')
      } else {
        this.fileName = file.name.substring(0, file.name.lastIndexOf('.'))
      }
      return isAudio && isLt15M
    },
    fileUploadAction(options) {
      const messageObject = this.$message.info({
        message: '文件上传中，请等候...',
        duration: 0
      })
      fileUpload(options.file).then(response => {
        const { resource_id, url } = response.data
        this.form.file = { id: resource_id, url }
        this.form.content = this.fileName
        messageObject.close()
      }).catch(() => {
        this.fileName = ''
        messageObject.close()
      })
    },
    getMusicMaterialList() {
      materialList({ ...this.pageData, type: materialTypeData.music, sponsorId: 0 }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
      })
    },
    handleSelection(value) {
      if (value.length) {
        let selectedItem = {}
        if (!this.form.material.id) {
          selectedItem = value[0]
        } else {
          this.$refs['multipleTable'].toggleRowSelection(this.form.material)
          selectedItem = value.find(item => item.id !== this.form.material.id)
        }
        this.fileName = selectedItem.content
        this.form.file = selectedItem.resource_id
        this.form.content = selectedItem.content
        this.form.material = selectedItem
      } else {
        this.fileName = ''
        this.form = {
          file: {
            id: '',
            url: ''
          },
          content: '',
          material: {}
        }
      }
    },
    handlePlayAction(scope) {
      const audioNode = this.$refs['audioNode']
      if (scope.$index === this.musicData.index) {
        this.$nextTick(() => {
          if (audioNode.paused) {
            audioNode.play()
          } else {
            audioNode.pause()
            this.musicData = {
              resource_id: {
                id: '',
                url: ''
              },
              index: ''
            }
          }
        })
      } else {
        this.musicData = { ...scope.row, index: scope.$index }
        audioNode.load()
        this.$nextTick(() => {
          audioNode.play()
        })
      }
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getMusicMaterialList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getMusicMaterialList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .audio-action{
    font-size: 20px;
    cursor: pointer;
  }
</style>
