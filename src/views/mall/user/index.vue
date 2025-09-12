<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="user-center-container">
    <div class="user-header">
      <div class="user-info">
        <div class="avatar-section">
          <img :src="userInfo.icon || '/default-avatar.png'" :alt="userInfo.nickname" class="user-avatar" />
          <el-button size="small" class="change-avatar-btn">更换头像</el-button>
        </div>
        <div class="info-section">
          <h2 class="username">{{ userInfo.nickname || userInfo.username || '用户' }}</h2>
          <p class="user-desc">{{ userInfo.personalizedSignature || '这个人很懒，什么都没留下' }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.integration || 0 }}</span>
              <span class="stat-label">积分</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.growth || 0 }}</span>
              <span class="stat-label">成长值</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.memberLevelId || 0 }}</span>
              <span class="stat-label">会员等级</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="menu-section">
      <div class="menu-grid">
        <div v-for="item in menuItems" :key="item.path" class="menu-item" @click="navigateTo(item.path)">
          <div class="menu-icon">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
          </div>
          <span class="menu-title">{{ item.title }}</span>
          <el-icon class="menu-arrow">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-grid">
        <div v-for="action in quickActions" :key="action.key" class="action-item"
          @click="handleQuickAction(action.key)">
          <div class="action-icon">
            <i :class="action.icon"></i>
          </div>
          <span class="action-title">{{ action.title }}</span>
        </div>
      </div>
    </div> -->

    <div class="settings-section">
      <div class="setting-item" @click="showEditProfile">
        <span class="setting-label">编辑个人资料</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="setting-item" @click="showChangePassword">
        <span class="setting-label">修改密码</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="setting-item" @click="logout">
        <span class="setting-label logout-text">退出登录</span>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editProfileVisible" title="编辑个人资料" width="400px">
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称" title="用户昵称" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="profileForm.gender" placeholder="请选择性别" title="选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
            <el-option label="未知" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="profileForm.birthday" type="date" placeholder="请选择生日" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" title="选择出生日期" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="profileForm.city" placeholder="请输入所在城市" title="所在城市" />
        </el-form-item>
        <el-form-item label="职业">
          <el-input v-model="profileForm.job" placeholder="请输入职业" title="职业" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="profileForm.personalizedSignature" type="textarea" :rows="3" placeholder="请输入个性签名"
            title="个性签名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editProfileVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="changePasswordVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password
            title="当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password title="新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password
            title="确认新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changePasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ssoInfo } from '@/api/sso'
import type { MemberInfo } from '@/api/sso/types'
import useMallUserStore from '@/store/modules/mallUser'


interface ProfileForm {
  nickname: string
  gender: number | undefined
  birthday: string
  city: string
  job: string
  personalizedSignature: string
}

interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const router = useRouter()

// 数据
const userInfo = ref<MemberInfo>({
  id: 0,
  memberLevelId: 0,
  username: '',
  nickname: '',
  phone: '',
  status: 1,
  createTime: '',
  icon: '',
  gender: 0,
  birthday: '',
  city: '',
  job: '',
  personalizedSignature: '',
  integration: 0,
  growth: 0
})
const editProfileVisible = ref(false)
const changePasswordVisible = ref(false)
const profileForm = ref<ProfileForm>({
  nickname: '',
  gender: undefined,
  birthday: '',
  city: '',
  job: '',
  personalizedSignature: ''
})
const passwordForm = ref<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 菜单项
const menuItems = [
  { title: '我的订单', path: '/mall/order', icon: 'ShoppingBag' },
  { title: '收货地址', path: '/mall/address', icon: 'Location' },
  { title: '我的优惠券', path: '/mall/coupon', icon: 'Ticket' },
  { title: '联系客服', path: '/mall/service', icon: 'Service' }
]

// 快捷操作
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const quickActions = [
  { key: 'scan', title: '扫一扫', icon: 'Camera' },
  { key: 'share', title: '分享好友', icon: 'Share' },
  { key: 'feedback', title: '意见反馈', icon: 'ChatDotRound' },
  { key: 'about', title: '关于我们', icon: 'InfoFilled' }
]

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 检查用户是否已登录
    const mallUserStore = useMallUserStore()
    if (!mallUserStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      router.push('/mall/login')
      return
    }

    const response = await ssoInfo()
    if (response.code === 200) {
      userInfo.value = response.data
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error: any) {
    console.error('加载用户信息失败:', error)
    console.error('错误详情:', error.response?.data)

    // 如果是401错误，说明token过期，跳转到登录页
    if (error.response?.status === 401) {
      ElMessage.warning('登录已过期，请重新登录')
      router.push('/mall/login')
    } else {
      ElMessage.error('加载用户信息失败')
    }
  }
}


// 导航到指定页面
const navigateTo = (path: string) => {
  // 特殊处理联系客服功能
  if (path === '/mall/service') {
    ElMessage.info('功能开发中')
    return
  }
  router.push(path)
}

// 处理快捷操作
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleQuickAction = (action: string) => {
  switch (action) {
    case 'scan':
      ElMessage.info('扫一扫功能暂未开放')
      break
    case 'share':
      ElMessage.info('分享功能暂未开放')
      break
    case 'feedback':
      ElMessage.info('意见反馈功能暂未开放')
      break
    case 'about':
      ElMessage.info('关于我们功能暂未开放')
      break
  }
}

// 显示编辑资料对话框
const showEditProfile = () => {
  profileForm.value = {
    nickname: userInfo.value.nickname || '',
    gender: userInfo.value.gender,
    birthday: userInfo.value.birthday || '',
    city: userInfo.value.city || '',
    job: userInfo.value.job || '',
    personalizedSignature: userInfo.value.personalizedSignature || ''
  }
  editProfileVisible.value = true
}

// 保存个人资料
const saveProfile = async () => {
  try {
    // 这里应该调用更新用户信息的API
    Object.assign(userInfo.value, profileForm.value)
    ElMessage.success('保存成功')
    editProfileVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 显示修改密码对话框
const showChangePassword = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  changePasswordVisible.value = true
}

// 修改密码
const changePassword = () => {
  ElMessage.success('密码修改成功')
  changePasswordVisible.value = false
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    // 清除本地存储的用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    ElMessage.success('退出登录成功')
    router.push('/mall/login')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.user-center-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px;
  color: white;

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .user-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba(255, 255, 255, 0.3);
      }

      .change-avatar-btn {
        font-size: 12px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .info-section {
      flex: 1;

      .username {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }

      .user-desc {
        font-size: 14px;
        opacity: 0.9;
        margin: 0 0 15px 0;
      }

      .user-stats {
        display: flex;
        gap: 30px;

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .stat-value {
            font-size: 18px;
            font-weight: 600;
          }

          .stat-label {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 2px;
          }
        }
      }
    }
  }
}


.menu-section {
  background: white;
  margin: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .menu-grid {
    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #f8f9fa;
      }

      &:last-child {
        border-bottom: none;
      }

      .menu-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        color: #409eff;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .menu-title {
        flex: 1;
        font-size: 16px;
        color: #333;
      }

      .menu-arrow {
        color: #c0c4cc;
        font-size: 14px;
      }
    }
  }
}

.quick-actions {
  margin: 20px;

  h3 {
    font-size: 18px;
    color: #333;
    margin: 0 0 16px 0;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .action-item {
      background: white;
      border-radius: 12px;
      padding: 20px 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .action-icon {
        width: 40px;
        height: 40px;
        margin: 0 auto 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      }

      .action-title {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.settings-section {
  background: white;
  margin: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .setting-label {
      font-size: 16px;
      color: #333;

      &.logout-text {
        color: #f56c6c;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-header {
    padding: 20px 16px;

    .user-info {
      .avatar-section .user-avatar {
        width: 60px;
        height: 60px;
      }

      .info-section {
        .username {
          font-size: 20px;
        }

        .user-stats {
          gap: 20px;

          .stat-value {
            font-size: 16px;
          }
        }
      }
    }
  }

  .menu-section,
  .settings-section {
    margin: 16px;
  }

  .quick-actions {
    margin: 16px;

    .action-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .action-item {
        padding: 16px 8px;

        .action-icon {
          width: 36px;
          height: 36px;
          font-size: 16px;
        }

        .action-title {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
