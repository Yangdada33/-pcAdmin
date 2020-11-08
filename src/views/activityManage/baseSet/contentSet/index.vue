<template>
  <div class="content-set-container">
    <div class="content-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="活动类型：">
          <el-radio-group v-model="form.activityType">
            <el-radio v-for="(item, index) in activityTypeList" :key="item" :label="index">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启直播：">
          <el-radio-group v-model="form.liveStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动主题：" prop="activityTheme">
          <el-input v-model="form.activityTheme" style="width: 300px" placeholder="请输入活动主题" />
        </el-form-item>
        <el-form-item label="活动时间：" prop="activityTimeRange">
          <el-date-picker
            v-model="form.activityTimeRange"
            style="width: 360px"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item label="地区限制：">
          <el-radio-group v-model="form.areaStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.areaStatus" label="活动地区：" style="margin-bottom: 0">
          <el-form-item v-for="(item, index) in form.areaList" :key="item.id" prop="areaList">
            <el-cascader
              v-model="form.areaList[index]"
              :options="areaOptions"
            />
            <el-button v-if="form.areaList.length > 1" type="default" @click="removeAreaAction(index)">删除</el-button>
            <el-button v-if="index === form.areaList.length - 1" type="primary" @click="addAreaAction">新增</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item ref="mainPicture" label="主图图片：" prop="mainPicture">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(this, 'mainPicture')"
            :http-request="fileUploadAction.bind(this, 'mainPicture')"
          >
            <img v-if="form.mainPicture.id" :src="form.mainPicture.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸比例：3:4；此处主图是展示在首页最上方的图，建议根据模板色调上传接近颜色的主图</div>
        </el-form-item>
        <el-form-item label="音乐：">
          <el-radio-group v-model="form.musicStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.musicStatus" ref="musicData" class="clearfix" label="选择音乐：" prop="musicData">
          <el-select v-model="form.musicData.id" placeholder="请选择" @change="handleMusicDataChange">
            <el-option-group
              v-for="group in musicOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
                <div class="music-wrap clearfix">
                  <svg-icon icon-class="music" class-name="music-icon" />
                  <div class="music-title ellipsis">{{ item.title }}</div>
                  <svg-icon
                    :icon-class="item.id === musicData.id ? 'play' : 'pause'"
                    class-name="music-icon"
                    @click.stop="handlePlayAction(item)"
                  />
                </div>
              </el-option>
            </el-option-group>
          </el-select>
          <el-upload
            class="upload-music"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(this, 'musicData')"
            :http-request="fileUploadAction.bind(this, 'musicData')"
          >
            <el-button type="primary" icon="el-icon-folder-add">自定义</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="弹幕：">
          <el-radio-group v-model="form.barrageStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告：">
          <el-radio-group v-model="form.noticeStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.noticeStatus" label="公告编辑：" prop="noticeCont">
          <el-input v-model="form.noticeCont" style="width: 400px" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="客服电话：" prop="serviceMobile">
          <el-input v-model="form.serviceMobile" style="width: 200px" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item ref="groupQrCode" label="群二维码：" prop="groupQrCode">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(this, 'groupQrCode')"
            :http-request="fileUploadAction.bind(this, 'groupQrCode')"
          >
            <img v-if="form.groupQrCode.id" :src="form.groupQrCode.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸比例：1:1，建议大小不超过1M</div>
        </el-form-item>
        <el-form-item ref="posterList" label="推广海报：" prop="posterList">
          <el-upload
            class="avatar-uploader"
            action=""
            multiple
            list-type="picture-card"
            :show-file-list="true"
            :file-list="form.posterList"
            :before-upload="beforeAvatarUpload.bind(this, 'posterList')"
            :http-request="fileUploadAction.bind(this, 'posterList')"
            :on-remove="handleAvatarRemove.bind(this, 'posterList')"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="form-tip">注：尺寸比例：2:3，建议800*1200，大小不超过1M；可上传多张</div>
        </el-form-item>
        <el-form-item label="海报描述：" prop="posterDesc">
          <el-input v-model="form.posterDesc" :rows="4" type="textarea" style="width: 400px;" placeholder="请输入海报描述" />
        </el-form-item>
        <el-form-item label="商品限购：">
          <el-input-number v-model="form.goodsLimitNum" :min="0" />
          <div class="form-tip">注：0表示不限购。此限购表示用户在购买爆款商品、秒杀商品时仅可购买几款商品</div>
        </el-form-item>
        <el-form-item v-if="form.goodsLimitNum" label="限购说明：" prop="goodsLimitDes">
          <el-input v-model="form.goodsLimitDes" :rows="4" type="textarea" style="width: 400px" placeholder="请输入限购说明" />
        </el-form-item>
        <el-form-item v-if="activityData.id" label="审核人" prop="reviewPerson">
          <el-select v-model="form.reviewPerson" multiple filterable style="width: 400px" placeholder="请选择">
            <el-option
              v-for="item in employeeList"
              :key="item.id"
              :label="item.name + '-' + item.mobile"
              :value="item.id.toString()"
            />
          </el-select>
        </el-form-item>
        <div class="group-wrap share-set-wrap">
          <div class="group-title">分享设置：</div>
          <el-form-item class="group-list" label-width="12px">
            <el-form-item label="分享标题：" prop="shareTitle">
              <el-input v-model="form.shareTitle" style="width: 400px" placeholder="请输入分享标题" />
            </el-form-item>
            <el-form-item label="分享描述：" prop="shareDesc">
              <el-input v-model="form.shareDesc" :rows="4" type="textarea" style="width: 400px;" placeholder="请输入分享描述" />
            </el-form-item>
            <el-form-item ref="sharePicture" label="分享图片：" prop="sharePicture">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload.bind(this, 'sharePicture')"
                :http-request="fileUploadAction.bind(this, 'sharePicture')"
              >
                <img v-if="form.sharePicture.id" :src="form.sharePicture.url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="form-tip">注：尺寸大小：100*100像素，大小不超过1M</div>
            </el-form-item>
          </el-form-item>
        </div>
        <el-form-item class="action-list">
          <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <audio ref="audioNode" :v-show="false" :src="musicData.url" loop />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { regionDataPlus } from 'element-china-area-data'
import { navigatePath } from '@/router'
import { parseTime, string2Date } from '@/utils/index'
import { fileUpload } from '@/api/user'
import { materialList } from '@/api/platformSet/material'
import { activityBaseEdit, employeeListWithActivity } from '@/api/activityManage/baseSet'
import { materialTypeData } from '@/utils/data'

const areaItemData = { id: 1, value: [], label: '请选择' }

export default {
  name: 'ContentSet',
  data() {
    const validateArray = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        const tipData = {
          activityTimeRange: '请选择活动时间！',
          posterList: '请上传活动海报！'
        }
        callback(new Error(tipData[rule.field]))
      }
    }
    const validateAreaList = (rule, value, callback) => {
      if (this.form.areaStatus && Array.isArray(value) && value.length && value[0].length) {
        callback()
      } else {
        callback(new Error('请选择活动地区！'))
      }
    }
    const validateFileData = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        const tipData = {
          mainPicture: '请上传主图文件！',
          musicData: '请上传音乐文件！',
          sharePicture: '请上传分享图片！',
          groupQrCode: '请上传群二维码图片！'
        }
        callback(new Error(tipData[rule.field]))
      }
    }
    const validateNoticeCont = (rule, value, callback) => {
      if (this.form.noticeStatus && value) {
        callback()
      } else {
        callback(new Error('请输入活动公告！'))
      }
    }
    return {
      loading: false,
      activityTypeList: ['单品牌版', '联盟版', '工厂版'],
      areaOptions: regionDataPlus,
      musicOptions: [],
      activityLiveStatus: false,
      employeeList: [],
      form: {
        activityType: 0,
        liveStatus: 0,
        activityTheme: '',
        activityTimeRange: [],
        areaStatus: 0,
        areaList: [[]],
        mainPicture: {},
        musicStatus: 0,
        musicData: {},
        barrageStatus: 0,
        noticeStatus: 0,
        noticeCont: '',
        serviceMobile: '',
        groupQrCode: {},
        posterList: [],
        posterDesc: '',
        goodsLimitNum: 0,
        goodsLimitDes: '',
        reviewPerson: [],
        shareTitle: '',
        shareDesc: '',
        sharePicture: {}
      },
      rules: {
        activityTheme: [{ required: true, message: '请输入活动主题', trigger: 'blur' }],
        activityTimeRange: [{ required: true, validator: validateArray, trigger: 'blur' }],
        areaList: [{ required: true, validator: validateAreaList, trigger: 'blur' }],
        mainPicture: [{ required: true, validator: validateFileData, trigger: 'blur' }],
        musicData: [{ required: true, validator: validateFileData, trigger: 'blur' }],
        noticeCont: [{ required: true, validator: validateNoticeCont, trigger: 'blur' }],
        serviceMobile: [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
        groupQrCode: [{ required: true, validator: validateFileData, trigger: 'blur' }],
        posterList: [{ required: true, validator: validateArray, trigger: 'blur' }],
        posterDesc: [{ required: true, message: '请输入海报描述', trigger: 'blur' }],
        goodsLimitDes: [{ required: true, message: '请输入限购说明', trigger: 'blur' }],
        shareTitle: [{ required: true, message: '请输入分享标题', trigger: 'blur' }],
        shareDesc: [{ required: true, message: '请输入分享描述', trigger: 'blur' }],
        sharePicture: [{ required: true, validator: validateFileData, trigger: 'blur' }]
      },
      musicData: {
        id: '',
        resourceId: '',
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'moduleList'
    ])
  },
  created() {
    this.getMusicList()
    this.getEmployeeListWithActivity()
  },
  beforeDestroy() {
    !this.$refs['audioNode'].paused && this.$refs['audioNode'].pause()
  },
  methods: {
    initFormData() {
      if (this.activityData.id && this.activityData.name) {
        const {
          activity_type, is_live, name, start_time, end_time, is_area_limit, area_limit, main_image,
          is_open_music, bgm, is_open_barrage, is_open_notice, notice, mobile, qrcode, poster, copywrite, signids,
          activity_config: { goods_limit, goods_limit_remark, share_title, share_desc, share_image }
        } = this.activityData
        this.activityLiveStatus = is_live
        const activityTimeRange = [string2Date(start_time), string2Date(end_time)]
        const areaList = area_limit && area_limit.length ? area_limit.map(item => item.length < 3 ? [...item, ''] : item) : [[]] // [['110000'], ['120000', '120100']]
        const musicData = bgm && bgm.id && this.musicOptions.length ? (this.musicOptions[0].options.find(item => Number(item.resourceId) === Number(bgm.id)) || {}) : {}
        const reviewPerson = signids ? signids.split(',') : []
        this.form = {
          activityType: activity_type,
          liveStatus: is_live,
          activityTheme: name,
          activityTimeRange: activityTimeRange,
          areaStatus: is_area_limit,
          areaList,
          mainPicture: main_image,
          musicStatus: is_open_music,
          musicData,
          barrageStatus: is_open_barrage,
          noticeStatus: is_open_notice,
          noticeCont: notice,
          serviceMobile: mobile,
          groupQrCode: qrcode,
          posterList: poster,
          posterDesc: copywrite,
          goodsLimitNum: goods_limit,
          goodsLimitDes: goods_limit_remark,
          reviewPerson,
          shareTitle: share_title,
          shareDesc: share_desc,
          sharePicture: share_image
        }
      }
    },
    getMusicList() {
      materialList({ type: materialTypeData.music, pageStatus: false }).then(response => {
        const options = response.data.map((item, index) => ({ id: '2-' + index, resourceId: item.resource_id.id, url: item.resource_id.url, title: item.content }))
        this.musicOptions = [{ label: '推荐音乐', options }]
        this.initFormData()
      }).catch(() => {
        this.initFormData()
      })
    },
    getEmployeeListWithActivity() {
      this.activityData.id && employeeListWithActivity(this.activityData.id).then(response => {
        this.employeeList = response.data
      })
    },
    beforeAvatarUpload(type, file) {
      this.$refs[type].clearValidate()
      if (['mainPicture', 'groupQrCode', 'posterList', 'sharePicture'].includes(type)) {
        const isImage = file.type.startsWith('image')
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isImage) {
          this.$message.error('请上传图片文件!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过2MB!')
        }
        return isImage && isLt2M
      } else if (type === 'musicData') {
        const isAudio = file.type.startsWith('audio')
        const isLt15M = file.size / 1024 / 1024 < 15
        if (!isAudio) {
          this.$message.error('请上传音频文件!')
        }
        if (!isLt15M) {
          this.$message.error('上传音频大小不能超过15MB!')
        }
        return isAudio && isLt15M
      }
    },
    fileUploadAction(type, options) {
      fileUpload(options.file).then(response => {
        this.$message.success(response.msg)
        const { resource_id, url } = response.data
        if (['mainPicture', 'groupQrCode', 'musicData', 'sharePicture'].includes(type)) {
          if (type === 'musicData') {
            const title = options.file.name.substring(0, options.file.name.lastIndexOf('.'))
            if (this.musicOptions.length === 1) {
              this.musicOptions.unshift({ label: '自定义音乐', options: [{ id: '1-0', index: 0, resourceId: resource_id, url, title }] })
              this.form[type] = { id: '1-0', resourceId: resource_id, url, uid: options.file.uid }
            } else {
              const lastIndex = this.musicOptions[0][this.musicOptions[0].length - 1].index
              const customId = '1-' + (lastIndex + 1)
              this.musicOptions[0].push({ id: customId, index: lastIndex, resourceId: resource_id, url, title })
              this.form[type] = { id: customId, resourceId: resource_id, url, uid: options.file.uid }
            }
          } else {
            this.form[type] = { id: resource_id, url, uid: options.file.uid }
          }
        } else if (type === 'posterList') {
          this.form[type].push({ id: resource_id, url, uid: options.file.uid })
        }
      })
    },
    handleAvatarRemove(type, file, fileList) {
      if (['mainPicture', 'groupQrCode', 'musicData', 'sharePicture'].includes(type)) {
        this.form[type] = {}
      } else if (type === 'posterList') {
        const removeIndex = this.form.posterList.findIndex(item => item.uid === file.uid)
        if (removeIndex > -1) {
          this.form.posterList.splice(removeIndex, 1)
        }
      }
    },
    removeAreaAction(index) {
      const { areaList } = this.form
      areaList.splice(index, 1)
      this.form.areaList = areaList
    },
    addAreaAction() {
      const { areaList } = this.form
      const lastAreaItem = areaList[areaList.length - 1]
      const newAreaItem = { ...areaItemData }
      newAreaItem.id = lastAreaItem.id + 1
      this.form.areaList.push(newAreaItem)
    },
    handlePlayAction(item) {
      const audioNode = this.$refs['audioNode']
      if (item.id === this.musicData.id) {
        this.$nextTick(() => {
          if (audioNode.paused) {
            audioNode.play()
          } else {
            audioNode.pause()
            this.musicData = {
              id: '',
              resourceId: '',
              url: ''
            }
          }
        })
      } else {
        this.musicData = {
          id: item.id,
          resourceId: item.resourceId,
          url: item.url
        }
        audioNode.load()
        this.$nextTick(() => {
          audioNode.play()
        })
      }
    },
    handleMusicDataChange(value) {
      this.$refs.musicData.clearValidate()
    },
    prevStepAction() {
      navigatePath('/activityManage/baseSet/templateSelect')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const {
            activityType,
            liveStatus,
            activityTheme,
            activityTimeRange: [startTime, endTime],
            areaStatus,
            areaList,
            mainPicture,
            musicStatus,
            musicData,
            barrageStatus,
            noticeStatus,
            noticeCont,
            serviceMobile,
            groupQrCode,
            posterList,
            posterDesc,
            goodsLimitNum,
            goodsLimitDes,
            reviewPerson,
            shareTitle,
            shareDesc,
            sharePicture
          } = this.form
          const areaListClone = areaList.map(item => item.filter(itemItem => itemItem))
          let musicDataClone = {}
          if (musicData.id) {
            const [indexPrefix, indexSuffix] = musicData.id.split('-')
            let groupIndex = ''
            if (indexPrefix === '1') {
              groupIndex = 0
            } else if (indexPrefix === '2') {
              if (this.musicOptions.length === 1) {
                groupIndex = 0
              } else if (this.musicOptions.length === 2) {
                groupIndex = 1
              }
            }
            const { id, resourceId, url, title } = this.musicOptions[groupIndex].options[indexSuffix]
            musicDataClone = { id: resourceId, url, content: title, status: Boolean(id.startsWith('1')) }
          }
          const activityData = {
            activity_id: this.activityData.id,
            activity_type: activityType,
            is_live: liveStatus,
            name: activityTheme,
            start_time: parseTime(startTime),
            end_time: parseTime(endTime),
            is_area_limit: areaStatus,
            area_limit: areaListClone[0].length ? areaListClone : [],
            main_image: mainPicture,
            is_open_music: musicStatus,
            bgm: musicDataClone,
            is_open_barrage: barrageStatus,
            is_open_notice: noticeStatus,
            notice: noticeCont,
            mobile: serviceMobile,
            qrcode: groupQrCode,
            poster: posterList,
            copywrite: posterDesc,
            signids: reviewPerson.join(','),
            activity_config: {
              goods_limit: goodsLimitNum,
              goods_limit_remark: goodsLimitDes,
              share_title: shareTitle,
              share_desc: shareDesc,
              share_image: sharePicture
            }
          }
          this.loading = true
          activityBaseEdit({
            ...activityData,
            goods_limit: goodsLimitNum,
            goods_limit_remark: goodsLimitDes,
            share_title: shareTitle,
            share_desc: shareDesc,
            share_image: sharePicture
          }).then(response => {
            this.$message.success(response.msg)
            this.$store.commit('activity/setActivityData', { ...this.activityData, ...activityData })
            this.loading = false
            if (liveStatus) {
              if (!this.activityLiveStatus) {
                this.moduleList.splice(this.moduleList.length - 1, 0, { path: 'liveSet' })
                this.$store.commit('activity/setModuleList', this.moduleList)
              }
            } else {
              if (this.activityLiveStatus) {
                this.moduleList.splice(this.moduleList.length - 2, 1)
                this.$store.commit('activity/setModuleList', this.moduleList)
              }
            }
            navigatePath('/activityManage/baseSet/departmentManage')
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
  .content-set-container{
    .content-wrap{
      padding:24px 12px;
      background: #FFF;
      .el-cascader ~ .el-button,
      .el-select ~ .el-button{
        margin-left: 10px;
      }
      .el-select,
      .upload-music{
        float: left;
      }
      .upload-music{
        margin-left: 10px;
      }
      .action-list{
        .el-button:first-child{
          // margin-left: 140px
          margin-left: 160px;
        }
      }
    }
  }

  .music-wrap{
    .music-icon{
      float: left;
      margin-top: 8px;
      font-size: 18px;
      &:last-child{
        float: right;
      }
    }
    .music-title{
      float: left;
      width: 200px;
      margin: 0 4px;
    }
  }
</style>
