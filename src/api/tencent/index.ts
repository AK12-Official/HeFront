/**
 * 腾讯位置服务 WebService API
 * 基于腾讯地图行政区划服务
 * 文档：https://lbs.qq.com/service/webService/webServiceGuide/search/webServiceDistrict
 */
import axios from 'axios'

// 腾讯位置服务API基础配置
const TX_API_BASE_URL = '/tx-api'  // 使用代理路径
const TX_API_KEY = '2KBBZ-IA6KW-AVXRW-YFQU6-RUZ4T-YHFFB'

// 行政区划数据类型定义
export interface DistrictItem {
    id: string          // 行政区划唯一标识（adcode）
    name: string        // 简称
    fullname: string    // 全称
    level: number       // 行政区划级别
    location: {
        lat: number       // 纬度
        lng: number       // 经度
    }
    pinyin?: string[]   // 拼音
    districts?: DistrictItem[] // 下级行政区划
}

export interface DistrictResponse {
    status: number
    message: string
    request_id: string
    data_version: number
    result: DistrictItem[]
}

export interface DistrictChildrenResponse {
    status: number
    message: string
    request_id: string
    data_version: number
    result: DistrictItem[]
}

// 创建axios实例
const txApiClient = axios.create({
    baseURL: TX_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
txApiClient.interceptors.request.use(
    (config) => {
        // 确保params对象存在
        if (!config.params) {
            config.params = {}
        }
        // 添加API密钥到所有请求
        config.params.key = TX_API_KEY
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
txApiClient.interceptors.response.use(
    (response) => {
        const data = response.data
        if (data.status !== 0) {
            throw new Error(data.message || 'API请求失败')
        }
        return data
    },
    (error) => {
        return Promise.reject(error)
    }
)



/**
 * 获取指定行政区划的子级行政区划
 * @param id 父级行政区划ID（adcode），缺省时返回一级行政区划（省级）
 * @param getPolygon 是否返回轮廓数据
 * @param maxOffset 轮廓抽稀精度（米）
 */
export const getDistrictChildren = async (
    id?: string,
    getPolygon: number = 0,
    maxOffset: number = 1000
): Promise<DistrictChildrenResponse> => {
    try {
        const response = await txApiClient.get('/getchildren', {
            params: {
                id,
                get_polygon: getPolygon,
                max_offset: maxOffset,
                output: 'json'
            }
        })
        return response as unknown as DistrictChildrenResponse
    } catch (error) {
        console.error('获取子级行政区划失败:', error)
        throw error
    }
}

/**
 * 获取省份列表（一级行政区划）
 */
export const getProvinces = async (): Promise<DistrictItem[]> => {
    try {
        const response = await getDistrictChildren()

        // 检查数据结构
        if (response.result && Array.isArray(response.result)) {
            // 如果result是二维数组，取第一个元素
            const provinces = Array.isArray(response.result[0]) ? response.result[0] : response.result
            return provinces
        }

        return []
    } catch (error) {
        throw error
    }
}

/**
 * 获取指定省份的城市列表（二级行政区划）
 * @param provinceId 省份ID（adcode）
 */
export const getCitiesByProvince = async (provinceId: string): Promise<DistrictItem[]> => {
    try {
        const response = await getDistrictChildren(provinceId)

        if (response.result && Array.isArray(response.result)) {
            const cities = Array.isArray(response.result[0]) ? response.result[0] : response.result
            return cities
        }

        return []
    } catch (error) {
        throw error
    }
}

/**
 * 获取指定城市的区县列表（三级行政区划）
 * @param cityId 城市ID（adcode）
 */
export const getDistrictsByCity = async (cityId: string): Promise<DistrictItem[]> => {
    try {
        const response = await getDistrictChildren(cityId)

        if (response.result && Array.isArray(response.result)) {
            const districts = Array.isArray(response.result[0]) ? response.result[0] : response.result
            return districts
        }

        return []
    } catch (error) {
        throw error
    }
}

export default {
    getDistrictChildren,
    getProvinces,
    getCitiesByProvince,
    getDistrictsByCity,
}
