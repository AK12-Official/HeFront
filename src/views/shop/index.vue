<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="shop-container">
    <!-- 顶部轮播广告海报 -->
    <div class="carousel-section">
      <el-carousel height="400px" indicator-position="outside" :interval="4000">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="primary" @click="navigateTo(banner.link)">了解更多</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类区 -->
    <div class="category-section">
      <h2 class="section-title">商品分类</h2>
      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-item"
          :class="{ active: currentCategory === category.id }" @click="selectCategory(category.id)">
          <div class="category-icon">
            <el-icon :size="24">
              <component :is="categoryIcons[category.id]"></component>
            </el-icon>
          </div>
          <div class="category-name">{{ category.name }}</div>
        </div>
      </div>
    </div>

    <!-- 商品推荐区 -->
    <div class="featured-section">
      <h2 class="section-title">精选商品</h2>
      <div class="featured-products">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card"
          @click="showProductDetail(product.id)">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name">
            <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice.toFixed(2) }}</span>
            </div>
            <div class="product-desc">{{ product.description }}</div>
            <div class="product-actions">
              <el-button type="primary" size="small" @click.stop="addToCart(product as Product)">加入购物车</el-button>
              <el-button size="small" @click.stop="showProductDetail(product.id)">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表区 -->
    <div class="products-section">
      <div class="section-header">
        <h2 class="section-title">全部商品</h2>
        <div class="sort-options">
          <el-radio-group v-model="sortOption" size="small">
            <el-radio-button label="default">默认排序</el-radio-button>
            <el-radio-button label="price-asc">价格从低到高</el-radio-button>
            <el-radio-button label="price-desc">价格从高到低</el-radio-button>
            <el-radio-button label="newest">最新上架</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card"
          @click="showProductDetail(product.id)">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name">
            <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice.toFixed(2) }}</span>
            </div>
            <div class="product-desc">{{ product.description }}</div>
            <div class="product-actions">
              <el-button type="primary" size="small" @click.stop="addToCart(product as Product)">加入购物车</el-button>
              <el-button size="small" @click.stop="showProductDetail(product.id)">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next" :total="totalProducts" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange" />
      </div>
    </div>

    <!-- 商品详情对话框 -->
    <el-dialog v-model="productDetailVisible" :title="selectedProduct ? selectedProduct.name : '商品详情'" width="70%"
      destroy-on-close>
      <div class="product-detail" v-if="selectedProduct">
        <div class="product-detail-gallery">
          <el-carousel height="350px" indicator-position="outside">
            <el-carousel-item v-for="(image, index) in selectedProduct.gallery || [selectedProduct.imageUrl]"
              :key="index">
              <img :src="image" :alt="`${selectedProduct.name} - 图片 ${index + 1}`" class="detail-image">
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="product-detail-info">
          <h2 class="detail-title">{{ selectedProduct.name }}</h2>

          <div class="detail-price">
            <span class="current-price">¥{{ selectedProduct.price.toFixed(2) }}</span>
            <span class="original-price" v-if="selectedProduct.originalPrice">
              原价: ¥{{ selectedProduct.originalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="detail-desc">
            {{ selectedProduct.fullDescription || selectedProduct.description }}
          </div>

          <div class="detail-specs" v-if="selectedProduct.specifications">
            <h3>商品规格</h3>
            <div class="spec-item" v-for="(spec, key) in selectedProduct.specifications" :key="key">
              <span class="spec-name">{{ key }}:</span>
              <span class="spec-value">{{ spec }}</span>
            </div>
          </div>

          <div class="detail-actions">
            <div class="quantity-selector">
              <span>数量:</span>
              <el-input-number v-model="purchaseQuantity" :min="1" :max="99" size="small" />
            </div>

            <el-button type="primary" @click="addToCart(selectedProduct, purchaseQuantity)">加入购物车</el-button>
            <el-button type="danger" @click="buyNow(selectedProduct, purchaseQuantity)">立即购买</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 原有内容保持不变 -->

    <!-- 添加浮动购物车按钮 -->
    <div class="floating-cart" @click="toggleCart">
      <el-badge :value="cartItems.length" :hidden="cartItems.length === 0" class="cart-badge">
        <el-icon :size="24">
          <ShoppingCart />
        </el-icon>
      </el-badge>
    </div>

    <!-- 购物车侧边栏 -->
    <el-drawer v-model="cartVisible" title="购物车" direction="rtl" size="30%" destroy-on-close :with-header="true">
      <template #default>
        <div v-if="cartItems.length === 0" class="empty-cart">
          <el-empty description="购物车空空如也">
            <el-button type="primary" @click="cartVisible = false">去选购</el-button>
          </el-empty>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.imageUrl" :alt="item.name">
              </div>
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
              </div>
              <div class="item-quantity">
                <el-input-number v-model="item.quantity" :min="1" size="small"
                  @change="updateCartItem"></el-input-number>
              </div>
              <div class="item-actions">
                <el-button type="danger" size="small" circle @click="removeFromCart(item)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-total">
              <span>总计:</span>
              <span class="total-price">¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="cart-actions">
              <el-button type="default" @click="clearCart">清空购物车</el-button>
              <el-button type="primary" @click="checkout">结算</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  Food,
  Watch,
  Iphone,
  Discount,
  Star,
  ShoppingCart,
  Goods,
  Delete
} from '@element-plus/icons-vue';

const router = useRouter();

// 创建图标映射对象
type CategoryId = 'all' | 'clothes' | 'food' | 'electronics' | 'accessories' | 'charity' | 'discount';

const categoryIcons: Record<CategoryId, unknown> = {
  all: ShoppingCart,
  clothes: Goods,
  food: Food,
  electronics: Iphone,
  accessories: Watch,
  charity: Star,
  discount: Discount
};

// 轮播广告数据
const banners = ref([
  {
    imageUrl: 'https://img1.baidu.com/it/u=3009731526,373851691&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
    title: '爱心助力，健康人生',
    description: '每一次购买都是一次爱心的传递',
    link: '/shop/campaign/health'
  },
  {
    imageUrl: 'https://img1.baidu.com/it/u=3009731526,373851691&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
    title: '公益商城，爱心同行',
    description: '用消费的力量，点亮希望',
    link: '/shop/campaign/charity'
  },
  {
    imageUrl: 'https://img1.baidu.com/it/u=3009731526,373851691&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
    title: '特色商品，优质生活',
    description: '精选优质商品，提升生活品质',
    link: '/shop/campaign/quality'
  }
]);
const categories = ref<{ id: CategoryId; name: string }[]>([
  { id: 'all', name: '全部' },
  { id: 'clothes', name: '服装' },
  { id: 'food', name: '食品' },
  { id: 'electronics', name: '电子产品' },
  { id: 'accessories', name: '配饰' },
  { id: 'charity', name: '公益商品' },
  { id: 'discount', name: '特价商品' }
]);

// 商品数据
const allProducts = ref([
  {
    id: 1,
    name: '爱心助力纯棉T恤',
    description: '舒适透气，爱心助力公益款T恤',
    fullDescription: '这款爱心助力纯棉T恤采用优质棉料制成，舒适透气，适合各种场合穿着。每售出一件，将有5%的收益用于公益事业，助力健康人生计划。',
    price: 99.00,
    originalPrice: 129.00,
    imageUrl: 'https://img0.baidu.com/it/u=2561383471,1147318426&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'clothes',
    tag: '公益款',
    gallery: [
      'https://img0.baidu.com/it/u=2561383471,1147318426&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      'https://img2.baidu.com/it/u=557752483,3888907610&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      'https://img1.baidu.com/it/u=453765737,2918657894&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
    ],
    specifications: {
      '材质': '100%纯棉',
      '尺寸': 'S, M, L, XL, XXL',
      '颜色': '白色、黑色、灰色',
      '产地': '中国'
    },
    featured: true
  },
  {
    id: 2,
    name: '有机山核桃礼盒',
    description: '来自高山的有机山核桃，营养丰富',
    fullDescription: '这款有机山核桃来自高海拔山区，采用有机种植方式，不使用任何化学肥料和农药。富含多种营养物质，口感香脆，是馈赠亲友的理想礼品。',
    price: 128.00,
    imageUrl: 'https://img1.baidu.com/it/u=1720771129,1687896126&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
    category: 'food',
    gallery: [
      'https://img1.baidu.com/it/u=1720771129,1687896126&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
      'https://img2.baidu.com/it/u=708614966,3036762506&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      'https://img0.baidu.com/it/u=277558351,2675361508&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427'
    ],
    specifications: {
      '净含量': '500g',
      '产地': '中国云南',
      '保质期': '12个月',
      '储存方式': '密封、阴凉、干燥处'
    },
    featured: true
  },
  {
    id: 3,
    name: '智能血压计',
    description: '高精度测量，数据云端同步',
    fullDescription: '这款智能血压计采用先进的测量技术，测量精度高，操作简便。支持蓝牙连接手机APP，实现数据云端同步，方便随时查看历史记录和趋势分析。',
    price: 299.00,
    originalPrice: 359.00,
    imageUrl: 'https://img0.baidu.com/it/u=1418638849,4059454340&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'electronics',
    tag: '热销',
    gallery: [
      'https://img0.baidu.com/it/u=1418638849,4059454340&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      'https://img1.baidu.com/it/u=1160365704,4055487867&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      'https://img1.baidu.com/it/u=880953598,1188419009&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=493'
    ],
    specifications: {
      '测量范围': '0-299mmHg',
      '精度': '±3mmHg',
      '电源': '可充电锂电池',
      '连接方式': '蓝牙4.0'
    },
    featured: true
  },
  {
    id: 4,
    name: '天然石英手链',
    description: '天然石英制作，有助平衡身心',
    price: 68.00,
    imageUrl: 'https://img0.baidu.com/it/u=3109782237,2260639396&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    category: 'accessories',
    featured: false
  },
  {
    id: 5,
    name: '爱心公益围巾',
    description: '100%羊毛制作，温暖冬季',
    price: 159.00,
    originalPrice: 199.00,
    imageUrl: 'https://img0.baidu.com/it/u=1043334023,3334448310&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'clothes',
    tag: '公益款',
    featured: false
  },
  {
    id: 6,
    name: '有机蜂蜜礼盒',
    description: '天然无添加，健康好礼',
    price: 168.00,
    imageUrl: 'https://img2.baidu.com/it/u=4077758591,1057206082&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'food',
    featured: false
  },
  {
    id: 7,
    name: '智能体脂秤',
    description: '精准测量，多项身体指标',
    price: 199.00,
    originalPrice: 249.00,
    imageUrl: 'https://img2.baidu.com/it/u=2194721213,261408866&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'electronics',
    tag: '新品',
    featured: false
  },
  {
    id: 8,
    name: '竹炭护膝',
    description: '远红外保暖，缓解关节不适',
    price: 89.00,
    imageUrl: 'https://img2.baidu.com/it/u=3727375769,2994875730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    category: 'accessories',
    featured: true
  },
]);

// 状态变量
const currentCategory = ref('all');
const sortOption = ref('default');
const currentPage = ref(1);
const pageSize = ref(8);
const productDetailVisible = ref(false);
interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  tag?: string;
  gallery?: string[];
  specifications?: Record<string, string>;
  featured: boolean;
}

const selectedProduct = ref<Product | null>(null);
const purchaseQuantity = ref(1);

// 计算属性：精选商品
const featuredProducts = computed(() => {
  return allProducts.value.filter(product => product.featured).slice(0, 4);
});

// 计算属性：筛选后的商品
const filteredProducts = computed(() => {
  let result = [...allProducts.value];

  // 分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(product => product.category === currentCategory.value);
  }

  // 排序
  switch (sortOption.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // 假设id越大表示越新
      result.sort((a, b) => b.id - a.id);
      break;
    default:
      // 默认排序，可以按推荐度等
      break;
  }

  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return result.slice(startIndex, startIndex + pageSize.value);
});

// 计算属性：总商品数
const totalProducts = computed(() => {
  if (currentCategory.value === 'all') {
    return allProducts.value.length;
  }
  return allProducts.value.filter(product => product.category === currentCategory.value).length;
});

// 方法：选择分类
const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId;
  currentPage.value = 1;
};

// 方法：页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 方法：显示商品详情
const showProductDetail = (productId: number) => {
  const product = allProducts.value.find(item => item.id === productId);
  if (product) {
    selectedProduct.value = product as Product;
    productDetailVisible.value = true;
    purchaseQuantity.value = 1;
  }
};

// 购物车相关状态
const cartVisible = ref(false);
const cartItems = ref<Array<{
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}>>([]);

// 购物车总价计算
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 切换购物车显示状态
const toggleCart = () => {
  cartVisible.value = !cartVisible.value;
};

// 从商品中创建购物车项目
const createCartItem = (product: Product, quantity: number) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: quantity
  };
};

// 修改原有的添加购物车方法
const addToCart = (product: Product, quantity = 1) => {
  // 检查商品是否已在购物车中
  const existingItem = cartItems.value.find(item => item.id === product.id);

  if (existingItem) {
    // 如果商品已存在，增加数量
    existingItem.quantity += quantity;
    ElMessage({
      message: `已更新购物车中 ${product.name} 的数量为 ${existingItem.quantity}`,
      type: 'success'
    });
  } else {
    // 如果商品不存在，添加到购物车
    cartItems.value.push(createCartItem(product, quantity));
    ElMessage({
      message: `已添加 ${quantity} 件 ${product.name} 到购物车`,
      type: 'success'
    });
  }

  // 自动打开购物车
  //cartVisible.value = true;

  // 存储到本地存储以便页面刷新后保留
  // 回头可能会往pinia那里放
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
};

// 更新购物车项目
const updateCartItem = () => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
};

// 从购物车中移除商品
const removeFromCart = (item: { id: number }) => {
  const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id);
  if (index !== -1) {
    cartItems.value.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
    ElMessage({
      message: '商品已从购物车移除',
      type: 'success'
    });
  }
};

// 清空购物车
const clearCart = () => {
  cartItems.value = [];
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
  ElMessage({
    message: '购物车已清空',
    type: 'info'
  });
};

// 结算功能
const checkout = () => {
  if (cartItems.value.length === 0) {
    ElMessage({
      message: '购物车为空，无法结算',
      type: 'warning'
    });
    return;
  }

  ElMessage({
    message: '正在前往结算页面...',
    type: 'success'
  });

  // 这里可以实现跳转到结算页面
  // router.push('/checkout');
};

// 立即购买功能
const buyNow = (product: Product, quantity = 1) => {
  // 可以根据实际业务跳转到结算页并带上当前商品和数量
  ElMessage({
    message: `立即购买 ${quantity} 件 ${product.name}`,
    type: 'success'
  });
  // 示例：将商品加入购物车并跳转结算
  addToCart(product, quantity);
  checkout();
};

// 页面挂载时从本地存储加载购物车
onMounted(() => {
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart);
    } catch (e) {
      console.error('Failed to parse cart data from localStorage', e);
    }
  }

  console.log('商城页面已加载');
});

// 跳转到指定链接
const navigateTo = (link: string) => {
  if (link.startsWith('http')) {
    window.open(link, '_blank');
  } else {
    router.push(link);
  }
};
</script>

<style scoped>
.shop-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 轮播区域样式 */
.carousel-section {
  margin-bottom: 40px;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
}

.banner-content {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 20px;
  max-width: 500px;
  border-radius: 0 8px 8px 0;
}

.banner-content h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 16px;
  margin-bottom: 15px;
}

/* 分类区域样式 */
.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  height: 20px;
  width: 5px;
  background: #409EFF;
  border-radius: 2px;
}

.category-section {
  margin-bottom: 40px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.category-item {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f7fa;
}

.category-item:hover,
.category-item.active {
  background: #ecf5ff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
}

/* 商品推荐区域样式 */
.featured-section {
  margin-bottom: 40px;
}

.featured-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* 商品列表区域样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
  height: 200px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #F56C6C;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  margin-bottom: 8px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  color: #F56C6C;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-actions {
  display: flex;
  gap: 10px;
}

/* 分页器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 商品详情样式 */
.product-detail {
  display: flex;
  gap: 30px;
}

.product-detail-gallery {
  flex: 1;
  max-width: 50%;
}

.detail-image {
  width: 100%;
  height: 350px;
  object-fit: contain;
  background: #f7f7f7;
}

.product-detail-info {
  flex: 1;
}

.detail-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.detail-price {
  margin-bottom: 20px;
}

.detail-desc {
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.detail-specs {
  margin-bottom: 20px;
}

.detail-specs h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.spec-item {
  display: flex;
  margin-bottom: 5px;
}

.spec-name {
  width: 100px;
  color: #888;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 添加浮动购物车按钮样式 */
.floating-cart {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  background-color: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  z-index: 100;
}

.floating-cart:hover {
  transform: scale(1.1);
  background-color: #337ecc;
}

.cart-badge {
  display: block;
}

/* 购物车内容样式 */
.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  margin-right: 10px;
}

.item-name {
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.4;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  font-size: 14px;
  color: #F56C6C;
  font-weight: bold;
}

.item-quantity {
  margin-right: 10px;
}

.item-actions {
  display: flex;
}

.empty-cart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cart-footer {
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 15px;
  align-items: center;
}

.total-price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
  }

  .product-detail-gallery {
    max-width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .category-list {
    justify-content: center;
  }
}
</style>
