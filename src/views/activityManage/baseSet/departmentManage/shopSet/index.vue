<template>
  <div class="shop-add-container">
    <div class="shop-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="所属品牌：" prop="brand">
          <el-select v-model="form.brand" filterable placeholder="请选择所属品牌">
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="name">
          <el-input v-model="form.name" style="width: 300px;" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址：" prop="address">
          <el-input v-model="form.address" style="width: 400px;" placeholder="请输入门店地址" @input="addressInputAction" />
        </el-form-item>
        <el-form-item label="地址定位：">
          <div id="map" class="address-location" />
        </el-form-item>
        <el-form-item label="门店电话：" prop="mobile">
          <el-input v-model="form.mobile" style="width: 240px;" placeholder="请输入门店电话" />
        </el-form-item>
        <el-form-item label="主管：" prop="manager">
          <el-select v-model="form.manager" filterable placeholder="请选择门店主管">
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
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { departmentDetail, departmentAdd, departmentEdit, brandShopList, employeeList } from '@/api/activityManage/baseSet'
import { debounce } from '@/utils/index'

export default {
  name: 'ShopSet',
  props: {
    brandId: {
      type: String,
      default: ''
    },
    shopId: {
      type: String,
      default: ''
    },
    activityId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bMap: '',
      map: '',
      loading: false,
      brandList: [],
      employeeList: [],
      form: {
        brand: '',
        name: '',
        address: '',
        location: {
          longitude: '', // 经度
          latitude: '' // 纬度
        },
        mobile: '',
        manager: 0,
        sort: 0
      },
      rules: {
        brand: [{ required: true, message: '请选择门店名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入门店电话', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initBaseData()
    if (this.shopId) {
      this.getShopData()
    } else {
      this.initMap()
    }
  },
  methods: {
    initMap() {
      // eslint-disable-next-line no-undef
      this.bMap = BMap
      const nanTongLocation = { longitude: 120.89, latitude: 31.98 } // 南通市经纬度
      let { longitude, latitude } = this.form.location
      const map = new this.bMap.Map('map')
      this.map = map
      if (!longitude && !latitude) {
        longitude = nanTongLocation.longitude
        latitude = nanTongLocation.latitude
      }
      const point = new this.bMap.Point(longitude, latitude)
      map.centerAndZoom(point, 16)
      map.enableScrollWheelZoom(true)
      map.addOverlay(new this.bMap.Marker(point))
      map.addEventListener('click', this.showMapInfo)
    },
    showMapInfo(e) {
      const { lng, lat } = e.point
      this.form.location = {
        longitude: lng,
        latitude: lat
      }
      const geoc = new this.bMap.Geocoder()
      geoc.getLocation(e.point, (res) => {
        this.form.address = res.address
      })
    },
    mapFixPosition(address) {
      const myGeo = new this.bMap.Geocoder()
      myGeo.getPoint(address, (point) => {
        if (point) {
          this.form.location = {
            longitude: point.lng,
            latitude: point.lat
          }
          this.map.centerAndZoom(point, 16)
          this.map.addOverlay(new this.bMap.Marker(point))
        } else {
          this.$message.error('该地址没有解析到结果！')
        }
      }, '江苏省南通市')
    },
    addressInputAction() {
      debounce(this.mapFixPosition.bind(this, this.form.address), 1000)()
    },
    async initBaseData() {
      const [brandResponse, employeeResponse] = await Promise.all([
        brandShopList(this.activityId),
        employeeList({ activityId: this.activityId, pageStatus: false })
      ])
      this.brandList = brandResponse.data
      this.employeeList = [{ id: 0, name: '暂无主管' }, ...employeeResponse.data]

      Number(this.brandId) && (this.form.brand = Number(this.brandId))
    },
    getShopData() {
      departmentDetail({ activityId: this.activityId, departmentId: this.shopId }).then(response => {
        const { pid, lnt, lat, charge_uid } = response.data
        this.form = {
          ...response.data,
          brand: pid || '',
          location: {
            longitude: lnt, // 经度
            latitude: lat // 纬度
          },
          manager: charge_uid || ''
        }
        this.initMap()
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
          const requestName = !this.shopId ? departmentAdd : departmentEdit
          this.loading = true
          const { brand, name, address, location: { longitude, latitude }, mobile, manager, sort } = this.form
          requestName({
            id: this.shopId,
            activityId: this.activityId,
            type: 2,
            name,
            manager,
            address,
            mobile,
            brand,
            longitude,
            latitude,
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
  .shop-add-container{
    .shop-wrap {
      padding: 24px 12px;
      background: #FFF;
      .address-location{
        width: 80%;
        min-width: 400px;
        max-width: 800px;
        height: 360px;
        background: #EEE;
      }
      .action-list{
        .el-button:first-child{
          margin-left: 180px;
        }
      }
    }
  }
</style>
