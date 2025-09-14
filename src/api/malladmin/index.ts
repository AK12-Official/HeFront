/**
 * MallLite后台管理系统API接口
 * 基于后台管理系统接口文档和Postman集合
 */
import { adminRequest } from "@/utils/mallRequest";
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
    ProductCategoryWithChildren,
    ProductAttributeCategory,
    ProductAttributeCategoryItem,
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
    AdminResourceListParams,
    FileUploadResponse,
    MinioDeleteParams,
    OssSignResponse,
    ReturnApplyListParams,
    AdminReturnApply,
    ReturnApplyHandleParams,
    ReturnApplyBatchHandleParams,
    // 用户管理相关类型
    AdminUser,
    AdminUserCreateParams,
    AdminUserUpdateParams,
    AdminPasswordUpdateParams,
    AdminUserRoleParams,
    AdminRoleParams,
} from "./types";

// ==================== 认证授权接口 ====================

/**
 * 用户注册
 */
export const register = (params: AdminRegisterParams): Promise<AdminCommonResult<Admin>> => {
    return adminRequest.post('/admin/register', params);
};

/**
 * 用户登录
 */
export const login = (params: AdminLoginParams): Promise<AdminCommonResult<AdminLoginResponse>> => {
    return adminRequest.post('/admin/login', params);
};

/**
 * 刷新Token
 */
export const refreshToken = (): Promise<AdminCommonResult<AdminLoginResponse>> => {
    return adminRequest.get('/admin/refreshToken');
};

/**
 * 获取当前用户信息
 */
export const getAdminInfo = (): Promise<AdminCommonResult<AdminInfo>> => {
    return adminRequest.get('/admin/info');
};

/**
 * 用户登出
 */
export const logout = (): Promise<AdminCommonResult<null>> => {
    return adminRequest.post('/admin/logout');
};

// ==================== 用户管理接口 ====================

/**
 * 分页查询用户列表
 */
export const getAdminList = (params: AdminListParams = {}): Promise<AdminCommonResult<AdminPageResult<Admin>>> => {
    const { pageNum = 1, pageSize = 5, keyword } = params;
    return adminRequest.get('/admin/list', {
        params: { pageNum, pageSize, keyword }
    });
};

/**
 * 获取指定用户信息
 */
export const getAdminById = (id: number): Promise<AdminCommonResult<Admin>> => {
    return adminRequest.get(`/admin/${id}`);
};

/**
 * 修改指定用户信息
 */
export const updateAdmin = (id: number, params: AdminUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/admin/update/${id}`, params);
};

/**
 * 修改用户密码
 */
export const updateAdminPassword = (params: AdminUpdatePasswordParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/admin/updatePassword', params);
};

/**
 * 删除用户
 */
export const deleteAdmin = (id: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/admin/delete/${id}`);
};

/**
 * 修改用户状�? */
export const updateAdminStatus = (id: number, params: AdminStatusUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/admin/updateStatus/${id}`, null, {
        params: { status: params.status }
    });
};

/**
 * 给用户分配角�? */
export const updateAdminRole = (params: AdminRoleUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/admin/role/update', null, {
        params: { adminId: params.adminId, roleIds: params.roleIds.join(',') }
    });
};

/**
 * 获取用户角色列表
 */
export const getAdminRoleList = (adminId: number): Promise<AdminCommonResult<AdminRole[]>> => {
    return adminRequest.get(`/admin/role/${adminId}`);
};

// ==================== 角色管理接口 ====================

/**
 * 创建角色
 */
export const createRole = (params: AdminRoleParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/create', params);
};

/**
 * 批量删除角色
 */
export const batchDeleteRole = (ids: number[]): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/delete', null, {
        params: { ids: ids.join(',') }
    });
};

/**
 * 更新角色
 */
export const updateRole = (id: number, params: AdminRoleParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/role/update/${id}`, params);
};

/**
 * 批量删除角色
 */

/**
 * 获取所有角色
 */
export const getAllRoles = (): Promise<AdminCommonResult<AdminRole[]>> => {
    return adminRequest.get('/role/listAll');
};

/**
 * 分页查询角色列表
 */
export const getRoleList = (params: { keyword?: string; pageNum?: number; pageSize?: number } = {}): Promise<AdminCommonResult<AdminPageResult<AdminRole>>> => {
    const { pageNum = 1, pageSize = 5, keyword } = params;
    return adminRequest.get('/role/list', {
        params: { pageNum, pageSize, keyword }
    });
};

/**
 * 修改角色状态
 */
export const updateRoleStatus = (id: number, status: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/role/updateStatus/${id}`, null, {
        params: { status }
    });
};

/**
 * 获取角色相关菜单
 */
export const getRoleMenus = (roleId: number): Promise<AdminCommonResult<any[]>> => {
    return adminRequest.get(`/role/listMenu/${roleId}`);
};

/**
 * 获取角色相关资源
 */
export const getRoleResources = (roleId: number): Promise<AdminCommonResult<AdminResource[]>> => {
    return adminRequest.get(`/role/listResource/${roleId}`);
};

/**
 * 给角色分配菜单
 */
export const allocRoleMenus = (roleId: number, menuIds: number[]): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/allocMenu', null, {
        params: { roleId, menuIds: menuIds.join(',') }
    });
};

/**
 * 给角色分配资源
 */
export const allocRoleResources = (roleId: number, resourceIds: number[]): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/allocResource', null, {
        params: { roleId, resourceIds: resourceIds.join(',') }
    });
};





// ==================== 商品管理接口 ====================

/**
 * 创建商品
 */
export const createProduct = (params: ProductCreateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/product/create', params);
};

/**
 * 查询商品列表
 */
export const getProductList = (params: ProductListParams = {}): Promise<AdminCommonResult<AdminPageResult<AdminProduct>>> => {
    const { pageNum = 1, pageSize = 5, ...rest } = params;
    return adminRequest.get('/product/list', {
        params: { pageNum, pageSize, ...rest }
    });
};

/**
 * 获取商品编辑信息
 */
export const getProductUpdateInfo = (id: number): Promise<AdminCommonResult<ProductUpdateInfo>> => {
    return adminRequest.get(`/product/updateInfo/${id}`);
};

/**
 * 更新商品
 */
export const updateProduct = (id: number, params: ProductCreateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/product/update/${id}`, params);
};

/**
 * 商品简单查�? */
export const getProductSimpleList = (keyword?: string): Promise<AdminCommonResult<ProductSimple[]>> => {
    return adminRequest.get('/product/simpleList', {
        params: { keyword }
    });
};

/**
 * 批量修改审核状�? */
export const updateProductVerifyStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/product/update/verifyStatus', null, {
        params: {
            ids: params.ids.join(','),
            verifyStatus: params.verifyStatus,
            detail: params.detail
        }
    });
};

/**
 * 批量上下架商�? */
export const updateProductPublishStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/product/update/publishStatus', null, {
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
    return adminRequest.post('/product/update/recommendStatus', null, {
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
    return adminRequest.post('/product/update/newStatus', null, {
        params: {
            ids: params.ids.join(','),
            newStatus: params.newStatus
        }
    });
};

/**
 * 批量修改删除状�? */
export const updateProductDeleteStatus = (params: ProductBatchStatusParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/product/update/deleteStatus', null, {
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
    return adminRequest.post('/productCategory/create', params);
};

/**
 * 修改商品分类
 */
export const updateProductCategory = (id: number, params: ProductCategoryCreateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/productCategory/update/${id}`, params);
};

/**
 * 分页查询商品分类
 */
export const getProductCategoryList = (parentId: number, pageNum: number = 1, pageSize: number = 5): Promise<AdminCommonResult<AdminPageResult<ProductCategory>>> => {
    return adminRequest.get(`/productCategory/list/${parentId}`, {
        params: { pageNum, pageSize }
    });
};

/**
 * 删除商品分类
 */
export const deleteProductCategory = (id: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/productCategory/delete/${id}`);
};

/**
 * 根据ID获取商品分类
 */
export const getProductCategoryById = (id: number): Promise<AdminCommonResult<ProductCategory>> => {
    return adminRequest.get(`/productCategory/${id}`);
};

/**
 * 批量修改导航栏显示状态
 */
export const updateProductCategoryNavStatus = (ids: number[], navStatus: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/productCategory/update/navStatus', null, {
        params: {
            ids: ids.join(','),
            navStatus
        }
    });
};

/**
 * 批量修改显示状态
 */
export const updateProductCategoryShowStatus = (ids: number[], showStatus: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/productCategory/update/showStatus', null, {
        params: {
            ids: ids.join(','),
            showStatus
        }
    });
};

/**
 * 查询所有一级分类及子分类
 */
export const getProductCategoryListWithChildren = (): Promise<AdminCommonResult<ProductCategoryWithChildren[]>> => {
    return adminRequest.get('/productCategory/list/withChildren');
};

// ==================== 商品属性管理接口 ====================


// ==================== 商品属性分类管理接口 ====================

/**
 * 获取商品属性分类列表
 */
export const getProductAttributeCategoryList = (pageNum: number = 1, pageSize: number = 5): Promise<AdminCommonResult<AdminPageResult<ProductAttributeCategory>>> => {
    return adminRequest.get('/productAttribute/category/list', {
        params: { pageNum, pageSize }
    });
};

/**
 * 创建商品属性分类
 */
export const createProductAttributeCategory = (name: string): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/productAttribute/category/create', null, {
        params: { name }
    });
};

/**
 * 更新商品属性分类
 */
export const updateProductAttributeCategory = (id: number, name: string): Promise<AdminCommonResult<number>> => {
    return adminRequest.post(`/productAttribute/category/update/${id}`, null, {
        params: { name }
    });
};

/**
 * 删除商品属性分类
 */
export const deleteProductAttributeCategory = (id: number): Promise<AdminCommonResult<number>> => {
    return adminRequest.get(`/productAttribute/category/delete/${id}`);
};

/**
 * 获取商品属性分类详情
 */
export const getProductAttributeCategoryById = (id: number): Promise<AdminCommonResult<ProductAttributeCategory>> => {
    return adminRequest.get(`/productAttribute/category/${id}`);
};

/**
 * 获取所有商品属性分类及其下属性
 */
export const getProductAttributeCategoryListWithAttr = (): Promise<AdminCommonResult<ProductAttributeCategoryItem[]>> => {
    return adminRequest.get('/productAttribute/category/list/withAttr');
};

// ==================== 订单管理接口 ====================

/**
 * 查询订单
 */
export const getOrderList = (params: AdminOrderListParams = {}): Promise<AdminCommonResult<AdminPageResult<AdminOrder>>> => {
    const { pageNum = 1, pageSize = 5, ...rest } = params;
    return adminRequest.get('/order/list', {
        params: { pageNum, pageSize, ...rest }
    });
};

/**
 * 批量发货
 */
export const batchDeliveryOrder = (params: OrderBatchDeliveryParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/order/update/delivery', params.deliveryParamList);
};

/**
 * 批量关闭订单
 */
export const batchCloseOrder = (params: OrderCloseParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/order/update/close', null, {
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
    return adminRequest.post('/order/delete', null, {
        params: { ids: ids.join(',') }
    });
};

/**
 * 获取订单详情
 */
export const getOrderDetail = (id: number): Promise<AdminCommonResult<AdminOrderDetail>> => {
    return adminRequest.get(`/order/${id}`);
};

/**
 * 修改收货人信�? */
export const updateOrderReceiverInfo = (params: OrderReceiverInfoUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/order/update/receiverInfo', params);
};

/**
 * 修改订单费用信息
 */
export const updateOrderMoneyInfo = (params: OrderMoneyInfoUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/order/update/moneyInfo', params);
};

/**
 * 备注订单
 */
export const updateOrderNote = (params: OrderNoteUpdateParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/order/update/note', null, {
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

/**
 * 修改角色
 */

/**
 * 批量删除角色
 */

/**
 * 获取所有角�? */

/**
 * 分页获取角色列表
 */

/**
 * 修改角色状�? */

/**
 * 给角色分配菜�? */
export const allocRoleMenu = (params: AdminRoleMenuParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/allocMenu', null, {
        params: {
            roleId: params.roleId,
            menuIds: params.menuIds.join(',')
        }
    });
};

/**
 * 给角色分配资�? */
export const allocRoleResource = (params: AdminRoleResourceParams): Promise<AdminCommonResult<number>> => {
    return adminRequest.post('/role/allocResource', null, {
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

/**
 * 修改资源
 */

/**
 * 根据ID获取资源详情
 */

/**
 * 根据ID删除资源
 */

/**
 * 分页查询资源
 */

/**
 * 查询所有资�? */
export const getAllResourceList = (): Promise<AdminCommonResult<AdminResource[]>> => {
    return adminRequest.get('/resource/listAll');
};

// ==================== Dashboard接口 ====================
// 注意：后端暂未提供Dashboard统计接口，以下接口保留用于未来扩展

// ==================== 文件上传接口 ====================

/**
 * MinIO文件上传
 */
export const uploadFileToMinio = (file: File): Promise<AdminCommonResult<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return adminRequest.post('/minio/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * MinIO文件删除
 */
export const deleteFileFromMinio = (params: MinioDeleteParams): Promise<AdminCommonResult<null>> => {
    return adminRequest.post('/minio/delete', null, {
        params: { objectName: params.objectName }
    });
};

/**
 * OSS文件上传
 */
export const uploadFileToOss = (file: File): Promise<AdminCommonResult<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return adminRequest.post('/aliyun/oss/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * OSS签名生成
 */
export const getOssPolicy = (): Promise<AdminCommonResult<OssSignResponse>> => {
    return adminRequest.get('/aliyun/oss/policy');
};

// ==================== 退货申请管理相关 ====================

/**
 * 获取退货申请列表
 */
export const getReturnApplyList = (params: ReturnApplyListParams): Promise<AdminCommonResult<AdminPageResult<AdminReturnApply>>> => {
    return adminRequest.get('/returnApply/list', {
        params
    });
};

/**
 * 获取退货申请详情
 */
export const getReturnApplyDetail = (id: number): Promise<AdminCommonResult<AdminReturnApply>> => {
    return adminRequest.get(`/returnApply/${id}`);
};

/**
 * 处理退货申请
 */
export const handleReturnApply = (params: ReturnApplyHandleParams): Promise<AdminCommonResult<unknown>> => {
    const { id, ...bodyParams } = params;
    return adminRequest.post(`/returnApply/update/status/${id}`, bodyParams);
};

/**
 * 批量处理退货申请
 * 由于后端没有批量处理接口，循环调用单个处理接口
 */
export const batchHandleReturnApply = async (params: ReturnApplyBatchHandleParams): Promise<AdminCommonResult<unknown>> => {
    const { ids, status, handleNote } = params;
    const results = [];

    for (const id of ids) {
        try {
            const result = await handleReturnApply({
                id,
                status,
                handleNote
            });
            results.push(result);
        } catch (error) {
            console.error(`处理退货申请 ${id} 失败:`, error);
            results.push({ code: 500, message: `处理退货申请 ${id} 失败` });
        }
    }

    // 检查是否所有请求都成功
    const successCount = results.filter(r => r.code === 200).length;
    const totalCount = results.length;

    if (successCount === totalCount) {
        return { code: 200, message: `成功处理 ${successCount} 个退货申请`, data: null };
    } else {
        return { code: 500, message: `处理完成，成功 ${successCount}/${totalCount} 个`, data: null };
    }
};

/**
 * 删除退货申请
 */
export const deleteReturnApply = (id: number): Promise<AdminCommonResult<unknown>> => {
    return adminRequest.post(`/returnApply/delete/${id}`);
};

/**
 * 批量删除退货申请
 */
export const batchDeleteReturnApply = (ids: number[]): Promise<AdminCommonResult<unknown>> => {
    return adminRequest.post('/returnApply/delete', null, {
        params: { ids: ids.join(',') }
    });
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
    updateProductCategoryNavStatus,
    updateProductCategoryShowStatus,
    getProductCategoryListWithChildren,

    // 商品属性管理
    // 商品属性分类管理
    getProductAttributeCategoryList,
    createProductAttributeCategory,
    updateProductAttributeCategory,
    deleteProductAttributeCategory,
    getProductAttributeCategoryById,
    getProductAttributeCategoryListWithAttr,

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
    getAllRoles,
    getRoleList,
    updateRoleStatus,
    getRoleMenus,
    getRoleResources,
    allocRoleMenus,
    allocRoleResources,


    // Dashboard - 后端暂未提供相关接口

    // 文件上传
    uploadFileToMinio,
    deleteFileFromMinio,
    uploadFileToOss,
    getOssPolicy,

    // 退货申请管理
    getReturnApplyList,
    getReturnApplyDetail,
    handleReturnApply,
    batchHandleReturnApply,
    deleteReturnApply,
    batchDeleteReturnApply,
};
