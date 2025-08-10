/**
 * MallLite后台管理系统API接口
 * 基于后台管理系统接口文档和Postman集合
 */
import request from "@/utils/request";
import type {
    AdminCommonResult,
    AdminPageResult,
    AdminRegisterParams,
    AdminLoginParams,
    AdminLoginResponse,
    AdminUpdatePasswordParams,
    AdminInfo,
    Admin,
    AdminListParams,
    AdminUpdateParams,
    AdminStatusUpdateParams,
    AdminRoleUpdateParams,
    ProductCreateParams,
    ProductListParams,
    ProductUpdateInfo,
    AdminProduct,
    ProductSimple,
    ProductBatchStatusParams,
    ProductCategory,
    ProductCategoryCreateParams,
    AdminOrderListParams,
    AdminOrder,
    OrderBatchDeliveryParams,
    OrderCloseParams,
    AdminOrderDetail,
    OrderReceiverInfoUpdateParams,
    OrderMoneyInfoUpdateParams,
    OrderNoteUpdateParams,
    AdminRole,
    AdminRoleCreateParams,
    AdminRoleStatusParams,
    AdminRoleMenuParams,
    AdminRoleResourceParams,
    AdminResource,
    AdminResourceCreateParams,
    AdminResourceListParams,
    FileUploadResponse,
    MinioDeleteParams,
    OssSignResponse,
} from "./types";

// ==================== 认证授权接口 ====================

/**
 * 用户注册
 */
export const register = (params: AdminRegisterParams): Promise<AdminCommonResult<Admin>> => {
    return request.post('/admin/register', params);
};

/**
 * 用户登录
 */
export const login = (params: AdminLoginParams): Promise<AdminCommonResult<AdminLoginResponse>> => {
    return request.post('/admin/login', params);
};

/**
 * 刷新Token
 */
export const refreshToken = (): Promise<AdminCommonResult<AdminLoginResponse>> => {
    return request.get('/admin/refreshToken');
};

/**
 * 获取当前用户信息
 */
export const getAdminInfo = (): Promise<AdminCommonResult<AdminInfo>> => {
    return request.get('/admin/info');
};

/**
 * 用户登出
 */
export const logout = (): Promise<AdminCommonResult<null>> => {
    return request.post('/admin/logout');
};

// ==================== 用户管理接口 ====================

/**
 * 分页查询用户列表
 */
export const getAdminList = (params: AdminListParams = {}): Promise<AdminCommonResult<AdminPageResult<Admin>>> => {
    const { pageNum = 1, pageSize = 5, keyword } = params;
    return request.get('/admin/list', {
        params: { pageNum, pageSize, keyword }
    });
};

/**
 * 获取指定用户信息
 */
export const getAdminById = (id: number): Promise<AdminCommonResult<Admin>> => {
    return request.get(`/admin/${id}`);
};

/**
 * 修改指定用户信息
 */
export const updateAdmin = (id: number, params: AdminUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/admin/update/${id}`, params);
};

/**
 * 修改用户密码
 */
export const updateAdminPassword = (params: AdminUpdatePasswordParams): Promise<AdminCommonResult<number>> => {
    return request.post('/admin/updatePassword', params);
};

/**
 * 删除用户
 */
export const deleteAdmin = (id: number): Promise<AdminCommonResult<number>> => {
    return request.post(`/admin/delete/${id}`);
};

/**
 * 修改用户状态
 */
export const updateAdminStatus = (id: number, params: AdminStatusUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/admin/updateStatus/${id}`, null, {
        params: { status: params.status }
    });
};

/**
 * 给用户分配角色
 */
export const updateAdminRole = (params: AdminRoleUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/admin/role/update', null, {
        params: { adminId: params.adminId, roleIds: params.roleIds.join(',') }
    });
};

/**
 * 获取用户角色列表
 */
export const getAdminRoleList = (adminId: number): Promise<AdminCommonResult<AdminRole[]>> => {
    return request.get(`/admin/role/${adminId}`);
};

// ==================== 商品管理接口 ====================

/**
 * 创建商品
 */
export const createProduct = (params: ProductCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/create', params);
};

/**
 * 查询商品列表
 */
export const getProductList = (params: ProductListParams = {}): Promise<AdminCommonResult<AdminPageResult<AdminProduct>>> => {
    const { pageNum = 1, pageSize = 5, ...rest } = params;
    return request.get('/product/list', {
        params: { pageNum, pageSize, ...rest }
    });
};

/**
 * 获取商品编辑信息
 */
export const getProductUpdateInfo = (id: number): Promise<AdminCommonResult<ProductUpdateInfo>> => {
    return request.get(`/product/updateInfo/${id}`);
};

/**
 * 更新商品
 */
export const updateProduct = (id: number, params: ProductCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/product/update/${id}`, params);
};

/**
 * 商品简单查询
 */
export const getProductSimpleList = (keyword?: string): Promise<AdminCommonResult<ProductSimple[]>> => {
    return request.get('/product/simpleList', {
        params: { keyword }
    });
};

/**
 * 批量修改审核状态
 */
export const updateProductVerifyStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/update/verifyStatus', null, {
        params: {
            ids: params.ids.join(','),
            verifyStatus: params.verifyStatus,
            detail: params.detail
        }
    });
};

/**
 * 批量上下架商品
 */
export const updateProductPublishStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/update/publishStatus', null, {
        params: {
            ids: params.ids.join(','),
            publishStatus: params.publishStatus
        }
    });
};

/**
 * 批量推荐商品
 */
export const updateProductRecommendStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/update/recommendStatus', null, {
        params: {
            ids: params.ids.join(','),
            recommendStatus: params.recommendStatus
        }
    });
};

/**
 * 批量设为新品
 */
export const updateProductNewStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/update/newStatus', null, {
        params: {
            ids: params.ids.join(','),
            newStatus: params.newStatus
        }
    });
};

/**
 * 批量修改删除状态
 */
export const updateProductDeleteStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post('/product/update/deleteStatus', null, {
        params: {
            ids: params.ids.join(','),
            deleteStatus: params.deleteStatus
        }
    });
};

// ==================== 商品分类管理接口 ====================

/**
 * 添加商品分类
 */
export const createProductCategory = (params: ProductCategoryCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/productCategory/create', params);
};

/**
 * 修改商品分类
 */
export const updateProductCategory = (id: number, params: ProductCategoryCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/productCategory/update/${id}`, params);
};

/**
 * 分页查询商品分类
 */
export const getProductCategoryList = (parentId: number, pageNum: number = 1, pageSize: number = 5): Promise<AdminCommonResult<AdminPageResult<ProductCategory>>> => {
    return request.get(`/productCategory/list/${parentId}`, {
        params: { pageNum, pageSize }
    });
};

/**
 * 删除商品分类
 */
export const deleteProductCategory = (id: number): Promise<AdminCommonResult<number>> => {
    return request.post(`/productCategory/delete/${id}`);
};

/**
 * 根据ID获取商品分类
 */
export const getProductCategoryById = (id: number): Promise<AdminCommonResult<ProductCategory>> => {
    return request.get(`/productCategory/${id}`);
};

// ==================== 订单管理接口 ====================

/**
 * 查询订单
 */
export const getOrderList = (params: AdminOrderListParams = {}): Promise<AdminCommonResult<AdminPageResult<AdminOrder>>> => {
    const { pageNum = 1, pageSize = 5, ...rest } = params;
    return request.get('/order/list', {
        params: { pageNum, pageSize, ...rest }
    });
};

/**
 * 批量发货
 */
export const batchDeliveryOrder = (params: OrderBatchDeliveryParams): Promise<AdminCommonResult<number>> => {
    return request.post('/order/update/delivery', params.deliveryParamList);
};

/**
 * 批量关闭订单
 */
export const batchCloseOrder = (params: OrderCloseParams): Promise<AdminCommonResult<number>> => {
    return request.post('/order/update/close', null, {
        params: {
            ids: params.ids.join(','),
            note: params.note
        }
    });
};

/**
 * 批量删除订单
 */
export const batchDeleteOrder = (ids: number[]): Promise<AdminCommonResult<number>> => {
    return request.post('/order/delete', null, {
        params: { ids: ids.join(',') }
    });
};

/**
 * 获取订单详情
 */
export const getOrderDetail = (id: number): Promise<AdminCommonResult<AdminOrderDetail>> => {
    return request.get(`/order/${id}`);
};

/**
 * 修改收货人信息
 */
export const updateOrderReceiverInfo = (params: OrderReceiverInfoUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/order/update/receiverInfo', params);
};

/**
 * 修改订单费用信息
 */
export const updateOrderMoneyInfo = (params: OrderMoneyInfoUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/order/update/moneyInfo', params);
};

/**
 * 备注订单
 */
export const updateOrderNote = (params: OrderNoteUpdateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/order/update/note', null, {
        params: {
            id: params.id,
            note: params.note,
            status: params.status
        }
    });
};

// ==================== 角色管理接口 ====================

/**
 * 添加角色
 */
export const createRole = (params: AdminRoleCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/role/create', params);
};

/**
 * 修改角色
 */
export const updateRole = (id: number, params: AdminRoleCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/role/update/${id}`, params);
};

/**
 * 批量删除角色
 */
export const batchDeleteRole = (ids: number[]): Promise<AdminCommonResult<number>> => {
    return request.post('/role/delete', null, {
        params: { ids: ids.join(',') }
    });
};

/**
 * 获取所有角色
 */
export const getAllRoleList = (): Promise<AdminCommonResult<AdminRole[]>> => {
    return request.get('/role/listAll');
};

/**
 * 分页获取角色列表
 */
export const getRoleList = (pageNum: number = 1, pageSize: number = 5, keyword?: string): Promise<AdminCommonResult<AdminPageResult<AdminRole>>> => {
    return request.get('/role/list', {
        params: { pageNum, pageSize, keyword }
    });
};

/**
 * 修改角色状态
 */
export const updateRoleStatus = (id: number, params: AdminRoleStatusParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/role/updateStatus/${id}`, null, {
        params: { status: params.status }
    });
};

/**
 * 给角色分配菜单
 */
export const allocRoleMenu = (params: AdminRoleMenuParams): Promise<AdminCommonResult<number>> => {
    return request.post('/role/allocMenu', null, {
        params: {
            roleId: params.roleId,
            menuIds: params.menuIds.join(',')
        }
    });
};

/**
 * 给角色分配资源
 */
export const allocRoleResource = (params: AdminRoleResourceParams): Promise<AdminCommonResult<number>> => {
    return request.post('/role/allocResource', null, {
        params: {
            roleId: params.roleId,
            resourceIds: params.resourceIds.join(',')
        }
    });
};

// ==================== 资源管理接口 ====================

/**
 * 添加资源
 */
export const createResource = (params: AdminResourceCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post('/resource/create', params);
};

/**
 * 修改资源
 */
export const updateResource = (id: number, params: AdminResourceCreateParams): Promise<AdminCommonResult<number>> => {
    return request.post(`/resource/update/${id}`, params);
};

/**
 * 根据ID获取资源详情
 */
export const getResourceById = (id: number): Promise<AdminCommonResult<AdminResource>> => {
    return request.get(`/resource/${id}`);
};

/**
 * 根据ID删除资源
 */
export const deleteResource = (id: number): Promise<AdminCommonResult<number>> => {
    return request.post(`/resource/delete/${id}`);
};

/**
 * 分页查询资源
 */
export const getResourceList = (params: AdminResourceListParams = {}): Promise<AdminCommonResult<AdminPageResult<AdminResource>>> => {
    const { pageNum = 1, pageSize = 5, ...rest } = params;
    return request.get('/resource/list', {
        params: { pageNum, pageSize, ...rest }
    });
};

/**
 * 查询所有资源
 */
export const getAllResourceList = (): Promise<AdminCommonResult<AdminResource[]>> => {
    return request.get('/resource/listAll');
};

// ==================== 文件上传接口 ====================

/**
 * MinIO文件上传
 */
export const uploadFileToMinio = (file: File): Promise<AdminCommonResult<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/minio/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * MinIO文件删除
 */
export const deleteFileFromMinio = (params: MinioDeleteParams): Promise<AdminCommonResult<null>> => {
    return request.post('/minio/delete', null, {
        params: { objectName: params.objectName }
    });
};

/**
 * OSS文件上传
 */
export const uploadFileToOss = (file: File): Promise<AdminCommonResult<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/aliyun/oss/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * OSS签名生成
 */
export const getOssPolicy = (): Promise<AdminCommonResult<OssSignResponse>> => {
    return request.get('/aliyun/oss/policy');
};

// 默认导出
export default {
    // 认证授权
    register,
    login,
    refreshToken,
    getAdminInfo,
    logout,

    // 用户管理
    getAdminList,
    getAdminById,
    updateAdmin,
    updateAdminPassword,
    deleteAdmin,
    updateAdminStatus,
    updateAdminRole,
    getAdminRoleList,

    // 商品管理
    createProduct,
    getProductList,
    getProductUpdateInfo,
    updateProduct,
    getProductSimpleList,
    updateProductVerifyStatus,
    updateProductPublishStatus,
    updateProductRecommendStatus,
    updateProductNewStatus,
    updateProductDeleteStatus,

    // 商品分类管理
    createProductCategory,
    updateProductCategory,
    getProductCategoryList,
    deleteProductCategory,
    getProductCategoryById,

    // 订单管理
    getOrderList,
    batchDeliveryOrder,
    batchCloseOrder,
    batchDeleteOrder,
    getOrderDetail,
    updateOrderReceiverInfo,
    updateOrderMoneyInfo,
    updateOrderNote,

    // 角色管理
    createRole,
    updateRole,
    batchDeleteRole,
    getAllRoleList,
    getRoleList,
    updateRoleStatus,
    allocRoleMenu,
    allocRoleResource,

    // 资源管理
    createResource,
    updateResource,
    getResourceById,
    deleteResource,
    getResourceList,
    getAllResourceList,

    // 文件上传
    uploadFileToMinio,
    deleteFileFromMinio,
    uploadFileToOss,
    getOssPolicy,
};
