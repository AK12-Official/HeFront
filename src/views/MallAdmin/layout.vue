<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <div class="admin-header">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon" size="28">
            <ShoppingCart />
          </el-icon>
          <span class="logo-text">爱心商城 后台管理</span>
        </div>
      </div>

      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :src="userInfo.icon" :size="32">
              <el-icon>
                <User />
              </el-icon>
            </el-avatar>
            <span class="username">{{ userInfo.username }}</span>
            <el-icon class="dropdown-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="profile">个人信息</el-dropdown-item> -->
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="admin-main">
      <!-- 侧边栏 -->
      <div class="admin-sidebar" :class="{ collapsed: isCollapsed }">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon>
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </div>

        <el-menu :default-active="currentActiveMenu" :collapse="isCollapsed" :unique-opened="true" router
          class="admin-menu">
          <!-- 仪表盘 -->
          <el-menu-item index="/mall/admin/dashboard">
            <el-icon>
              <DataBoard />
            </el-icon>
            <span>仪表盘</span>
          </el-menu-item>

          <!-- 商品管理模块 -->
          <el-sub-menu index="product-management">
            <template #title>
              <el-icon>
                <Goods />
              </el-icon>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/mall/admin/pms">
              <el-icon>
                <List />
              </el-icon>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="/mall/admin/categories">
              <el-icon>
                <Grid />
              </el-icon>
              <span>商品分类</span>
            </el-menu-item>
            <el-menu-item index="/mall/admin/product-attribute-categories">
              <el-icon>
                <Grid />
              </el-icon>
              <span>属性分类</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 订单管理模块 -->
          <el-sub-menu index="order-management">
            <template #title>
              <el-icon>
                <ShoppingCart />
              </el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/mall/admin/oms">
              <el-icon>
                <List />
              </el-icon>
              <span>订单列表</span>
            </el-menu-item>
            <el-menu-item index="/mall/admin/return-applies">
              <el-icon>
                <RefreshLeft />
              </el-icon>
              <span>退货申请管理</span>
            </el-menu-item>
          </el-sub-menu>


          <!-- 用户管理模块 -->
          <el-sub-menu index="user-management">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/mall/admin/ums">
              <el-icon>
                <User />
              </el-icon>
              <span>管理员列表</span>
            </el-menu-item>
            <el-menu-item index="/mall/admin/roles">
              <el-icon>
                <Setting />
              </el-icon>
              <span>角色管理</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 文件上传 -->
          <el-menu-item index="/mall/admin/upload">
            <el-icon>
              <Upload />
            </el-icon>
            <span>文件上传</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容区域 -->
      <div class="admin-content">
        <div class="content-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/mall/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="{ path: item.path }">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="content-body">
          <router-view />
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordUpdate" :loading="passwordLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  ShoppingCart,
  User,
  ArrowDown,
  Fold,
  Expand,
  Goods,
  List,
  Upload,
  Setting,
  Document,
  Menu,
  Grid,
  DataBoard,
  Management,
  Files,
  Tools,
  RefreshLeft
} from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { AdminInfo } from '@/api/malladmin/types';
import useMallUserStore from '@/store/modules/mallUser';
import { usePermission } from '@/composables/usePermission';
import useUserStore from '@/store/modules/user';
import { clearAllUserData } from '@/utils/logout';

const router = useRouter();
const route = useRoute();
const mallUserStore = useMallUserStore();
const userStore = useUserStore();

// 权限管理
const { menuTree, fetchUserMenus } = usePermission();

// 响应式数据
const isCollapsed = ref(false);

// 图标映射
const iconMap: Record<string, any> = {
  'User': User,
  'Goods': Goods,
  'List': List,
  'Upload': Upload,
  'Setting': Setting,
  'Document': Document,
  'Menu': Menu,
  'Grid': Grid,
  'DataBoard': DataBoard,
  'Management': Management,
  'Files': Files,
  'Tools': Tools,
  'ShoppingCart': ShoppingCart,
  'RefreshLeft': RefreshLeft
};

// 获取图标组件
const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Document;
};
const passwordDialogVisible = ref(false);
const passwordLoading = ref(false);
const userInfo = ref<AdminInfo>({
  username: '',
  icon: '',
  roles: [],
  menus: []
});

// 修改密码表单
const passwordForm = reactive({
  username: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordFormRef = ref();

// 表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

// 计算属性
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title);
  return matched.map(item => ({
    path: item.path,
    title: item.meta?.title as string
  }));
});

// 当前激活的菜单项
const currentActiveMenu = computed(() => {
  const currentPath = route.path;
  console.log('当前路径:', currentPath);

  // 如果是仪表盘页面
  if (currentPath === '/mall/admin/dashboard' || currentPath === '/mall/admin') {
    return '/mall/admin/dashboard';
  }

  // 其他页面直接返回当前路径
  return currentPath;
});

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/mall/admin/profile');
      break;
    case 'password':
      passwordForm.username = userInfo.value.username;
      passwordDialogVisible.value = true;
      break;
    case 'logout':
      handleLogout();
      break;
  }
};

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await malladmin.logout();

    // 重置store状态
    mallUserStore.mallLogout();
    userStore.userLogout();

    // 使用统一的清理函数清除所有用户数据
    clearAllUserData();

    ElMessage.success('退出登录成功');
    router.push('/mall/admin/login');
  } catch (error: unknown) {
    if (error !== 'cancel') {
      ElMessage.error('退出登录失败');
    }
  }
};

const handlePasswordUpdate = async () => {
  if (!passwordFormRef.value) return;

  try {
    await passwordFormRef.value.validate();
    passwordLoading.value = true;

    await malladmin.updateAdminPassword({
      username: passwordForm.username,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });

    ElMessage.success('密码修改成功');
    passwordDialogVisible.value = false;

    // 重置表单
    passwordFormRef.value.resetFields();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    ElMessage.error('密码修改失败');
  } finally {
    passwordLoading.value = false;
  }
};

const loadUserInfo = async () => {
  try {
    const result = await malladmin.getAdminInfo();
    if (result.code === 200) {
      userInfo.value = result.data;
      // 缓存用户信息
      sessionStorage.setItem('admin_info', JSON.stringify(result.data));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // 如果获取用户信息失败，可能是token失效，跳转到登录页
    router.push('/mall/admin/login');
  }
};

onMounted(async () => {
  // 检查是否已登录
  const token = localStorage.getItem('admin_token');
  if (!token) {
    ElMessage.warning('请先登录');
    router.push('/mall/admin/login');
    return;
  }

  // 先尝试从缓存获取用户信息
  const cachedInfo = sessionStorage.getItem('admin_info');
  if (cachedInfo) {
    userInfo.value = JSON.parse(cachedInfo);
  }

  // 加载最新的用户信息和菜单
  await loadUserInfo();
  await fetchUserMenus();
});
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .header-left {
    .logo {
      display: flex;
      align-items: center;

      .logo-icon {
        color: #409eff;
        margin-right: 8px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      .username {
        margin: 0 8px;
        color: #606266;
      }

      .dropdown-icon {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}

.admin-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.admin-sidebar {
  width: 200px;
  background: #304156;
  transition: width 0.3s;
  position: relative;

  &.collapsed {
    width: 64px;
  }

  .sidebar-toggle {
    position: absolute;
    top: 10px;
    right: -15px;
    width: 30px;
    height: 30px;
    background: #409eff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;

    &:hover {
      background: #66b1ff;
    }
  }

  .admin-menu {
    border-right: none;
    height: 100%;
    overflow-y: auto;

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      color: #bfcbd9;

      &:hover {
        background-color: #263445;
        color: #fff;
      }
    }

    :deep(.el-sub-menu.is-active > .el-sub-menu__title),
    :deep(.el-menu-item.is-active) {
      background-color: #409eff !important;
      color: #fff;
    }

    :deep(.el-menu-item.is-active::before) {
      display: none;
    }
  }
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f2f5;

  .content-header {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .content-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
}

:deep(.el-breadcrumb__inner) {
  color: #606266;

  &.is-link {
    color: #409eff;

    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
