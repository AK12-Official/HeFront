<template>
  <div class="category-container">
    <div class="category-wrapper">
      <!-- 左侧分类菜单 -->
      <div class="left-sidebar">
        <div class="category-list">
          <div v-for="category in firstLevelCategories" :key="category.id" class="category-item"
            :class="{ active: currentCategoryId === category.id }" @click="selectCategory(category.id)">
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- 右侧子分类 -->
      <div class="right-content">
        <div class="subcategory-grid">
          <div v-for="subcategory in currentSubcategories" :key="subcategory.id" class="subcategory-item"
            @click="goToProductList(subcategory.id)">
            <div class="subcategory-image">
              <img :src="subcategory.icon || '/static/default-category.png'" :alt="subcategory.name" />
            </div>
            <span class="subcategory-name">{{ subcategory.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { homeProductCateList } from '@/api/mall'

interface Category {
  id: number
  name: string
  icon?: string
  children?: Category[]
}

const router = useRouter()

// 数据
const firstLevelCategories = ref<Category[]>([])
const secondLevelCategories = ref<Category[]>([])
const currentCategoryId = ref<number>(0)

// 当前选中分类的子分类
const currentSubcategories = computed(() => {
  return secondLevelCategories.value
})

// 加载一级分类数据
const loadFirstLevelCategories = async () => {
  try {
    const response = await homeProductCateList(0)
    const categories = response.data || []

    // 为每个分类添加默认图标
    firstLevelCategories.value = categories.map((cat: Category) => ({
      ...cat,
      icon: cat.icon || `https://picsum.photos/60/60?random=${cat.id + 300}`
    }))

    // 默认选中第一个分类
    if (firstLevelCategories.value.length > 0) {
      currentCategoryId.value = firstLevelCategories.value[0].id
      loadSecondLevelCategories(currentCategoryId.value)
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载分类失败')
  }
}

// 加载二级分类数据
const loadSecondLevelCategories = async (parentId: number) => {
  try {
    const response = await homeProductCateList(parentId)
    const subCategories = response.data || []

    // 为子分类添加默认图标
    secondLevelCategories.value = subCategories.map((cat: Category) => ({
      ...cat,
      icon: cat.icon || `https://picsum.photos/80/80?random=${cat.id + 400}`
    }))
  } catch (error) {
    console.error('加载子分类失败:', error)
    ElMessage.error('加载子分类失败')
  }
}

// 选择分类
const selectCategory = async (categoryId: number) => {
  currentCategoryId.value = categoryId
  await loadSecondLevelCategories(categoryId)
}

// 跳转到商品列表
const goToProductList = (categoryId: number) => {
  router.push(`/mall/product/list?categoryId=${categoryId}`)
}

onMounted(() => {
  loadFirstLevelCategories()
})
</script>

<style lang="scss" scoped>
.category-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.category-wrapper {
  display: flex;
  height: 100vh;
}

.left-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #eee;
  overflow-y: auto;

  .category-list {
    .category-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      padding: 0 16px;
      font-size: 14px;
      color: #666;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        background: #f8f8f8;
        color: #409eff;
      }

      &.active {
        color: #409eff;
        background: #f0f9ff;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 30px;
          background: #409eff;
          border-radius: 0 2px 2px 0;
        }
      }
    }
  }
}

.right-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fff;

  .subcategory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
    padding: 20px;

    .subcategory-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #f8f8f8;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .subcategory-image {
        width: 60px;
        height: 60px;
        margin-bottom: 12px;
        border-radius: 50%;
        overflow: hidden;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .subcategory-name {
        font-size: 14px;
        color: #333;
        text-align: center;
        line-height: 1.4;
        word-break: break-all;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-wrapper {
    height: auto;
    min-height: 100vh;
  }

  .left-sidebar {
    width: 100px;

    .category-item {
      height: 50px;
      font-size: 12px;
      padding: 0 8px;
    }
  }

  .right-content {
    padding: 16px;

    .subcategory-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 16px;
      padding: 16px;

      .subcategory-item {
        padding: 12px;

        .subcategory-image {
          width: 50px;
          height: 50px;
          margin-bottom: 8px;
        }

        .subcategory-name {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
