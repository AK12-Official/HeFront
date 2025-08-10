/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 电商平台Mock数据
 * 模拟MallLite电商系统的完整数据
 */

// 生成产品图片 URL
const generateImageUrl = (seed: number) =>
  `https://picsum.photos/300/300?random=${seed}`

// 模拟商品数据
const mockProducts = [
  // 手机通讯
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    subTitle: '专业级影像系统，钛金属设计',
    price: 9999,
    originalPrice: 10999,
    pic: generateImageUrl(1),
    albumPics: [generateImageUrl(1), generateImageUrl(101), generateImageUrl(201)],
    detailTitle: 'iPhone 15 Pro Max 详细介绍',
    detailDesc: '搭载A17 Pro芯片，支持专业级摄影功能',
    detailHtml: `
      <div class="product-detail">
        <h3>产品亮点</h3>
        <ul>
          <li>A17 Pro 芯片 - 行业领先的3纳米制程</li>
          <li>专业级相机系统 - 支持4K ProRes录制</li>
          <li>钛金属设计 - 更轻更强更耐用</li>
          <li>Action Button - 可自定义功能按键</li>
          <li>USB-C接口 - 支持USB 3.0高速传输</li>
        </ul>
        <h3>技术规格</h3>
        <table>
          <tr><td>显示屏</td><td>6.7英寸超视网膜XDR显示屏</td></tr>
          <tr><td>芯片</td><td>A17 Pro仿生芯片</td></tr>
          <tr><td>存储</td><td>256GB</td></tr>
          <tr><td>相机</td><td>4800万像素主摄 + 1200万像素超广角 + 1200万像素长焦</td></tr>
          <tr><td>电池</td><td>视频播放最长可达29小时</td></tr>
        </table>
        <img src="${generateImageUrl(1001)}" alt="产品详情图" style="width:100%; margin: 20px 0;" />
      </div>
    `,
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 1,
    brandName: 'Apple',
    stock: 100,
    sale: 1250,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 100,
    productAttributeValueList: [
      { id: 1, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 2, value: '钛原色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 1,
        productId: 1,
        skuCode: 'SKU001',
        price: 9999,
        stock: 50,
        lowStock: 10,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '钛原色' }
        ])
      }
    ]
  },
  {
    id: 2,
    name: '小米14 Ultra',
    subTitle: '徕卡专业光学镜头，骁龙8 Gen3',
    price: 6499,
    originalPrice: 6999,
    pic: generateImageUrl(2),
    albumPics: [generateImageUrl(2), generateImageUrl(102), generateImageUrl(202)],
    detailTitle: '小米14 Ultra 详细介绍',
    detailDesc: '徕卡专业光学镜头，骁龙8 Gen3处理器',
    detailHtml: `
      <div class="product-detail">
        <h3>徕卡影像系统</h3>
        <ul>
          <li>徕卡Summilux光学镜头 - 专业级成像品质</li>
          <li>可变光圈设计 - f/1.63-f/4.0智能调节</li>
          <li>全焦段2X变焦 - 覆盖13mm-120mm等效焦距</li>
          <li>徕卡原生双画质 - 同时输出徕卡风格和小米风格</li>
        </ul>
        <h3>性能配置</h3>
        <table>
          <tr><td>处理器</td><td>第三代骁龙8移动平台</td></tr>
          <tr><td>内存</td><td>12GB LPDDR5X</td></tr>
          <tr><td>存储</td><td>512GB UFS 4.0</td></tr>
          <tr><td>显示屏</td><td>6.73英寸2K LTPO AMOLED</td></tr>
          <tr><td>电池</td><td>5300mAh + 90W有线快充</td></tr>
        </table>
        <img src="${generateImageUrl(1002)}" alt="产品详情图" style="width:100%; margin: 20px 0;" />
      </div>
    `,
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 2,
    brandName: '小米',
    stock: 150,
    sale: 3456,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 85,
    productAttributeValueList: [
      { id: 6, value: '512GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 7, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 4,
        productId: 2,
        skuCode: 'SKU002',
        price: 6499,
        stock: 75,
        lowStock: 15,
        spData: JSON.stringify([
          { key: '存储容量', value: '512GB' },
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },
  {
    id: 3,
    name: 'OPPO Find X7 Pro',
    subTitle: '影像旗舰，质感设计',
    price: 5999,
    originalPrice: 6499,
    pic: generateImageUrl(3),
    albumPics: [generateImageUrl(3), generateImageUrl(103), generateImageUrl(203)],
    detailTitle: 'OPPO Find X7 Pro 详细介绍',
    detailDesc: '哈苏人像镜头，天玑9300处理器',
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 3,
    brandName: 'OPPO',
    stock: 120,
    sale: 2100,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 80,
    productAttributeValueList: [
      { id: 8, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 9, value: '星海蓝', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 5,
        productId: 3,
        skuCode: 'SKU003',
        price: 5999,
        stock: 60,
        lowStock: 12,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '星海蓝' }
        ])
      }
    ]
  },
  {
    id: 4,
    name: 'vivo X100 Pro',
    subTitle: '蔡司光学影像，天玑9300',
    price: 4999,
    originalPrice: 5499,
    pic: generateImageUrl(4),
    albumPics: [generateImageUrl(4), generateImageUrl(104), generateImageUrl(204)],
    detailTitle: 'vivo X100 Pro 详细介绍',
    detailDesc: '蔡司T*镀膜，自研V3影像芯片',
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 4,
    brandName: 'vivo',
    stock: 90,
    sale: 1890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 75,
    productAttributeValueList: [
      { id: 10, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 11, value: '钛色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 6,
        productId: 4,
        skuCode: 'SKU004',
        price: 4999,
        stock: 45,
        lowStock: 9,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '钛色' }
        ])
      }
    ]
  },

  // 电脑办公
  {
    id: 5,
    name: 'MacBook Pro 14英寸',
    subTitle: 'M3 Pro 芯片，专业级性能',
    price: 15999,
    originalPrice: 17999,
    pic: generateImageUrl(5),
    albumPics: [generateImageUrl(5), generateImageUrl(105), generateImageUrl(205)],
    detailTitle: 'MacBook Pro 14英寸详细介绍',
    detailDesc: '搭载M3 Pro芯片，支持专业级创作',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 1,
    brandName: 'Apple',
    stock: 80,
    sale: 856,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 95,
    productAttributeValueList: [
      { id: 3, value: '512GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 4, value: '深空灰色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 2,
        productId: 5,
        skuCode: 'SKU005',
        price: 15999,
        stock: 40,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '存储容量', value: '512GB' },
          { key: '颜色', value: '深空灰色' }
        ])
      }
    ]
  },
  {
    id: 6,
    name: '联想ThinkPad X1 Carbon',
    subTitle: '商务轻薄本，i7处理器',
    price: 12999,
    originalPrice: 14999,
    pic: generateImageUrl(6),
    albumPics: [generateImageUrl(6), generateImageUrl(106), generateImageUrl(206)],
    detailTitle: '联想ThinkPad X1 Carbon详细介绍',
    detailDesc: 'Intel第13代i7处理器，碳纤维机身',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 5,
    brandName: '联想',
    stock: 60,
    sale: 456,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 12, value: '16GB', productAttributeId: 3 },
      { id: 13, value: '512GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 7,
        productId: 6,
        skuCode: 'SKU006',
        price: 12999,
        stock: 30,
        lowStock: 6,
        spData: JSON.stringify([
          { key: '内存', value: '16GB' },
          { key: '存储', value: '512GB SSD' }
        ])
      }
    ]
  },
  {
    id: 7,
    name: '华为MateBook X Pro',
    subTitle: '3K全面屏，i5处理器',
    price: 9999,
    originalPrice: 11999,
    pic: generateImageUrl(7),
    albumPics: [generateImageUrl(7), generateImageUrl(107), generateImageUrl(207)],
    detailTitle: '华为MateBook X Pro详细介绍',
    detailDesc: '3:2屏幕比例，10点触控屏幕',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 6,
    brandName: '华为',
    stock: 70,
    sale: 623,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    sort: 85,
    productAttributeValueList: [
      { id: 14, value: '16GB', productAttributeId: 3 },
      { id: 15, value: '512GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 8,
        productId: 7,
        skuCode: 'SKU007',
        price: 9999,
        stock: 35,
        lowStock: 7,
        spData: JSON.stringify([
          { key: '内存', value: '16GB' },
          { key: '存储', value: '512GB SSD' }
        ])
      }
    ]
  },

  // 数码配件
  {
    id: 8,
    name: 'AirPods Pro (第3代)',
    subTitle: '自适应透明度，沉浸式音频',
    price: 1899,
    originalPrice: 1999,
    pic: generateImageUrl(8),
    albumPics: [generateImageUrl(8), generateImageUrl(108), generateImageUrl(208)],
    detailTitle: 'AirPods Pro (第3代) 详细介绍',
    detailDesc: '自适应透明度技术，带来更沉浸的音频体验',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 1,
    brandName: 'Apple',
    stock: 200,
    sale: 2341,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 5, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 3,
        productId: 8,
        skuCode: 'SKU008',
        price: 1899,
        stock: 100,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 9,
    name: 'Sony WH-1000XM5',
    subTitle: '无线降噪耳机，30小时续航',
    price: 2399,
    originalPrice: 2699,
    pic: generateImageUrl(9),
    albumPics: [generateImageUrl(9), generateImageUrl(109), generateImageUrl(209)],
    detailTitle: 'Sony WH-1000XM5详细介绍',
    detailDesc: 'V1处理器，LDAC高音质传输',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 7,
    brandName: 'Sony',
    stock: 150,
    sale: 1234,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 16, value: '午夜黑', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 9,
        productId: 9,
        skuCode: 'SKU009',
        price: 2399,
        stock: 75,
        lowStock: 15,
        spData: JSON.stringify([
          { key: '颜色', value: '午夜黑' }
        ])
      }
    ]
  },
  {
    id: 10,
    name: 'iPad Pro 11英寸',
    subTitle: 'M2芯片，液体视网膜显示屏',
    price: 6799,
    originalPrice: 7299,
    pic: generateImageUrl(10),
    albumPics: [generateImageUrl(10), generateImageUrl(110), generateImageUrl(210)],
    detailTitle: 'iPad Pro 11英寸详细介绍',
    detailDesc: 'ProMotion技术，支持Apple Pencil',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 1,
    brandName: 'Apple',
    stock: 80,
    sale: 890,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 17, value: '128GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 18, value: '深空灰色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 10,
        productId: 10,
        skuCode: 'SKU010',
        price: 6799,
        stock: 40,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '存储容量', value: '128GB' },
          { key: '颜色', value: '深空灰色' }
        ])
      }
    ]
  },

  // 家用电器
  {
    id: 11,
    name: '小米电视75英寸',
    subTitle: '4K HDR，金属边框',
    price: 3999,
    originalPrice: 4999,
    pic: generateImageUrl(11),
    albumPics: [generateImageUrl(11), generateImageUrl(111), generateImageUrl(211)],
    detailTitle: '小米电视75英寸详细介绍',
    detailDesc: '4K HDR显示，杜比视界',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 2,
    brandName: '小米',
    stock: 50,
    sale: 567,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 80,
    productAttributeValueList: [
      { id: 19, value: '75英寸', productAttributeId: 4 }
    ],
    skuStockList: [
      {
        id: 11,
        productId: 11,
        skuCode: 'SKU011',
        price: 3999,
        stock: 25,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '尺寸', value: '75英寸' }
        ])
      }
    ]
  },
  {
    id: 12,
    name: '海尔冰箱',
    subTitle: '双门对开，520L容量',
    price: 5999,
    originalPrice: 6999,
    pic: generateImageUrl(12),
    albumPics: [generateImageUrl(12), generateImageUrl(112), generateImageUrl(212)],
    detailTitle: '海尔冰箱详细介绍',
    detailDesc: '风冷无霜，变频节能',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 8,
    brandName: '海尔',
    stock: 30,
    sale: 234,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    sort: 75,
    productAttributeValueList: [
      { id: 20, value: '520L', productAttributeId: 5 },
      { id: 21, value: '银色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 12,
        productId: 12,
        skuCode: 'SKU012',
        price: 5999,
        stock: 15,
        lowStock: 3,
        spData: JSON.stringify([
          { key: '容量', value: '520L' },
          { key: '颜色', value: '银色' }
        ])
      }
    ]
  },

  // 服饰鞋帽
  {
    id: 13,
    name: 'Nike Air Max',
    subTitle: '经典跑鞋，舒适透气',
    price: 899,
    originalPrice: 1199,
    pic: generateImageUrl(13),
    albumPics: [generateImageUrl(13), generateImageUrl(113), generateImageUrl(213)],
    detailTitle: 'Nike Air Max详细介绍',
    detailDesc: 'Air Max气垫，提供出色缓震',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 9,
    brandName: 'Nike',
    stock: 100,
    sale: 1567,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 85,
    productAttributeValueList: [
      { id: 22, value: '42', productAttributeId: 6 },
      { id: 23, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 13,
        productId: 13,
        skuCode: 'SKU013',
        price: 899,
        stock: 50,
        lowStock: 10,
        spData: JSON.stringify([
          { key: '尺码', value: '42' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 14,
    name: 'Adidas运动外套',
    subTitle: '三条纹设计，防风防水',
    price: 599,
    originalPrice: 799,
    pic: generateImageUrl(14),
    albumPics: [generateImageUrl(14), generateImageUrl(114), generateImageUrl(214)],
    detailTitle: 'Adidas运动外套详细介绍',
    detailDesc: '经典三条纹，运动时尚',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 10,
    brandName: 'Adidas',
    stock: 80,
    sale: 987,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    sort: 70,
    productAttributeValueList: [
      { id: 24, value: 'L', productAttributeId: 7 },
      { id: 25, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 14,
        productId: 14,
        skuCode: 'SKU014',
        price: 599,
        stock: 40,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '尺码', value: 'L' },
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },

  // 美妆护肤
  {
    id: 15,
    name: '兰蔻小黑瓶',
    subTitle: '肌底精华液，抗老修护',
    price: 1280,
    originalPrice: 1580,
    pic: generateImageUrl(15),
    albumPics: [generateImageUrl(15), generateImageUrl(115), generateImageUrl(215)],
    detailTitle: '兰蔻小黑瓶详细介绍',
    detailDesc: '二代酵母精华，7天肌肤重现年轻光采',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 11,
    brandName: '兰蔻',
    stock: 120,
    sale: 2456,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 95,
    productAttributeValueList: [
      { id: 26, value: '50ml', productAttributeId: 8 }
    ],
    skuStockList: [
      {
        id: 15,
        productId: 15,
        skuCode: 'SKU015',
        price: 1280,
        stock: 60,
        lowStock: 12,
        spData: JSON.stringify([
          { key: '规格', value: '50ml' }
        ])
      }
    ]
  },
  {
    id: 16,
    name: '雅诗兰黛小棕瓶',
    subTitle: '修护精华，抗氧化',
    price: 1680,
    originalPrice: 1980,
    pic: generateImageUrl(16),
    albumPics: [generateImageUrl(16), generateImageUrl(116), generateImageUrl(216)],
    detailTitle: '雅诗兰黛小棕瓶详细介绍',
    detailDesc: 'ChronoluxCB™技术，抗氧化修护',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 12,
    brandName: '雅诗兰黛',
    stock: 90,
    sale: 1890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 27, value: '50ml', productAttributeId: 8 }
    ],
    skuStockList: [
      {
        id: 16,
        productId: 16,
        skuCode: 'SKU016',
        price: 1680,
        stock: 45,
        lowStock: 9,
        spData: JSON.stringify([
          { key: '规格', value: '50ml' }
        ])
      }
    ]
  },

  // ==================== 新增商品数据 - 为"猜你喜欢"部分提供更多数据 ====================

  // 更多手机通讯类商品
  {
    id: 21,
    name: '华为Mate 60 Pro',
    subTitle: '突破想象，遥遥领先',
    price: 6999,
    originalPrice: 7999,
    pic: generateImageUrl(21),
    albumPics: [generateImageUrl(21), generateImageUrl(121), generateImageUrl(221)],
    detailTitle: '华为Mate 60 Pro 详细介绍',
    detailDesc: '麒麟9000S芯片，卫星通话功能',
    detailHtml: `
      <div class="product-detail">
        <h3>创新突破</h3>
        <ul>
          <li>麒麟9000S芯片 - 自主研发，性能卓越</li>
          <li>卫星通话功能 - 无信号也能通话</li>
          <li>超感知影像 - XMAGE影像系统</li>
          <li>昆仑玻璃 - 十倍抗跌能力</li>
        </ul>
      </div>
    `,
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 6,
    brandName: '华为',
    stock: 80,
    sale: 2800,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 95,
    productAttributeValueList: [
      { id: 50, value: '512GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 51, value: '雅川青', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 21,
        productId: 21,
        skuCode: 'SKU021',
        price: 6999,
        stock: 40,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '存储容量', value: '512GB' },
          { key: '颜色', value: '雅川青' }
        ])
      }
    ]
  },
  {
    id: 22,
    name: '三星Galaxy S24 Ultra',
    subTitle: 'AI手机新纪元',
    price: 8999,
    originalPrice: 9999,
    pic: generateImageUrl(22),
    albumPics: [generateImageUrl(22), generateImageUrl(122), generateImageUrl(222)],
    detailTitle: '三星Galaxy S24 Ultra 详细介绍',
    detailDesc: '骁龙8 Gen3处理器，AI影像功能',
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 13,
    brandName: '三星',
    stock: 70,
    sale: 1650,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 52, value: '1TB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 53, value: '钛灰色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 22,
        productId: 22,
        skuCode: 'SKU022',
        price: 8999,
        stock: 35,
        lowStock: 7,
        spData: JSON.stringify([
          { key: '存储容量', value: '1TB' },
          { key: '颜色', value: '钛灰色' }
        ])
      }
    ]
  },
  {
    id: 23,
    name: '一加12',
    subTitle: '性能旗舰，极速体验',
    price: 4299,
    originalPrice: 4799,
    pic: generateImageUrl(23),
    albumPics: [generateImageUrl(23), generateImageUrl(123), generateImageUrl(223)],
    detailTitle: '一加12 详细介绍',
    detailDesc: '骁龙8 Gen3芯片，100W超级闪充',
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 14,
    brandName: '一加',
    stock: 95,
    sale: 3200,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 85,
    productAttributeValueList: [
      { id: 54, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 55, value: '岩黑', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 23,
        productId: 23,
        skuCode: 'SKU023',
        price: 4299,
        stock: 47,
        lowStock: 10,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '岩黑' }
        ])
      }
    ]
  },
  {
    id: 24,
    name: 'Nothing Phone (2)',
    subTitle: '透明设计，独特美学',
    price: 3199,
    originalPrice: 3699,
    pic: generateImageUrl(24),
    albumPics: [generateImageUrl(24), generateImageUrl(124), generateImageUrl(224)],
    detailTitle: 'Nothing Phone (2) 详细介绍',
    detailDesc: '骁龙8+ Gen1芯片，独特透明背板',
    productCategoryId: 1,
    productCategoryName: '手机通讯',
    brandId: 15,
    brandName: 'Nothing',
    stock: 55,
    sale: 1280,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 80,
    productAttributeValueList: [
      { id: 56, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 57, value: '透明', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 24,
        productId: 24,
        skuCode: 'SKU024',
        price: 3199,
        stock: 27,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '透明' }
        ])
      }
    ]
  },

  // 更多电脑办公类商品
  {
    id: 25,
    name: '戴尔XPS 13 Plus',
    subTitle: '轻薄本新标杆，创作者首选',
    price: 11999,
    originalPrice: 13999,
    pic: generateImageUrl(25),
    albumPics: [generateImageUrl(25), generateImageUrl(125), generateImageUrl(225)],
    detailTitle: '戴尔XPS 13 Plus 详细介绍',
    detailDesc: 'Intel第12代i7处理器，13.4英寸OLED触屏',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 16,
    brandName: '戴尔',
    stock: 45,
    sale: 680,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 58, value: '16GB', productAttributeId: 3, productAttributeName: '内存' },
      { id: 59, value: '512GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 25,
        productId: 25,
        skuCode: 'SKU025',
        price: 11999,
        stock: 22,
        lowStock: 4,
        spData: JSON.stringify([
          { key: '内存', value: '16GB' },
          { key: '存储', value: '512GB SSD' }
        ])
      }
    ]
  },
  {
    id: 26,
    name: '微软Surface Laptop 5',
    subTitle: 'Windows 11专为创作而生',
    price: 9999,
    originalPrice: 11499,
    pic: generateImageUrl(26),
    albumPics: [generateImageUrl(26), generateImageUrl(126), generateImageUrl(226)],
    detailTitle: '微软Surface Laptop 5 详细介绍',
    detailDesc: 'Intel第12代i5处理器，13.5英寸PixelSense触摸屏',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 17,
    brandName: '微软',
    stock: 65,
    sale: 890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 87,
    productAttributeValueList: [
      { id: 60, value: '8GB', productAttributeId: 3, productAttributeName: '内存' },
      { id: 61, value: '256GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 26,
        productId: 26,
        skuCode: 'SKU026',
        price: 9999,
        stock: 32,
        lowStock: 6,
        spData: JSON.stringify([
          { key: '内存', value: '8GB' },
          { key: '存储', value: '256GB SSD' }
        ])
      }
    ]
  },
  {
    id: 27,
    name: 'MacBook Air M2',
    subTitle: '超薄设计，强劲性能',
    price: 8999,
    originalPrice: 9999,
    pic: generateImageUrl(27),
    albumPics: [generateImageUrl(27), generateImageUrl(127), generateImageUrl(227)],
    detailTitle: 'MacBook Air M2 详细介绍',
    detailDesc: 'Apple M2芯片，13.6英寸液晶视网膜显示屏',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 1,
    brandName: 'Apple',
    stock: 85,
    sale: 1560,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 89,
    productAttributeValueList: [
      { id: 62, value: '8GB', productAttributeId: 3, productAttributeName: '内存' },
      { id: 63, value: '256GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 27,
        productId: 27,
        skuCode: 'SKU027',
        price: 8999,
        stock: 42,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '内存', value: '8GB' },
          { key: '存储', value: '256GB SSD' }
        ])
      }
    ]
  },
  {
    id: 28,
    name: 'ASUS华硕天选4',
    subTitle: '游戏本性价比之王',
    price: 6999,
    originalPrice: 7999,
    pic: generateImageUrl(28),
    albumPics: [generateImageUrl(28), generateImageUrl(128), generateImageUrl(228)],
    detailTitle: 'ASUS华硕天选4 详细介绍',
    detailDesc: 'AMD锐龙7处理器，RTX 4060独显',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 18,
    brandName: '华硕',
    stock: 120,
    sale: 2340,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 82,
    productAttributeValueList: [
      { id: 64, value: '16GB', productAttributeId: 3, productAttributeName: '内存' },
      { id: 65, value: '512GB SSD', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 28,
        productId: 28,
        skuCode: 'SKU028',
        price: 6999,
        stock: 60,
        lowStock: 12,
        spData: JSON.stringify([
          { key: '内存', value: '16GB' },
          { key: '存储', value: '512GB SSD' }
        ])
      }
    ]
  },

  // 更多数码配件类商品
  {
    id: 29,
    name: 'AirPods Pro 2',
    subTitle: '主动降噪，空间音频',
    price: 1899,
    originalPrice: 2199,
    pic: generateImageUrl(29),
    albumPics: [generateImageUrl(29), generateImageUrl(129), generateImageUrl(229)],
    detailTitle: 'AirPods Pro 2 详细介绍',
    detailDesc: 'H2芯片，自适应通透模式',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 1,
    brandName: 'Apple',
    stock: 150,
    sale: 4560,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 96,
    productAttributeValueList: [
      { id: 66, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 29,
        productId: 29,
        skuCode: 'SKU029',
        price: 1899,
        stock: 75,
        lowStock: 15,
        spData: JSON.stringify([
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 30,
    name: 'Sony WH-1000XM5',
    subTitle: '业界顶级降噪耳机',
    price: 2399,
    originalPrice: 2799,
    pic: generateImageUrl(30),
    albumPics: [generateImageUrl(30), generateImageUrl(130), generateImageUrl(230)],
    detailTitle: 'Sony WH-1000XM5 详细介绍',
    detailDesc: 'V1处理器，30小时续航',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 7,
    brandName: 'Sony',
    stock: 88,
    sale: 1890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 91,
    productAttributeValueList: [
      { id: 67, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 30,
        productId: 30,
        skuCode: 'SKU030',
        price: 2399,
        stock: 44,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },
  {
    id: 31,
    name: 'Anker 氮化镓充电器',
    subTitle: '65W快充，小巧便携',
    price: 199,
    originalPrice: 249,
    pic: generateImageUrl(31),
    albumPics: [generateImageUrl(31), generateImageUrl(131), generateImageUrl(231)],
    detailTitle: 'Anker 氮化镓充电器 详细介绍',
    detailDesc: '65W功率，支持PD快充协议',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 19,
    brandName: 'Anker',
    stock: 200,
    sale: 8960,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 70,
    productAttributeValueList: [
      { id: 68, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 31,
        productId: 31,
        skuCode: 'SKU031',
        price: 199,
        stock: 100,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 32,
    name: '小米移动电源3',
    subTitle: '20000mAh大容量，双向快充',
    price: 149,
    originalPrice: 179,
    pic: generateImageUrl(32),
    albumPics: [generateImageUrl(32), generateImageUrl(132), generateImageUrl(232)],
    detailTitle: '小米移动电源3 详细介绍',
    detailDesc: '20000mAh容量，支持22.5W快充',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 2,
    brandName: '小米',
    stock: 180,
    sale: 12450,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 75,
    productAttributeValueList: [
      { id: 69, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 32,
        productId: 32,
        skuCode: 'SKU032',
        price: 149,
        stock: 90,
        lowStock: 18,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },

  // 更多家用电器类商品
  {
    id: 33,
    name: '小米空气净化器Pro',
    subTitle: '高效净化，静音运行',
    price: 1299,
    originalPrice: 1499,
    pic: generateImageUrl(33),
    albumPics: [generateImageUrl(33), generateImageUrl(133), generateImageUrl(233)],
    detailTitle: '小米空气净化器Pro 详细介绍',
    detailDesc: 'HEPA滤网，智能检测空气质量',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 2,
    brandName: '小米',
    stock: 75,
    sale: 3450,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 70, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 33,
        productId: 33,
        skuCode: 'SKU033',
        price: 1299,
        stock: 37,
        lowStock: 7,
        spData: JSON.stringify([
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 34,
    name: '戴森V15吸尘器',
    subTitle: '激光探测，深度清洁',
    price: 4899,
    originalPrice: 5499,
    pic: generateImageUrl(34),
    albumPics: [generateImageUrl(34), generateImageUrl(134), generateImageUrl(234)],
    detailTitle: '戴森V15吸尘器 详细介绍',
    detailDesc: '激光探测微尘，强力吸除过敏原',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 20,
    brandName: '戴森',
    stock: 35,
    sale: 1230,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 93,
    productAttributeValueList: [
      { id: 71, value: '金色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 34,
        productId: 34,
        skuCode: 'SKU034',
        price: 4899,
        stock: 17,
        lowStock: 3,
        spData: JSON.stringify([
          { key: '颜色', value: '金色' }
        ])
      }
    ]
  },
  {
    id: 35,
    name: '九阳破壁机',
    subTitle: '营养破壁，健康生活',
    price: 899,
    originalPrice: 1199,
    pic: generateImageUrl(35),
    albumPics: [generateImageUrl(35), generateImageUrl(135), generateImageUrl(235)],
    detailTitle: '九阳破壁机 详细介绍',
    detailDesc: '6叶精钢刀头，一键智能制作',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 21,
    brandName: '九阳',
    stock: 110,
    sale: 5680,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 78,
    productAttributeValueList: [
      { id: 72, value: '1.75L', productAttributeId: 4, productAttributeName: '容量' }
    ],
    skuStockList: [
      {
        id: 35,
        productId: 35,
        skuCode: 'SKU035',
        price: 899,
        stock: 55,
        lowStock: 11,
        spData: JSON.stringify([
          { key: '容量', value: '1.75L' }
        ])
      }
    ]
  },
  {
    id: 36,
    name: '美的变频空调',
    subTitle: '一级能效，智能变频',
    price: 2899,
    originalPrice: 3399,
    pic: generateImageUrl(36),
    albumPics: [generateImageUrl(36), generateImageUrl(136), generateImageUrl(236)],
    detailTitle: '美的变频空调 详细介绍',
    detailDesc: '1.5匹变频，静音设计',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 22,
    brandName: '美的',
    stock: 60,
    sale: 2190,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 84,
    productAttributeValueList: [
      { id: 73, value: '1.5匹', productAttributeId: 5, productAttributeName: '功率' }
    ],
    skuStockList: [
      {
        id: 36,
        productId: 36,
        skuCode: 'SKU036',
        price: 2899,
        stock: 30,
        lowStock: 6,
        spData: JSON.stringify([
          { key: '功率', value: '1.5匹' }
        ])
      }
    ]
  },

  // 更多服饰鞋帽类商品
  {
    id: 37,
    name: 'Nike Air Force 1',
    subTitle: '经典永恒，街头传奇',
    price: 899,
    originalPrice: 999,
    pic: generateImageUrl(37),
    albumPics: [generateImageUrl(37), generateImageUrl(137), generateImageUrl(237)],
    detailTitle: 'Nike Air Force 1 详细介绍',
    detailDesc: '经典低帮篮球鞋，Air缓震科技',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 9,
    brandName: 'Nike',
    stock: 140,
    sale: 6780,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 86,
    productAttributeValueList: [
      { id: 74, value: '42', productAttributeId: 6, productAttributeName: '尺码' },
      { id: 75, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 37,
        productId: 37,
        skuCode: 'SKU037',
        price: 899,
        stock: 70,
        lowStock: 14,
        spData: JSON.stringify([
          { key: '尺码', value: '42' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 38,
    name: 'Adidas Ultraboost 22',
    subTitle: '极致缓震，能量回弹',
    price: 1299,
    originalPrice: 1499,
    pic: generateImageUrl(38),
    albumPics: [generateImageUrl(38), generateImageUrl(138), generateImageUrl(238)],
    detailTitle: 'Adidas Ultraboost 22 详细介绍',
    detailDesc: 'BOOST缓震科技，Primeknit鞋面',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 10,
    brandName: 'Adidas',
    stock: 85,
    sale: 3420,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 83,
    productAttributeValueList: [
      { id: 76, value: '42.5', productAttributeId: 6, productAttributeName: '尺码' },
      { id: 77, value: '黑白', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 38,
        productId: 38,
        skuCode: 'SKU038',
        price: 1299,
        stock: 42,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '尺码', value: '42.5' },
          { key: '颜色', value: '黑白' }
        ])
      }
    ]
  },
  {
    id: 39,
    name: 'Uniqlo 优衣库T恤',
    subTitle: '基础百搭，舒适面料',
    price: 99,
    originalPrice: 129,
    pic: generateImageUrl(39),
    albumPics: [generateImageUrl(39), generateImageUrl(139), generateImageUrl(239)],
    detailTitle: 'Uniqlo 优衣库T恤 详细介绍',
    detailDesc: '100%纯棉面料，多色可选',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 23,
    brandName: '优衣库',
    stock: 220,
    sale: 15670,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 65,
    productAttributeValueList: [
      { id: 78, value: 'L', productAttributeId: 7, productAttributeName: '尺寸' },
      { id: 79, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 39,
        productId: 39,
        skuCode: 'SKU039',
        price: 99,
        stock: 110,
        lowStock: 22,
        spData: JSON.stringify([
          { key: '尺寸', value: 'L' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 40,
    name: 'Zara 商务休闲裤',
    subTitle: '时尚剪裁，商务休闲',
    price: 399,
    originalPrice: 499,
    pic: generateImageUrl(40),
    albumPics: [generateImageUrl(40), generateImageUrl(140), generateImageUrl(240)],
    detailTitle: 'Zara 商务休闲裤 详细介绍',
    detailDesc: '修身版型，多场合适穿',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 24,
    brandName: 'Zara',
    stock: 95,
    sale: 2340,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 76,
    productAttributeValueList: [
      { id: 80, value: '32', productAttributeId: 8, productAttributeName: '腰围' },
      { id: 81, value: '深蓝', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 40,
        productId: 40,
        skuCode: 'SKU040',
        price: 399,
        stock: 47,
        lowStock: 9,
        spData: JSON.stringify([
          { key: '腰围', value: '32' },
          { key: '颜色', value: '深蓝' }
        ])
      }
    ]
  },

  // 更多美妆护肤类商品
  {
    id: 41,
    name: '兰蔻小黑瓶精华',
    subTitle: '肌底修护，焕发光彩',
    price: 1080,
    originalPrice: 1200,
    pic: generateImageUrl(41),
    albumPics: [generateImageUrl(41), generateImageUrl(141), generateImageUrl(241)],
    detailTitle: '兰蔻小黑瓶精华 详细介绍',
    detailDesc: '二代小黑瓶，7天肌肤年轻态',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 11,
    brandName: '兰蔻',
    stock: 120,
    sale: 8900,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 94,
    productAttributeValueList: [
      { id: 82, value: '50ml', productAttributeId: 9, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 41,
        productId: 41,
        skuCode: 'SKU041',
        price: 1080,
        stock: 60,
        lowStock: 12,
        spData: JSON.stringify([
          { key: '规格', value: '50ml' }
        ])
      }
    ]
  },
  {
    id: 42,
    name: '雅诗兰黛小棕瓶',
    subTitle: '抗老修护，紧致肌肤',
    price: 1580,
    originalPrice: 1780,
    pic: generateImageUrl(42),
    albumPics: [generateImageUrl(42), generateImageUrl(142), generateImageUrl(242)],
    detailTitle: '雅诗兰黛小棕瓶 详细介绍',
    detailDesc: '抗老专家，逆转肌龄',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 12,
    brandName: '雅诗兰黛',
    stock: 80,
    sale: 5690,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 83, value: '50ml', productAttributeId: 9, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 42,
        productId: 42,
        skuCode: 'SKU042',
        price: 1580,
        stock: 40,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '规格', value: '50ml' }
        ])
      }
    ]
  },
  {
    id: 43,
    name: 'SK-II神仙水',
    subTitle: '晶莹剔透，水润肌肤',
    price: 1390,
    originalPrice: 1590,
    pic: generateImageUrl(43),
    albumPics: [generateImageUrl(43), generateImageUrl(143), generateImageUrl(243)],
    detailTitle: 'SK-II神仙水 详细介绍',
    detailDesc: 'Pitera精华，改善肌肤质感',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 25,
    brandName: 'SK-II',
    stock: 95,
    sale: 6780,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 89,
    productAttributeValueList: [
      { id: 84, value: '230ml', productAttributeId: 9, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 43,
        productId: 43,
        skuCode: 'SKU043',
        price: 1390,
        stock: 47,
        lowStock: 9,
        spData: JSON.stringify([
          { key: '规格', value: '230ml' }
        ])
      }
    ]
  },
  {
    id: 44,
    name: '薇诺娜舒敏保湿霜',
    subTitle: '敏感肌专用，温和保湿',
    price: 168,
    originalPrice: 208,
    pic: generateImageUrl(44),
    albumPics: [generateImageUrl(44), generateImageUrl(144), generateImageUrl(244)],
    detailTitle: '薇诺娜舒敏保湿霜 详细介绍',
    detailDesc: '马齿苋提取物，舒缓敏感',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 26,
    brandName: '薇诺娜',
    stock: 180,
    sale: 12450,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 72,
    productAttributeValueList: [
      { id: 85, value: '50g', productAttributeId: 9, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 44,
        productId: 44,
        skuCode: 'SKU044',
        price: 168,
        stock: 90,
        lowStock: 18,
        spData: JSON.stringify([
          { key: '规格', value: '50g' }
        ])
      }
    ]
  },

  // 新增数码产品类商品
  {
    id: 45,
    name: 'iPad Pro 12.9英寸',
    subTitle: 'M2芯片，专业创作利器',
    price: 8599,
    originalPrice: 9599,
    pic: generateImageUrl(45),
    albumPics: [generateImageUrl(45), generateImageUrl(145), generateImageUrl(245)],
    detailTitle: 'iPad Pro 12.9英寸 详细介绍',
    detailDesc: 'Apple M2芯片，Liquid视网膜XDR显示屏',
    productCategoryId: 2,
    productCategoryName: '电脑办公',
    brandId: 1,
    brandName: 'Apple',
    stock: 65,
    sale: 1890,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 86, value: '256GB', productAttributeId: 1, productAttributeName: '存储容量' },
      { id: 87, value: '深空灰色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 45,
        productId: 45,
        skuCode: 'SKU045',
        price: 8599,
        stock: 32,
        lowStock: 6,
        spData: JSON.stringify([
          { key: '存储容量', value: '256GB' },
          { key: '颜色', value: '深空灰色' }
        ])
      }
    ]
  },
  {
    id: 46,
    name: 'Apple Watch Series 9',
    subTitle: '健康守护，智能便捷',
    price: 2999,
    originalPrice: 3399,
    pic: generateImageUrl(46),
    albumPics: [generateImageUrl(46), generateImageUrl(146), generateImageUrl(246)],
    detailTitle: 'Apple Watch Series 9 详细介绍',
    detailDesc: 'S9芯片，全天候视网膜显示屏',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 1,
    brandName: 'Apple',
    stock: 110,
    sale: 4560,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 88, value: '45mm', productAttributeId: 10, productAttributeName: '尺寸' },
      { id: 89, value: '午夜色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 46,
        productId: 46,
        skuCode: 'SKU046',
        price: 2999,
        stock: 55,
        lowStock: 11,
        spData: JSON.stringify([
          { key: '尺寸', value: '45mm' },
          { key: '颜色', value: '午夜色' }
        ])
      }
    ]
  },
  {
    id: 47,
    name: 'Kindle Oasis',
    subTitle: '专业阅读器，护眼显示',
    price: 1899,
    originalPrice: 2399,
    pic: generateImageUrl(47),
    albumPics: [generateImageUrl(47), generateImageUrl(147), generateImageUrl(247)],
    detailTitle: 'Kindle Oasis 详细介绍',
    detailDesc: '7英寸E-ink屏幕，IPX8防水',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 27,
    brandName: 'Amazon',
    stock: 75,
    sale: 2340,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 79,
    productAttributeValueList: [
      { id: 90, value: '32GB', productAttributeId: 1, productAttributeName: '存储容量' }
    ],
    skuStockList: [
      {
        id: 47,
        productId: 47,
        skuCode: 'SKU047',
        price: 1899,
        stock: 37,
        lowStock: 7,
        spData: JSON.stringify([
          { key: '存储容量', value: '32GB' }
        ])
      }
    ]
  },
  {
    id: 48,
    name: 'GoPro Hero 12',
    subTitle: '运动摄影，4K防抖',
    price: 3299,
    originalPrice: 3799,
    pic: generateImageUrl(48),
    albumPics: [generateImageUrl(48), generateImageUrl(148), generateImageUrl(248)],
    detailTitle: 'GoPro Hero 12 详细介绍',
    detailDesc: 'GP2处理器，HyperSmooth 5.0防抖',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 28,
    brandName: 'GoPro',
    stock: 45,
    sale: 1560,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 85,
    productAttributeValueList: [
      { id: 91, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 48,
        productId: 48,
        skuCode: 'SKU048',
        price: 3299,
        stock: 22,
        lowStock: 4,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },

  // 继续添加更多商品以达到足够的数量
  {
    id: 49,
    name: 'Nintendo Switch OLED',
    subTitle: '便携游戏机，OLED屏幕',
    price: 2599,
    originalPrice: 2999,
    pic: generateImageUrl(49),
    albumPics: [generateImageUrl(49), generateImageUrl(149), generateImageUrl(249)],
    detailTitle: 'Nintendo Switch OLED 详细介绍',
    detailDesc: '7英寸OLED屏幕，增强音频',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 29,
    brandName: '任天堂',
    stock: 90,
    sale: 3450,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 87,
    productAttributeValueList: [
      { id: 92, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 49,
        productId: 49,
        skuCode: 'SKU049',
        price: 2599,
        stock: 45,
        lowStock: 9,
        spData: JSON.stringify([
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 50,
    name: 'Tesla Model Y车载充电器',
    subTitle: '车载快充，智能识别',
    price: 299,
    originalPrice: 399,
    pic: generateImageUrl(50),
    albumPics: [generateImageUrl(50), generateImageUrl(150), generateImageUrl(250)],
    detailTitle: 'Tesla Model Y车载充电器 详细介绍',
    detailDesc: '支持PD快充，智能温控',
    productCategoryId: 3,
    productCategoryName: '数码配件',
    brandId: 30,
    brandName: 'Tesla',
    stock: 130,
    sale: 2890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 74,
    productAttributeValueList: [
      { id: 93, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 50,
        productId: 50,
        skuCode: 'SKU050',
        price: 299,
        stock: 65,
        lowStock: 13,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },

  // ==================== 更多家用电器 ====================
  {
    id: 51,
    name: '戴森吸尘器V15',
    subTitle: '激光探测，科学清洁',
    price: 4199,
    originalPrice: 4699,
    pic: generateImageUrl(51),
    albumPics: [generateImageUrl(51), generateImageUrl(151), generateImageUrl(251)],
    detailTitle: '戴森吸尘器V15详细介绍',
    detailDesc: '激光探测微尘，150AW强劲吸力',
    detailHtml: `
      <div class="product-detail">
        <h3>产品特点</h3>
        <ul>
          <li>激光灰尘探测技术 - 让微尘无所遁形</li>
          <li>150AW强劲吸力 - 深度清洁地毯和硬质地板</li>
          <li>5层整机HEPA过滤 - 过滤99.99%小至0.3微米的颗粒</li>
          <li>防缠绕螺旋形刷条 - 有效清除毛发</li>
          <li>智能LCD屏幕 - 实时显示清洁信息</li>
        </ul>
        <h3>技术规格</h3>
        <table>
          <tr><td>吸力</td><td>150AW</td></tr>
          <tr><td>电池续航</td><td>最长60分钟</td></tr>
          <tr><td>充电时间</td><td>4.5小时</td></tr>
          <tr><td>集尘桶容量</td><td>0.76L</td></tr>
        </table>
      </div>
    `,
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 20,
    brandName: '戴森',
    stock: 25,
    sale: 345,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 94, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 51,
        productId: 51,
        skuCode: 'SKU051',
        price: 4199,
        stock: 12,
        lowStock: 2,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' }
        ])
      }
    ]
  },
  {
    id: 52,
    name: '美的空调1.5匹',
    subTitle: '变频节能，静音舒适',
    price: 3299,
    originalPrice: 3999,
    pic: generateImageUrl(52),
    albumPics: [generateImageUrl(52), generateImageUrl(152), generateImageUrl(252)],
    detailTitle: '美的空调1.5匹详细介绍',
    detailDesc: '全直流变频技术，节能静音',
    productCategoryId: 4,
    productCategoryName: '家用电器',
    brandId: 22,
    brandName: '美的',
    stock: 60,
    sale: 1230,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 82,
    productAttributeValueList: [
      { id: 95, value: '1.5匹', productAttributeId: 12, productAttributeName: '匹数' },
      { id: 96, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 52,
        productId: 52,
        skuCode: 'SKU052',
        price: 3299,
        stock: 30,
        lowStock: 6,
        spData: JSON.stringify([
          { key: '匹数', value: '1.5匹' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },

  // ==================== 服饰鞋帽 ====================
  {
    id: 53,
    name: '优衣库纯棉T恤',
    subTitle: '舒适透气，经典百搭',
    price: 79,
    originalPrice: 99,
    pic: generateImageUrl(53),
    albumPics: [generateImageUrl(53), generateImageUrl(153), generateImageUrl(253)],
    detailTitle: '优衣库纯棉T恤详细介绍',
    detailDesc: '100%纯棉材质，舒适透气',
    detailHtml: `
      <div class="product-detail">
        <h3>产品特点</h3>
        <ul>
          <li>100%纯棉材质 - 天然舒适透气</li>
          <li>经典圆领设计 - 简约百搭</li>
          <li>精细做工 - 走线平整</li>
          <li>多色可选 - 满足不同需求</li>
        </ul>
        <h3>尺码建议</h3>
        <table>
          <tr><td>S</td><td>胸围88-92cm</td></tr>
          <tr><td>M</td><td>胸围92-96cm</td></tr>
          <tr><td>L</td><td>胸围96-100cm</td></tr>
          <tr><td>XL</td><td>胸围100-104cm</td></tr>
        </table>
      </div>
    `,
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 23,
    brandName: '优衣库',
    stock: 500,
    sale: 2800,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 97, value: 'M', productAttributeId: 5, productAttributeName: '尺码' },
      { id: 98, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 53,
        productId: 53,
        skuCode: 'SKU053',
        price: 79,
        stock: 100,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '尺码', value: 'M' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },
  {
    id: 54,
    name: 'Nike Air Force 1',
    subTitle: '经典百搭，街头潮流',
    price: 899,
    originalPrice: 999,
    pic: generateImageUrl(54),
    albumPics: [generateImageUrl(54), generateImageUrl(154), generateImageUrl(254)],
    detailTitle: 'Nike Air Force 1详细介绍',
    detailDesc: '经典篮球鞋款，百搭时尚',
    productCategoryId: 5,
    productCategoryName: '服饰鞋帽',
    brandId: 9,
    brandName: 'Nike',
    stock: 120,
    sale: 1890,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 99, value: '42', productAttributeId: 6, productAttributeName: '鞋码' },
      { id: 100, value: '白色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 54,
        productId: 54,
        skuCode: 'SKU054',
        price: 899,
        stock: 60,
        lowStock: 12,
        spData: JSON.stringify([
          { key: '鞋码', value: '42' },
          { key: '颜色', value: '白色' }
        ])
      }
    ]
  },

  // ==================== 美妆护肤 ====================
  {
    id: 55,
    name: '兰蔻小黑瓶精华',
    subTitle: '肌底修护，焕活新生',
    price: 1080,
    originalPrice: 1280,
    pic: generateImageUrl(55),
    albumPics: [generateImageUrl(55), generateImageUrl(155), generateImageUrl(255)],
    detailTitle: '兰蔻小黑瓶精华详细介绍',
    detailDesc: '二代小黑瓶，7天肌肤焕新',
    detailHtml: `
      <div class="product-detail">
        <h3>核心成分</h3>
        <ul>
          <li>二裂酵母发酵产物溶胞物 - 强化肌肤屏障</li>
          <li>透明质酸 - 深层补水保湿</li>
          <li>维生素E - 抗氧化护肤</li>
          <li>甘油 - 锁水保湿</li>
        </ul>
        <h3>使用方法</h3>
        <p>洁面后，取适量轻拍于面部和颈部，早晚使用效果更佳</p>
      </div>
    `,
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 11,
    brandName: '兰蔻',
    stock: 200,
    sale: 3456,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 95,
    productAttributeValueList: [
      { id: 101, value: '50ml', productAttributeId: 7, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 55,
        productId: 55,
        skuCode: 'SKU055',
        price: 1080,
        stock: 100,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '规格', value: '50ml' }
        ])
      }
    ]
  },
  {
    id: 56,
    name: 'SK-II神仙水',
    subTitle: 'PITERA™精华，肌肤新生',
    price: 1699,
    originalPrice: 1890,
    pic: generateImageUrl(56),
    albumPics: [generateImageUrl(56), generateImageUrl(156), generateImageUrl(256)],
    detailTitle: 'SK-II神仙水详细介绍',
    detailDesc: '90%PITERA™精华，改善肌肤质感',
    productCategoryId: 6,
    productCategoryName: '美妆护肤',
    brandId: 25,
    brandName: 'SK-II',
    stock: 150,
    sale: 2340,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 93,
    productAttributeValueList: [
      { id: 102, value: '230ml', productAttributeId: 7, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 56,
        productId: 56,
        skuCode: 'SKU056',
        price: 1699,
        stock: 75,
        lowStock: 15,
        spData: JSON.stringify([
          { key: '规格', value: '230ml' }
        ])
      }
    ]
  },

  // ==================== 食品饮料 ====================
  {
    id: 57,
    name: '茅台酒53度',
    subTitle: '国酒茅台，传承经典',
    price: 2899,
    originalPrice: 3199,
    pic: generateImageUrl(57),
    albumPics: [generateImageUrl(57), generateImageUrl(157), generateImageUrl(257)],
    detailTitle: '茅台酒详细介绍',
    detailDesc: '茅台镇核心产区，古法酿造',
    productCategoryId: 7,
    productCategoryName: '食品饮料',
    brandId: 31,
    brandName: '茅台',
    stock: 100,
    sale: 1260,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 103, value: '500ml', productAttributeId: 7, productAttributeName: '规格' },
      { id: 104, value: '53度', productAttributeId: 8, productAttributeName: '度数' }
    ],
    skuStockList: [
      {
        id: 57,
        productId: 57,
        skuCode: 'SKU057',
        price: 2899,
        stock: 50,
        lowStock: 10,
        spData: JSON.stringify([
          { key: '规格', value: '500ml' },
          { key: '度数', value: '53度' }
        ])
      }
    ]
  },
  {
    id: 58,
    name: '五常大米',
    subTitle: '东北特产，粒粒香甜',
    price: 128,
    originalPrice: 168,
    pic: generateImageUrl(58),
    albumPics: [generateImageUrl(58), generateImageUrl(158), generateImageUrl(258)],
    detailTitle: '五常大米详细介绍',
    detailDesc: '黑龙江五常产区，优质稻花香',
    productCategoryId: 7,
    productCategoryName: '食品饮料',
    brandId: 32,
    brandName: '五常',
    stock: 500,
    sale: 3890,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    sort: 85,
    productAttributeValueList: [
      { id: 105, value: '10kg', productAttributeId: 9, productAttributeName: '重量' }
    ],
    skuStockList: [
      {
        id: 58,
        productId: 58,
        skuCode: 'SKU058',
        price: 128,
        stock: 250,
        lowStock: 50,
        spData: JSON.stringify([
          { key: '重量', value: '10kg' }
        ])
      }
    ]
  },

  // ==================== 母婴用品 ====================
  {
    id: 59,
    name: '好奇纸尿裤',
    subTitle: '超薄透气，12小时干爽',
    price: 199,
    originalPrice: 239,
    pic: generateImageUrl(59),
    albumPics: [generateImageUrl(59), generateImageUrl(159), generateImageUrl(259)],
    detailTitle: '好奇纸尿裤详细介绍',
    detailDesc: '3D环抱腰围，柔软贴合',
    productCategoryId: 8,
    productCategoryName: '母婴用品',
    brandId: 33,
    brandName: '好奇',
    stock: 300,
    sale: 5670,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 106, value: 'L码', productAttributeId: 5, productAttributeName: '尺码' },
      { id: 107, value: '84片', productAttributeId: 10, productAttributeName: '数量' }
    ],
    skuStockList: [
      {
        id: 59,
        productId: 59,
        skuCode: 'SKU059',
        price: 199,
        stock: 150,
        lowStock: 30,
        spData: JSON.stringify([
          { key: '尺码', value: 'L码' },
          { key: '数量', value: '84片' }
        ])
      }
    ]
  },
  {
    id: 60,
    name: '飞鹤奶粉',
    subTitle: '更适合中国宝宝体质',
    price: 368,
    originalPrice: 428,
    pic: generateImageUrl(60),
    albumPics: [generateImageUrl(60), generateImageUrl(160), generateImageUrl(260)],
    detailTitle: '飞鹤奶粉详细介绍',
    detailDesc: '专为中国宝宝研制，营养全面',
    productCategoryId: 8,
    productCategoryName: '母婴用品',
    brandId: 34,
    brandName: '飞鹤',
    stock: 200,
    sale: 2340,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 108, value: '900g', productAttributeId: 9, productAttributeName: '重量' },
      { id: 109, value: '3段', productAttributeId: 11, productAttributeName: '阶段' }
    ],
    skuStockList: [
      {
        id: 60,
        productId: 60,
        skuCode: 'SKU060',
        price: 368,
        stock: 100,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '重量', value: '900g' },
          { key: '阶段', value: '3段' }
        ])
      }
    ]
  },

  // ==================== 运动户外 ====================
  {
    id: 61,
    name: 'Adidas Ultra Boost',
    subTitle: '回弹科技，舒适跑步',
    price: 1399,
    originalPrice: 1599,
    pic: generateImageUrl(61),
    albumPics: [generateImageUrl(61), generateImageUrl(161), generateImageUrl(261)],
    detailTitle: 'Adidas Ultra Boost详细介绍',
    detailDesc: 'Boost中底科技，能量回弹',
    productCategoryId: 9,
    productCategoryName: '运动户外',
    brandId: 10,
    brandName: 'Adidas',
    stock: 80,
    sale: 890,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 110, value: '42', productAttributeId: 6, productAttributeName: '鞋码' },
      { id: 111, value: '黑白配色', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 61,
        productId: 61,
        skuCode: 'SKU061',
        price: 1399,
        stock: 40,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '鞋码', value: '42' },
          { key: '颜色', value: '黑白配色' }
        ])
      }
    ]
  },

  // ==================== 汽车用品 ====================
  {
    id: 62,
    name: '特斯拉车载充电器',
    subTitle: '原厂品质，快速充电',
    price: 1299,
    originalPrice: 1499,
    pic: generateImageUrl(62),
    albumPics: [generateImageUrl(62), generateImageUrl(162), generateImageUrl(262)],
    detailTitle: '特斯拉车载充电器详细介绍',
    detailDesc: '原厂认证，安全可靠的充电解决方案',
    productCategoryId: 10,
    productCategoryName: '汽车用品',
    brandId: 30,
    brandName: 'Tesla',
    stock: 40,
    sale: 156,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    sort: 85,
    productAttributeValueList: [
      { id: 112, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' },
      { id: 113, value: '120W', productAttributeId: 13, productAttributeName: '功率' }
    ],
    skuStockList: [
      {
        id: 62,
        productId: 62,
        skuCode: 'SKU062',
        price: 1299,
        stock: 20,
        lowStock: 4,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' },
          { key: '功率', value: '120W' }
        ])
      }
    ]
  },

  // 家居用品 - 智能家居
  {
    id: 63,
    name: '小米智能门锁Pro',
    subTitle: '指纹+密码+NFC多重解锁，C级锁芯',
    price: 1699,
    originalPrice: 1999,
    pic: generateImageUrl(63),
    albumPics: [generateImageUrl(63), generateImageUrl(163), generateImageUrl(263)],
    detailTitle: '小米智能门锁Pro 详细介绍',
    detailDesc: '多重安全防护，智能便捷生活',
    detailHtml: `
      <div class="product-detail">
        <h3>安全特性</h3>
        <ul>
          <li>C级直插式锁芯 - 防撬防钻防开启</li>
          <li>指纹识别 - 360°全向识别，0.5秒极速解锁</li>
          <li>虚位密码 - 防偷窥设计</li>
          <li>门锁状态监测 - 实时推送异常提醒</li>
        </ul>
        <h3>智能功能</h3>
        <ul>
          <li>米家APP远程管理</li>
          <li>临时密码分享</li>
          <li>开锁记录查看</li>
          <li>低电量提醒</li>
        </ul>
      </div>
    `,
    productCategoryId: 8,
    productCategoryName: '智能家居',
    brandId: 3,
    brandName: '小米',
    stock: 45,
    sale: 280,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 95,
    productAttributeValueList: [
      { id: 114, value: '黑色', productAttributeId: 2, productAttributeName: '颜色' },
      { id: 115, value: 'C级', productAttributeId: 14, productAttributeName: '锁芯等级' }
    ],
    skuStockList: [
      {
        id: 63,
        productId: 63,
        skuCode: 'SKU063',
        price: 1699,
        stock: 45,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '颜色', value: '黑色' },
          { key: '锁芯等级', value: 'C级' }
        ])
      }
    ]
  },

  // 服装鞋帽 - 运动鞋
  {
    id: 64,
    name: 'Nike Air Max 270',
    subTitle: '气垫缓震，透气舒适，时尚百搭',
    price: 899,
    originalPrice: 1199,
    pic: generateImageUrl(64),
    albumPics: [generateImageUrl(64), generateImageUrl(164), generateImageUrl(264)],
    detailTitle: 'Nike Air Max 270 详细介绍',
    detailDesc: 'Max Air 气垫单元，全天候舒适体验',
    detailHtml: `
      <div class="product-detail">
        <h3>设计特色</h3>
        <ul>
          <li>Max Air 气垫单元 - 提供卓越缓震效果</li>
          <li>轻质网眼鞋面 - 透气性佳，脚感舒适</li>
          <li>橡胶外底 - 耐磨防滑，抓地力强</li>
          <li>经典配色 - 时尚百搭，适合日常穿着</li>
        </ul>
        <h3>适用场景</h3>
        <ul>
          <li>日常休闲</li>
          <li>轻量运动</li>
          <li>街头搭配</li>
          <li>旅行出行</li>
        </ul>
      </div>
    `,
    productCategoryId: 9,
    productCategoryName: '运动鞋',
    brandId: 8,
    brandName: 'Nike',
    stock: 120,
    sale: 580,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 88,
    productAttributeValueList: [
      { id: 116, value: '42', productAttributeId: 15, productAttributeName: '尺码' },
      { id: 117, value: '白黑', productAttributeId: 2, productAttributeName: '颜色' }
    ],
    skuStockList: [
      {
        id: 64,
        productId: 64,
        skuCode: 'SKU064',
        price: 899,
        stock: 30,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '尺码', value: '42' },
          { key: '颜色', value: '白黑' }
        ])
      },
      {
        id: 65,
        productId: 64,
        skuCode: 'SKU065',
        price: 899,
        stock: 25,
        lowStock: 5,
        spData: JSON.stringify([
          { key: '尺码', value: '43' },
          { key: '颜色', value: '白黑' }
        ])
      }
    ]
  },

  // 母婴用品
  {
    id: 65,
    name: '飞鹤星飞帆婴幼儿奶粉',
    subTitle: '3段800g，适合12-36个月宝宝',
    price: 328,
    originalPrice: 398,
    pic: generateImageUrl(65),
    albumPics: [generateImageUrl(65), generateImageUrl(165), generateImageUrl(265)],
    detailTitle: '飞鹤星飞帆婴幼儿奶粉 详细介绍',
    detailDesc: '更适合中国宝宝体质的奶粉',
    detailHtml: `
      <div class="product-detail">
        <h3>营养配方</h3>
        <ul>
          <li>OPO结构脂 - 更好吸收，减少便秘</li>
          <li>水解蛋白 - 易消化，降低过敏风险</li>
          <li>益生元组合 - 促进肠道健康</li>
          <li>DHA+ARA - 支持大脑和视力发育</li>
        </ul>
        <h3>适用人群</h3>
        <p>12-36个月幼儿</p>
        <h3>冲调方法</h3>
        <p>40°C温开水，先加水后加粉，1平勺奶粉（约4.6g）配30ml水</p>
      </div>
    `,
    productCategoryId: 10,
    productCategoryName: '母婴用品',
    brandId: 9,
    brandName: '飞鹤',
    stock: 200,
    sale: 1200,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 92,
    productAttributeValueList: [
      { id: 118, value: '3段', productAttributeId: 16, productAttributeName: '适用年龄' },
      { id: 119, value: '800g', productAttributeId: 17, productAttributeName: '规格' }
    ],
    skuStockList: [
      {
        id: 66,
        productId: 65,
        skuCode: 'SKU066',
        price: 328,
        stock: 200,
        lowStock: 20,
        spData: JSON.stringify([
          { key: '适用年龄', value: '3段' },
          { key: '规格', value: '800g' }
        ])
      }
    ]
  },

  // 图书音像
  {
    id: 66,
    name: '《活着》余华著',
    subTitle: '茅盾文学奖获奖作品，当代文学经典',
    price: 29.8,
    originalPrice: 39.8,
    pic: generateImageUrl(66),
    albumPics: [generateImageUrl(66), generateImageUrl(166), generateImageUrl(266)],
    detailTitle: '《活着》余华著 详细介绍',
    detailDesc: '一部感人至深的当代文学经典',
    detailHtml: `
      <div class="product-detail">
        <h3>作品简介</h3>
        <p>《活着》是作家余华的代表作之一，讲述了在大时代背景下，随着内战、三年自然灾害、文化大革命等社会变革，徐福贵的人生和家庭不断经受着苦难，到了最后所有亲人都先后离他而去，仅剩下他和一头老牛相依为命。</p>
        <h3>作者介绍</h3>
        <p>余华，1960年4月3日生于浙江杭州，当代作家。中国作家协会委员会委员。代表作有《活着》《许三观卖血记》《兄弟》等。</p>
        <h3>获奖情况</h3>
        <ul>
          <li>意大利格林扎纳·卡佛文学奖</li>
          <li>法国文学和艺术骑士勋章</li>
          <li>中华图书特殊贡献奖</li>
        </ul>
      </div>
    `,
    productCategoryId: 11,
    productCategoryName: '图书音像',
    brandId: 10,
    brandName: '南海出版公司',
    stock: 500,
    sale: 3500,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 90,
    productAttributeValueList: [
      { id: 120, value: '平装', productAttributeId: 18, productAttributeName: '装帧' },
      { id: 121, value: '191页', productAttributeId: 19, productAttributeName: '页数' }
    ],
    skuStockList: [
      {
        id: 67,
        productId: 66,
        skuCode: 'SKU067',
        price: 29.8,
        stock: 500,
        lowStock: 50,
        spData: JSON.stringify([
          { key: '装帧', value: '平装' },
          { key: '页数', value: '191页' }
        ])
      }
    ]
  },

  // 汽车用品
  {
    id: 67,
    name: '70迈行车记录仪A800',
    subTitle: '4K超清录制，内置GPS，停车监控',
    price: 599,
    originalPrice: 799,
    pic: generateImageUrl(67),
    albumPics: [generateImageUrl(67), generateImageUrl(167), generateImageUrl(267)],
    detailTitle: '70迈行车记录仪A800 详细介绍',
    detailDesc: '专业级行车安全守护',
    detailHtml: `
      <div class="product-detail">
        <h3>核心功能</h3>
        <ul>
          <li>4K超清录制 - 3840×2160分辨率</li>
          <li>内置GPS - 记录行车轨迹和速度</li>
          <li>停车监控 - 24小时守护爱车</li>
          <li>语音控制 - 解放双手，专注驾驶</li>
          <li>Wi-Fi连接 - 手机APP查看回放</li>
        </ul>
        <h3>技术规格</h3>
        <table>
          <tr><td>镜头</td><td>Sony IMX415传感器</td></tr>
          <tr><td>视角</td><td>150°超大广角</td></tr>
          <tr><td>存储</td><td>支持最大128GB TF卡</td></tr>
          <tr><td>电源</td><td>5V/2A，支持降压线</td></tr>
        </table>
      </div>
    `,
    productCategoryId: 12,
    productCategoryName: '汽车用品',
    brandId: 11,
    brandName: '70迈',
    stock: 80,
    sale: 420,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    sort: 87,
    productAttributeValueList: [
      { id: 122, value: '4K', productAttributeId: 20, productAttributeName: '分辨率' },
      { id: 123, value: '内置GPS', productAttributeId: 21, productAttributeName: '特殊功能' }
    ],
    skuStockList: [
      {
        id: 68,
        productId: 67,
        skuCode: 'SKU068',
        price: 599,
        stock: 80,
        lowStock: 8,
        spData: JSON.stringify([
          { key: '分辨率', value: '4K' },
          { key: '特殊功能', value: '内置GPS' }
        ])
      }
    ]
  },

  // 医药健康
  {
    id: 68,
    name: '鱼跃血压计YE680CR',
    subTitle: '医用级精准测量，大屏显示，语音播报',
    price: 269,
    originalPrice: 359,
    pic: generateImageUrl(68),
    albumPics: [generateImageUrl(68), generateImageUrl(168), generateImageUrl(268)],
    detailTitle: '鱼跃血压计YE680CR 详细介绍',
    detailDesc: '家庭健康监测的可靠选择',
    detailHtml: `
      <div class="product-detail">
        <h3>产品特点</h3>
        <ul>
          <li>医用级精准 - 符合国际标准ESH、BHS、AAMI</li>
          <li>大屏显示 - 3.5英寸高清液晶屏</li>
          <li>语音播报 - 真人发声，老人易用</li>
          <li>智能加压 - 自动识别血压范围</li>
          <li>数据存储 - 可存储99组测量数据</li>
        </ul>
        <h3>适用人群</h3>
        <ul>
          <li>高血压患者日常监测</li>
          <li>中老年人健康管理</li>
          <li>医疗机构辅助设备</li>
        </ul>
        <h3>注意事项</h3>
        <p>请在安静环境下测量，测量前休息5分钟，避免在运动后立即测量。</p>
      </div>
    `,
    productCategoryId: 13,
    productCategoryName: '医药健康',
    brandId: 12,
    brandName: '鱼跃',
    stock: 150,
    sale: 680,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 1,
    sort: 89,
    productAttributeValueList: [
      { id: 124, value: '上臂式', productAttributeId: 22, productAttributeName: '测量方式' },
      { id: 125, value: '语音播报', productAttributeId: 23, productAttributeName: '特色功能' }
    ],
    skuStockList: [
      {
        id: 69,
        productId: 68,
        skuCode: 'SKU069',
        price: 269,
        stock: 150,
        lowStock: 15,
        spData: JSON.stringify([
          { key: '测量方式', value: '上臂式' },
          { key: '特色功能', value: '语音播报' }
        ])
      }
    ]
  }
]

// 模拟商品分类数据
const mockCategories = [
  { id: 1, name: '手机通讯', parentId: 0, level: 0, showStatus: 1, sort: 100, icon: generateImageUrl(301) },
  { id: 2, name: '电脑办公', parentId: 0, level: 0, showStatus: 1, sort: 95, icon: generateImageUrl(302) },
  { id: 3, name: '数码配件', parentId: 0, level: 0, showStatus: 1, sort: 90, icon: generateImageUrl(303) },
  { id: 4, name: '家用电器', parentId: 0, level: 0, showStatus: 1, sort: 85, icon: generateImageUrl(304) },
  { id: 5, name: '服饰鞋帽', parentId: 0, level: 0, showStatus: 1, sort: 80, icon: generateImageUrl(305) },
  { id: 6, name: '美妆护肤', parentId: 0, level: 0, showStatus: 1, sort: 75, icon: generateImageUrl(306) },
  { id: 7, name: '食品饮料', parentId: 0, level: 0, showStatus: 1, sort: 70, icon: generateImageUrl(307) },
  { id: 8, name: '智能家居', parentId: 0, level: 0, showStatus: 1, sort: 65, icon: generateImageUrl(308) },
  { id: 9, name: '运动户外', parentId: 0, level: 0, showStatus: 1, sort: 60, icon: generateImageUrl(309) },
  { id: 10, name: '母婴用品', parentId: 0, level: 0, showStatus: 1, sort: 55, icon: generateImageUrl(310) },
  { id: 11, name: '图书音像', parentId: 0, level: 0, showStatus: 1, sort: 50, icon: generateImageUrl(311) },
  { id: 12, name: '汽车用品', parentId: 0, level: 0, showStatus: 1, sort: 45, icon: generateImageUrl(312) },
  { id: 13, name: '医药健康', parentId: 0, level: 0, showStatus: 1, sort: 40, icon: generateImageUrl(313) },

  // 二级分类
  { id: 101, name: '智能手机', parentId: 1, level: 1, showStatus: 1, sort: 100 },
  { id: 102, name: '手机配件', parentId: 1, level: 1, showStatus: 1, sort: 95 },
  { id: 103, name: '对讲机', parentId: 1, level: 1, showStatus: 1, sort: 90 },

  { id: 201, name: '笔记本电脑', parentId: 2, level: 1, showStatus: 1, sort: 100 },
  { id: 202, name: '台式机', parentId: 2, level: 1, showStatus: 1, sort: 95 },
  { id: 203, name: '平板电脑', parentId: 2, level: 1, showStatus: 1, sort: 90 },
  { id: 204, name: '打印机', parentId: 2, level: 1, showStatus: 1, sort: 85 },

  { id: 301, name: '耳机音箱', parentId: 3, level: 1, showStatus: 1, sort: 100 },
  { id: 302, name: '数据线', parentId: 3, level: 1, showStatus: 1, sort: 95 },
  { id: 303, name: '充电器', parentId: 3, level: 1, showStatus: 1, sort: 90 },
  { id: 304, name: '移动电源', parentId: 3, level: 1, showStatus: 1, sort: 85 },

  { id: 401, name: '大家电', parentId: 4, level: 1, showStatus: 1, sort: 100 },
  { id: 402, name: '小家电', parentId: 4, level: 1, showStatus: 1, sort: 95 },
  { id: 403, name: '厨房电器', parentId: 4, level: 1, showStatus: 1, sort: 90 },

  { id: 501, name: '男装', parentId: 5, level: 1, showStatus: 1, sort: 100 },
  { id: 502, name: '女装', parentId: 5, level: 1, showStatus: 1, sort: 95 },
  { id: 503, name: '鞋靴', parentId: 5, level: 1, showStatus: 1, sort: 90 },
  { id: 504, name: '箱包', parentId: 5, level: 1, showStatus: 1, sort: 85 },

  { id: 601, name: '面部护肤', parentId: 6, level: 1, showStatus: 1, sort: 100 },
  { id: 602, name: '彩妆', parentId: 6, level: 1, showStatus: 1, sort: 95 },
  { id: 603, name: '香水', parentId: 6, level: 1, showStatus: 1, sort: 90 },

  { id: 701, name: '酒类', parentId: 7, level: 1, showStatus: 1, sort: 100 },
  { id: 702, name: '茶叶', parentId: 7, level: 1, showStatus: 1, sort: 95 },
  { id: 703, name: '粮油米面', parentId: 7, level: 1, showStatus: 1, sort: 90 },
  { id: 704, name: '零食', parentId: 7, level: 1, showStatus: 1, sort: 85 },

  { id: 801, name: '智能锁', parentId: 8, level: 1, showStatus: 1, sort: 100 },
  { id: 802, name: '智能音箱', parentId: 8, level: 1, showStatus: 1, sort: 95 },
  { id: 803, name: '智能插座', parentId: 8, level: 1, showStatus: 1, sort: 90 },

  { id: 901, name: '运动鞋', parentId: 9, level: 1, showStatus: 1, sort: 100 },
  { id: 902, name: '健身器材', parentId: 9, level: 1, showStatus: 1, sort: 95 },
  { id: 903, name: '户外装备', parentId: 9, level: 1, showStatus: 1, sort: 90 },

  { id: 1001, name: '奶粉', parentId: 10, level: 1, showStatus: 1, sort: 100 },
  { id: 1002, name: '纸尿裤', parentId: 10, level: 1, showStatus: 1, sort: 95 },
  { id: 1003, name: '玩具', parentId: 10, level: 1, showStatus: 1, sort: 90 },

  { id: 1101, name: '文学小说', parentId: 11, level: 1, showStatus: 1, sort: 100 },
  { id: 1102, name: '教育学习', parentId: 11, level: 1, showStatus: 1, sort: 95 },
  { id: 1103, name: '音像制品', parentId: 11, level: 1, showStatus: 1, sort: 90 },

  { id: 1201, name: '行车记录仪', parentId: 12, level: 1, showStatus: 1, sort: 100 },
  { id: 1202, name: '车载电器', parentId: 12, level: 1, showStatus: 1, sort: 95 },
  { id: 1203, name: '汽车美容', parentId: 12, level: 1, showStatus: 1, sort: 90 },

  { id: 1301, name: '血压计', parentId: 13, level: 1, showStatus: 1, sort: 100 },
  { id: 1302, name: '血糖仪', parentId: 13, level: 1, showStatus: 1, sort: 95 },
  { id: 1303, name: '保健品', parentId: 13, level: 1, showStatus: 1, sort: 90 }
]

// 模拟品牌数据
const mockBrands = [
  { id: 1, name: 'Apple', firstLetter: 'A', logo: generateImageUrl(401), showStatus: 1, productCount: 5, brandStory: '专注于创新和设计的科技公司' },
  { id: 2, name: '小米', firstLetter: 'X', logo: generateImageUrl(402), showStatus: 1, productCount: 4, brandStory: '为发烧而生的互联网品牌' },
  { id: 3, name: 'OPPO', firstLetter: 'O', logo: generateImageUrl(403), showStatus: 1, productCount: 1, brandStory: '专注于拍照的智能手机品牌' },
  { id: 4, name: 'vivo', firstLetter: 'V', logo: generateImageUrl(404), showStatus: 1, productCount: 1, brandStory: '音乐手机的引领者' },
  { id: 5, name: '联想', firstLetter: 'L', logo: generateImageUrl(405), showStatus: 1, productCount: 1, brandStory: '全球领先的PC制造商' },
  { id: 6, name: '华为', firstLetter: 'H', logo: generateImageUrl(406), showStatus: 1, productCount: 2, brandStory: '全球领先的信息与通信技术解决方案供应商' },
  { id: 7, name: 'Sony', firstLetter: 'S', logo: generateImageUrl(407), showStatus: 1, productCount: 2, brandStory: '索尼株式会社，全球知名的大型综合性跨国企业集团' },
  { id: 8, name: '海尔', firstLetter: 'H', logo: generateImageUrl(408), showStatus: 1, productCount: 1, brandStory: '全球大型家电第一品牌' },
  { id: 9, name: 'Nike', firstLetter: 'N', logo: generateImageUrl(409), showStatus: 1, productCount: 2, brandStory: '全球著名的体育运动品牌' },
  { id: 10, name: 'Adidas', firstLetter: 'A', logo: generateImageUrl(410), showStatus: 1, productCount: 2, brandStory: '德国运动用品制造商' },
  { id: 11, name: '兰蔻', firstLetter: 'L', logo: generateImageUrl(411), showStatus: 1, productCount: 2, brandStory: '来自法国的世界知名美妆品牌' },
  { id: 12, name: '雅诗兰黛', firstLetter: 'Y', logo: generateImageUrl(412), showStatus: 1, productCount: 2, brandStory: '美国雅诗兰黛公司旗下的化妆品旗舰品牌' },
  { id: 13, name: '三星', firstLetter: 'S', logo: generateImageUrl(413), showStatus: 1, productCount: 1, brandStory: '韩国最大的跨国企业集团' },
  { id: 14, name: '一加', firstLetter: 'Y', logo: generateImageUrl(414), showStatus: 1, productCount: 1, brandStory: '专注于旗舰体验的手机品牌' },
  { id: 15, name: 'Nothing', firstLetter: 'N', logo: generateImageUrl(415), showStatus: 1, productCount: 1, brandStory: '透明设计美学的创新者' },
  { id: 16, name: '戴尔', firstLetter: 'D', logo: generateImageUrl(416), showStatus: 1, productCount: 1, brandStory: '全球知名的电脑技术公司' },
  { id: 17, name: '微软', firstLetter: 'W', logo: generateImageUrl(417), showStatus: 1, productCount: 1, brandStory: '全球最大的电脑软件提供商' },
  { id: 18, name: '华硕', firstLetter: 'H', logo: generateImageUrl(418), showStatus: 1, productCount: 1, brandStory: '全球领先的3C解决方案提供商' },
  { id: 19, name: 'Anker', firstLetter: 'A', logo: generateImageUrl(419), showStatus: 1, productCount: 1, brandStory: '专业充电设备制造商' },
  { id: 20, name: '戴森', firstLetter: 'D', logo: generateImageUrl(420), showStatus: 1, productCount: 1, brandStory: '英国创新科技公司' },
  { id: 21, name: '九阳', firstLetter: 'J', logo: generateImageUrl(421), showStatus: 1, productCount: 1, brandStory: '豆浆机行业领导者' },
  { id: 22, name: '美的', firstLetter: 'M', logo: generateImageUrl(422), showStatus: 1, productCount: 1, brandStory: '中国家电行业领军企业' },
  { id: 23, name: '优衣库', firstLetter: 'Y', logo: generateImageUrl(423), showStatus: 1, productCount: 1, brandStory: '日本休闲服装品牌' },
  { id: 24, name: 'Zara', firstLetter: 'Z', logo: generateImageUrl(424), showStatus: 1, productCount: 1, brandStory: '西班牙快时尚品牌' },
  { id: 25, name: 'SK-II', firstLetter: 'S', logo: generateImageUrl(425), showStatus: 1, productCount: 1, brandStory: '日本高端护肤品牌' },
  { id: 26, name: '薇诺娜', firstLetter: 'W', logo: generateImageUrl(426), showStatus: 1, productCount: 1, brandStory: '敏感肌专业护肤品牌' },
  { id: 27, name: 'Amazon', firstLetter: 'A', logo: generateImageUrl(427), showStatus: 1, productCount: 1, brandStory: '全球最大的电子商务公司' },
  { id: 28, name: 'GoPro', firstLetter: 'G', logo: generateImageUrl(428), showStatus: 1, productCount: 1, brandStory: '运动相机领导品牌' },
  { id: 29, name: '任天堂', firstLetter: 'R', logo: generateImageUrl(429), showStatus: 1, productCount: 1, brandStory: '日本著名游戏公司' },
  { id: 30, name: 'Tesla', firstLetter: 'T', logo: generateImageUrl(430), showStatus: 1, productCount: 2, brandStory: '电动汽车和清洁能源公司' },
  { id: 31, name: '茅台', firstLetter: 'M', logo: generateImageUrl(431), showStatus: 1, productCount: 1, brandStory: '中国国酒，享誉世界' },
  { id: 32, name: '五常', firstLetter: 'W', logo: generateImageUrl(432), showStatus: 1, productCount: 1, brandStory: '东北优质大米产区' },
  { id: 33, name: '好奇', firstLetter: 'H', logo: generateImageUrl(433), showStatus: 1, productCount: 1, brandStory: '专业婴幼儿护理品牌' },
  { id: 34, name: '飞鹤', firstLetter: 'F', logo: generateImageUrl(434), showStatus: 1, productCount: 1, brandStory: '中国婴幼儿奶粉知名品牌' },
  { id: 35, name: 'Burberry', firstLetter: 'B', logo: generateImageUrl(435), showStatus: 1, productCount: 1, brandStory: '英国奢侈时装品牌' },
  { id: 36, name: 'Coach', firstLetter: 'C', logo: generateImageUrl(436), showStatus: 1, productCount: 1, brandStory: '美国奢华手袋品牌' },
  { id: 37, name: 'Hermès', firstLetter: 'H', logo: generateImageUrl(437), showStatus: 1, productCount: 1, brandStory: '法国奢侈品品牌' },
  { id: 38, name: 'LV', firstLetter: 'L', logo: generateImageUrl(438), showStatus: 1, productCount: 1, brandStory: '法国奢侈品牌路易威登' },
  { id: 39, name: 'Gucci', firstLetter: 'G', logo: generateImageUrl(439), showStatus: 1, productCount: 1, brandStory: '意大利奢侈时装品牌' },
  { id: 40, name: 'Prada', firstLetter: 'P', logo: generateImageUrl(440), showStatus: 1, productCount: 1, brandStory: '意大利奢侈品牌' },
  { id: 41, name: '飞鹤', firstLetter: 'F', logo: generateImageUrl(441), showStatus: 1, productCount: 1, brandStory: '更适合中国宝宝体质的奶粉' },
  { id: 42, name: '南海出版公司', firstLetter: 'N', logo: generateImageUrl(442), showStatus: 1, productCount: 1, brandStory: '专业图书出版社' },
  { id: 43, name: '70迈', firstLetter: 'Q', logo: generateImageUrl(443), showStatus: 1, productCount: 1, brandStory: '专业车载智能设备品牌' },
  { id: 44, name: '鱼跃', firstLetter: 'Y', logo: generateImageUrl(444), showStatus: 1, productCount: 1, brandStory: '专业医疗器械制造商' }
]

// 模拟购物车数据
interface CartItem {
  id: number
  productId: number
  productSkuId: number
  memberId: number
  memberUsername: string
  quantity: number
  price: number
  productPic: string
  productName: string
  productSubTitle: string
  productSkuCode: string
  productAttr: string
  productBrand: string
  productSn: string
  productCategoryId: number
  promotionMessage: string
  reduceAmount: number
  realStock: number
  integrationAmount: number
  growthAmount: number
  createDate: string
  modifyDate: string
  deleteStatus: number
}

interface OrderItem extends CartItem {
  orderId: number
  orderSn: string
  productQuantity: number
  productPrice: number
  promotionName: string
  promotionAmount: number
  couponAmount: number
  realAmount: number
  giftIntegration: number
  giftGrowth: number
}

interface Order {
  id: number
  memberId: number
  orderSn: string
  couponId?: number
  memberUsername: string
  totalAmount: number
  payAmount: number
  freightAmount: number
  promotionAmount: number
  integrationAmount: number
  couponAmount: number
  discountAmount: number
  payType: number
  sourceType: number
  status: number
  orderType: number
  deliveryCompany: string
  deliverySn: string
  autoConfirmDay: number
  integration: number
  growth: number
  promotionInfo: string
  billType: number
  billHeader: string
  billContent: string
  billReceiverPhone: string
  billReceiverEmail: string
  receiverName: string
  receiverPhone: string
  receiverPostCode: string
  receiverProvince: string
  receiverCity: string
  receiverRegion: string
  receiverDetailAddress: string
  note: string
  confirmStatus: number
  deleteStatus: number
  useIntegration: number
  paymentTime: string | null
  deliveryTime: string | null
  receiveTime: string | null
  commentTime: string | null
  createTime: string
  modifyTime: string
  orderItemList: OrderItem[]
}

interface Address {
  id: number
  memberId: number
  name: string
  phoneNumber: string
  province: string
  city: string
  region: string
  detailAddress: string
  postCode?: string
  defaultStatus: number
}

let mockCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    productSkuId: 1,
    memberId: 1,
    memberUsername: 'testuser',
    quantity: 2,
    price: 9999,
    productPic: generateImageUrl(1),
    productName: 'iPhone 15 Pro Max',
    productSubTitle: '专业级影像系统，钛金属设计',
    productSkuCode: 'SKU001',
    productAttr: '存储容量:256GB;颜色:钛原色',
    productBrand: 'Apple',
    productSn: 'SN1',
    productCategoryId: 1,
    promotionMessage: '',
    reduceAmount: 0,
    realStock: 100,
    integrationAmount: 0,
    growthAmount: 0,
    createDate: '2024-01-01T00:00:00',
    modifyDate: '2024-01-01T00:00:00',
    deleteStatus: 0
  },
  {
    id: 2,
    productId: 2,
    productSkuId: 4,
    memberId: 1,
    memberUsername: 'testuser',
    quantity: 1,
    price: 6499,
    productPic: generateImageUrl(2),
    productName: '小米14 Ultra',
    productSubTitle: '徕卡专业光学镜头，骁龙8 Gen3',
    productSkuCode: 'SKU002',
    productAttr: '存储容量:512GB;颜色:黑色',
    productBrand: '小米',
    productSn: 'SN2',
    productCategoryId: 1,
    promotionMessage: '',
    reduceAmount: 0,
    realStock: 150,
    integrationAmount: 0,
    growthAmount: 0,
    createDate: '2024-01-01T00:00:00',
    modifyDate: '2024-01-01T00:00:00',
    deleteStatus: 0
  }
]

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1,
    memberId: 1,
    orderSn: 'ORDER20250109001',
    couponId: undefined,
    memberUsername: 'testuser',
    totalAmount: 9999,
    payAmount: 9999,
    freightAmount: 0,
    promotionAmount: 0,
    integrationAmount: 0,
    couponAmount: 0,
    discountAmount: 0,
    payType: 1,
    sourceType: 1,
    status: 0, // 待付款
    orderType: 0,
    deliveryCompany: '',
    deliverySn: '',
    autoConfirmDay: 15,
    integration: 0,
    growth: 0,
    promotionInfo: '',
    billType: 0,
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '张三',
    receiverPhone: '18888888888',
    receiverPostCode: '',
    receiverProvince: '湖南省',
    receiverCity: '长沙市',
    receiverRegion: '岳麓区',
    receiverDetailAddress: '中南大学新校区',
    note: '测试订单',
    confirmStatus: 0,
    deleteStatus: 0,
    useIntegration: 0,
    paymentTime: null,
    deliveryTime: null,
    receiveTime: null,
    commentTime: null,
    createTime: '2025-01-09 10:00:00',
    modifyTime: '2025-01-09 10:00:00',
    orderItemList: [
      {
        // CartItem 属性
        id: 1,
        productId: 1,
        productSkuId: 1,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: 1,
        price: 9999,
        productPic: generateImageUrl(1),
        productName: 'iPhone 15 Pro Max',
        productSubTitle: '专业级影像系统，钛金属设计',
        productSkuCode: 'IP15PM001_256G',
        productAttr: '[{"key":"容量","value":"256GB"},{"key":"颜色","value":"原色钛金属"}]',
        productBrand: 'Apple',
        productSn: 'IP15PM001',
        productCategoryId: 1,
        promotionMessage: '',
        reduceAmount: 0,
        realStock: 100,
        integrationAmount: 0,
        growthAmount: 0,
        createDate: '2025-01-09 10:00:00',
        modifyDate: '2025-01-09 10:00:00',
        deleteStatus: 0,
        // OrderItem 特有属性
        orderId: 1,
        orderSn: 'ORDER20250109001',
        productQuantity: 1,
        productPrice: 9999,
        promotionName: '',
        promotionAmount: 0,
        couponAmount: 0,
        realAmount: 9999,
        giftIntegration: 0,
        giftGrowth: 0
      }
    ]
  },
  {
    id: 2,
    memberId: 1,
    orderSn: 'ORDER20250108001',
    couponId: undefined,
    memberUsername: 'testuser',
    totalAmount: 5499,
    payAmount: 5499,
    freightAmount: 0,
    promotionAmount: 0,
    integrationAmount: 0,
    couponAmount: 0,
    discountAmount: 0,
    payType: 1,
    sourceType: 1,
    status: 1, // 待发货
    orderType: 0,
    deliveryCompany: '',
    deliverySn: '',
    autoConfirmDay: 15,
    integration: 0,
    growth: 0,
    promotionInfo: '',
    billType: 0,
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '张三',
    receiverPhone: '18888888888',
    receiverPostCode: '',
    receiverProvince: '湖南省',
    receiverCity: '长沙市',
    receiverRegion: '岳麓区',
    receiverDetailAddress: '中南大学新校区',
    note: '',
    confirmStatus: 0,
    deleteStatus: 0,
    useIntegration: 0,
    paymentTime: '2025-01-08 10:30:00',
    deliveryTime: null,
    receiveTime: null,
    commentTime: null,
    createTime: '2025-01-08 10:00:00',
    modifyTime: '2025-01-08 10:30:00',
    orderItemList: [
      {
        // CartItem 属性
        id: 2,
        productId: 2,
        productSkuId: 2,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: 1,
        price: 5499,
        productPic: generateImageUrl(2),
        productName: '小米14 Ultra',
        productSubTitle: '徕卡专业光学镜头，限量发售',
        productSkuCode: 'MI14U001_512G',
        productAttr: '[{"key":"容量","value":"512GB"},{"key":"颜色","value":"钛金属黑"}]',
        productBrand: '小米',
        productSn: 'MI14U001',
        productCategoryId: 1,
        promotionMessage: '',
        reduceAmount: 0,
        realStock: 50,
        integrationAmount: 0,
        growthAmount: 0,
        createDate: '2025-01-08 10:00:00',
        modifyDate: '2025-01-08 10:00:00',
        deleteStatus: 0,
        // OrderItem 特有属性
        orderId: 2,
        orderSn: 'ORDER20250108001',
        productQuantity: 1,
        productPrice: 5499,
        promotionName: '',
        promotionAmount: 0,
        couponAmount: 0,
        realAmount: 5499,
        giftIntegration: 0,
        giftGrowth: 0
      }
    ]
  },
  // 新增订单3 - 已发货状态
  {
    id: 3,
    memberId: 1,
    orderSn: 'ORDER20250107001',
    couponId: undefined,
    memberUsername: 'testuser',
    totalAmount: 12998,
    payAmount: 12998,
    freightAmount: 15,
    promotionAmount: 0,
    integrationAmount: 0,
    couponAmount: 0,
    discountAmount: 0,
    payType: 1,
    sourceType: 1,
    status: 2, // 已发货
    orderType: 0,
    deliveryCompany: '顺丰速运',
    deliverySn: 'SF1234567890123',
    autoConfirmDay: 15,
    integration: 0,
    growth: 0,
    promotionInfo: '',
    billType: 0,
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '张三',
    receiverPhone: '18888888888',
    receiverPostCode: '410083',
    receiverProvince: '湖南省',
    receiverCity: '长沙市',
    receiverRegion: '岳麓区',
    receiverDetailAddress: '中南大学新校区学生宿舍',
    note: '商品已发货，请注意查收',
    confirmStatus: 0,
    deleteStatus: 0,
    useIntegration: 0,
    paymentTime: '2025-01-07 09:15:00',
    deliveryTime: '2025-01-07 16:30:00',
    receiveTime: null,
    commentTime: null,
    createTime: '2025-01-07 09:00:00',
    modifyTime: '2025-01-07 16:30:00',
    orderItemList: [
      {
        id: 3,
        productId: 5,
        productSkuId: 5,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: 1,
        price: 12998,
        productPic: generateImageUrl(5),
        productName: 'MacBook Pro 14英寸',
        productSubTitle: 'M3 Pro芯片，专业创作者首选',
        productSkuCode: 'MBP14_M3P_512G',
        productAttr: '[{"key":"处理器","value":"M3 Pro"},{"key":"内存","value":"18GB"},{"key":"存储","value":"512GB"}]',
        productBrand: 'Apple',
        productSn: 'MBP14M3P001',
        productCategoryId: 2,
        promotionMessage: '',
        reduceAmount: 0,
        realStock: 25,
        integrationAmount: 0,
        growthAmount: 0,
        createDate: '2025-01-07 09:00:00',
        modifyDate: '2025-01-07 09:00:00',
        deleteStatus: 0,
        orderId: 3,
        orderSn: 'ORDER20250107001',
        productQuantity: 1,
        productPrice: 12998,
        promotionName: '',
        promotionAmount: 0,
        couponAmount: 0,
        realAmount: 12998,
        giftIntegration: 130,
        giftGrowth: 65
      }
    ]
  },
  // 新增订单4 - 已完成状态
  {
    id: 4,
    memberId: 1,
    orderSn: 'ORDER20250106001',
    couponId: undefined,
    memberUsername: 'testuser',
    totalAmount: 3548,
    payAmount: 3298,
    freightAmount: 0,
    promotionAmount: 200,
    integrationAmount: 50,
    couponAmount: 100,
    discountAmount: 0,
    payType: 2,
    sourceType: 1,
    status: 3, // 已完成
    orderType: 0,
    deliveryCompany: '中通快递',
    deliverySn: 'ZTO9876543210987',
    autoConfirmDay: 15,
    integration: 50,
    growth: 30,
    promotionInfo: '满减活动：满3000减200',
    billType: 0,
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '张三',
    receiverPhone: '18888888888',
    receiverPostCode: '410083',
    receiverProvince: '湖南省',
    receiverCity: '长沙市',
    receiverRegion: '岳麓区',
    receiverDetailAddress: '中南大学新校区',
    note: '交易完成，感谢您的购买',
    confirmStatus: 1,
    deleteStatus: 0,
    useIntegration: 50,
    paymentTime: '2025-01-06 11:20:00',
    deliveryTime: '2025-01-06 15:45:00',
    receiveTime: '2025-01-08 10:30:00',
    commentTime: '2025-01-08 11:00:00',
    createTime: '2025-01-06 11:00:00',
    modifyTime: '2025-01-08 11:00:00',
    orderItemList: [
      {
        id: 4,
        productId: 8,
        productSkuId: 8,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: 1,
        price: 3548,
        productPic: generateImageUrl(8),
        productName: 'AirPods Pro 2代',
        productSubTitle: '主动降噪，空间音频',
        productSkuCode: 'APP2_001',
        productAttr: '[{"key":"颜色","value":"白色"},{"key":"类型","value":"无线蓝牙"}]',
        productBrand: 'Apple',
        productSn: 'APP2001',
        productCategoryId: 3,
        promotionMessage: '满减200元',
        reduceAmount: 200,
        realStock: 200,
        integrationAmount: 50,
        growthAmount: 30,
        createDate: '2025-01-06 11:00:00',
        modifyDate: '2025-01-06 11:00:00',
        deleteStatus: 0,
        orderId: 4,
        orderSn: 'ORDER20250106001',
        productQuantity: 1,
        productPrice: 3548,
        promotionName: '满减活动',
        promotionAmount: 200,
        couponAmount: 100,
        realAmount: 3298,
        giftIntegration: 33,
        giftGrowth: 16
      }
    ]
  },
  // 新增订单5 - 已关闭状态
  {
    id: 5,
    memberId: 1,
    orderSn: 'ORDER20250105001',
    couponId: undefined,
    memberUsername: 'testuser',
    totalAmount: 899,
    payAmount: 899,
    freightAmount: 10,
    promotionAmount: 0,
    integrationAmount: 0,
    couponAmount: 0,
    discountAmount: 0,
    payType: 1,
    sourceType: 1,
    status: 4, // 已关闭
    orderType: 0,
    deliveryCompany: '',
    deliverySn: '',
    autoConfirmDay: 15,
    integration: 0,
    growth: 0,
    promotionInfo: '',
    billType: 0,
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '张三',
    receiverPhone: '18888888888',
    receiverPostCode: '',
    receiverProvince: '湖南省',
    receiverCity: '长沙市',
    receiverRegion: '岳麓区',
    receiverDetailAddress: '中南大学新校区',
    note: '超时未付款，订单已关闭',
    confirmStatus: 0,
    deleteStatus: 0,
    useIntegration: 0,
    paymentTime: null,
    deliveryTime: null,
    receiveTime: null,
    commentTime: null,
    createTime: '2025-01-05 15:00:00',
    modifyTime: '2025-01-06 15:00:00',
    orderItemList: [
      {
        id: 5,
        productId: 15,
        productSkuId: 15,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: 1,
        price: 889,
        productPic: generateImageUrl(15),
        productName: '小米手环8',
        productSubTitle: '健康监测，运动追踪',
        productSkuCode: 'MIBAND8_001',
        productAttr: '[{"key":"颜色","value":"曜石黑"},{"key":"尺寸","value":"标准版"}]',
        productBrand: '小米',
        productSn: 'MIBAND8001',
        productCategoryId: 3,
        promotionMessage: '',
        reduceAmount: 0,
        realStock: 500,
        integrationAmount: 0,
        growthAmount: 0,
        createDate: '2025-01-05 15:00:00',
        modifyDate: '2025-01-05 15:00:00',
        deleteStatus: 0,
        orderId: 5,
        orderSn: 'ORDER20250105001',
        productQuantity: 1,
        productPrice: 889,
        promotionName: '',
        promotionAmount: 0,
        couponAmount: 0,
        realAmount: 889,
        giftIntegration: 0,
        giftGrowth: 0
      }
    ]
  }
]

// 模拟地址数据
// 模拟地址数据
const mockAddresses: Address[] = [
  {
    id: 1,
    memberId: 1,
    name: '张三',
    phoneNumber: '13800138000',
    province: '北京市',
    city: '北京市',
    region: '朝阳区',
    detailAddress: '三里屯街道1号院2栋3单元401室',
    postCode: '100020',
    defaultStatus: 1
  },
  {
    id: 2,
    memberId: 1,
    name: '李四',
    phoneNumber: '13900139000',
    province: '上海市',
    city: '上海市',
    region: '浦东新区',
    detailAddress: '陆家嘴金融贸易区世纪大道100号',
    postCode: '200120',
    defaultStatus: 0
  },
  {
    id: 3,
    memberId: 1,
    name: '王五',
    phoneNumber: '13700137000',
    province: '广东省',
    city: '深圳市',
    region: '南山区',
    detailAddress: '科技园南区深南大道9988号',
    postCode: '518052',
    defaultStatus: 0
  },
  {
    id: 4,
    memberId: 1,
    name: '赵六',
    phoneNumber: '13600136000',
    province: '浙江省',
    city: '杭州市',
    region: '西湖区',
    detailAddress: '文三路477号华星科技大厦15楼',
    postCode: '310013',
    defaultStatus: 0
  },
  {
    id: 5,
    memberId: 1,
    name: '钱七',
    phoneNumber: '13500135000',
    province: '江苏省',
    city: '南京市',
    region: '鼓楼区',
    detailAddress: '中山路321号南京国际金融中心',
    defaultStatus: 0
  }
]

// 模拟优惠券数据
const mockCoupons = [
  {
    id: 1,
    name: '新用户专享券',
    type: 1, // 1-全场通用 2-指定分类 3-指定商品
    amount: 50,
    minPoint: 200,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0, // 0-未使用 1-已使用 2-已过期
    note: '新用户注册专享优惠券',
    publishCount: 10000,
    useCount: 1234,
    receiveCount: 5678,
    enableTime: '2024-01-01 00:00:00',
    code: 'NEWUSER50',
    memberLevel: 0 // 0-无限制 1-铜牌 2-银牌 3-金牌 4-白金
  },
  {
    id: 2,
    name: '手机专用券',
    type: 2,
    amount: 100,
    minPoint: 1000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '仅限手机通讯类商品使用',
    publishCount: 5000,
    useCount: 678,
    receiveCount: 2345,
    enableTime: '2024-01-01 00:00:00',
    code: 'PHONE100',
    memberLevel: 0
  },
  {
    id: 3,
    name: '电脑办公满减券',
    type: 2,
    amount: 300,
    minPoint: 3000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '电脑办公类商品满3000减300',
    publishCount: 2000,
    useCount: 123,
    receiveCount: 890,
    enableTime: '2024-01-01 00:00:00',
    code: 'COMPUTER300',
    memberLevel: 1
  },
  {
    id: 4,
    name: '数码配件特惠券',
    type: 2,
    amount: 30,
    minPoint: 100,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '数码配件类商品专用优惠券',
    publishCount: 8000,
    useCount: 2456,
    receiveCount: 4567,
    enableTime: '2024-01-01 00:00:00',
    code: 'DIGITAL30',
    memberLevel: 0
  },
  {
    id: 5,
    name: '家电节大促券',
    type: 2,
    amount: 500,
    minPoint: 5000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '家用电器满5000减500',
    publishCount: 1000,
    useCount: 45,
    receiveCount: 234,
    enableTime: '2024-01-01 00:00:00',
    code: 'HOME500',
    memberLevel: 2
  },
  {
    id: 6,
    name: '美妆护肤券',
    type: 2,
    amount: 80,
    minPoint: 500,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '美妆护肤类商品专享',
    publishCount: 6000,
    useCount: 1234,
    receiveCount: 3456,
    enableTime: '2024-01-01 00:00:00',
    code: 'BEAUTY80',
    memberLevel: 0
  },
  {
    id: 7,
    name: '运动装备券',
    type: 2,
    amount: 60,
    minPoint: 300,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '服饰鞋帽类商品专用',
    publishCount: 4000,
    useCount: 567,
    receiveCount: 1890,
    enableTime: '2024-01-01 00:00:00',
    code: 'SPORT60',
    memberLevel: 0
  },
  {
    id: 8,
    name: 'VIP专享券',
    type: 1,
    amount: 200,
    minPoint: 2000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: 'VIP会员专享全场通用券',
    publishCount: 500,
    useCount: 123,
    receiveCount: 345,
    enableTime: '2024-01-01 00:00:00',
    code: 'VIP200',
    memberLevel: 3
  },
  {
    id: 9,
    name: '限时闪购券',
    type: 1,
    amount: 20,
    minPoint: 99,
    startTime: '2024-08-08',
    endTime: '2024-08-15',
    useStatus: 0,
    note: '限时闪购活动专用券',
    publishCount: 20000,
    useCount: 5678,
    receiveCount: 12345,
    enableTime: '2024-08-08 00:00:00',
    code: 'FLASH20',
    memberLevel: 0
  },
  {
    id: 10,
    name: '已使用券示例',
    type: 1,
    amount: 25,
    minPoint: 150,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 1, // 已使用
    note: '此券已使用',
    publishCount: 1000,
    useCount: 1000,
    receiveCount: 1000,
    enableTime: '2024-01-01 00:00:00',
    code: 'USED25',
    memberLevel: 0
  },
  {
    id: 11,
    name: '已过期券示例',
    type: 1,
    amount: 15,
    minPoint: 100,
    startTime: '2024-01-01',
    endTime: '2024-07-31',
    useStatus: 2, // 已过期
    note: '此券已过期',
    publishCount: 2000,
    useCount: 0,
    receiveCount: 1500,
    enableTime: '2024-01-01 00:00:00',
    code: 'EXPIRED15',
    memberLevel: 0
  },
  {
    id: 12,
    name: '春节大礼包',
    type: 1,
    amount: 188,
    minPoint: 1000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '春节特惠，满1000减188',
    publishCount: 5000,
    useCount: 200,
    receiveCount: 3000,
    enableTime: '2024-01-01 00:00:00',
    code: 'SPRING188',
    memberLevel: 0
  },
  {
    id: 13,
    name: '电子产品专享',
    type: 2,
    amount: 300,
    minPoint: 2000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '电子产品类专享优惠券',
    publishCount: 2000,
    useCount: 50,
    receiveCount: 800,
    enableTime: '2024-01-01 00:00:00',
    code: 'ELECTRONIC300',
    memberLevel: 1
  },
  {
    id: 14,
    name: '服装类折扣券',
    type: 3,
    amount: 9, // 折扣，表示9折
    minPoint: 300,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '服装类商品9折优惠',
    publishCount: 3000,
    useCount: 150,
    receiveCount: 2000,
    enableTime: '2024-01-01 00:00:00',
    code: 'FASHION90',
    memberLevel: 0
  },
  {
    id: 15,
    name: '美妆护肤券',
    type: 1,
    amount: 60,
    minPoint: 400,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '美妆护肤专用优惠券',
    publishCount: 1500,
    useCount: 80,
    receiveCount: 1000,
    enableTime: '2024-01-01 00:00:00',
    code: 'BEAUTY60',
    memberLevel: 0
  },
  {
    id: 16,
    name: '母婴用品券',
    type: 1,
    amount: 50,
    minPoint: 300,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '母婴用品专享优惠',
    publishCount: 2000,
    useCount: 100,
    receiveCount: 1200,
    enableTime: '2024-01-01 00:00:00',
    code: 'BABY50',
    memberLevel: 0
  },
  {
    id: 17,
    name: 'VIP专享券',
    type: 1,
    amount: 500,
    minPoint: 3000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: 'VIP会员专享，满3000减500',
    publishCount: 500,
    useCount: 20,
    receiveCount: 200,
    enableTime: '2024-01-01 00:00:00',
    code: 'VIP500',
    memberLevel: 2
  },
  {
    id: 18,
    name: '双11狂欢券',
    type: 1,
    amount: 200,
    minPoint: 1500,
    startTime: '2024-11-01',
    endTime: '2024-11-15',
    useStatus: 0,
    note: '双11购物节专享',
    publishCount: 10000,
    useCount: 500,
    receiveCount: 8000,
    enableTime: '2024-11-01 00:00:00',
    code: 'DOUBLE11_200',
    memberLevel: 0
  },
  {
    id: 19,
    name: '智能家居专享券',
    type: 2,
    amount: 200,
    minPoint: 1000,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '智能家居产品专享优惠券',
    publishCount: 1000,
    useCount: 45,
    receiveCount: 500,
    enableTime: '2024-01-01 00:00:00',
    code: 'SMARTHOME200',
    memberLevel: 0
  },
  {
    id: 20,
    name: '运动鞋服券',
    type: 2,
    amount: 80,
    minPoint: 400,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '运动鞋服类商品专用',
    publishCount: 2000,
    useCount: 280,
    receiveCount: 1200,
    enableTime: '2024-01-01 00:00:00',
    code: 'SPORTS80',
    memberLevel: 0
  },
  {
    id: 21,
    name: '图书音像券',
    type: 2,
    amount: 15,
    minPoint: 50,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '图书音像类商品专享',
    publishCount: 5000,
    useCount: 1200,
    receiveCount: 3500,
    enableTime: '2024-01-01 00:00:00',
    code: 'BOOKS15',
    memberLevel: 0
  },
  {
    id: 22,
    name: '汽车用品券',
    type: 2,
    amount: 100,
    minPoint: 500,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '汽车用品类商品专用',
    publishCount: 800,
    useCount: 120,
    receiveCount: 400,
    enableTime: '2024-01-01 00:00:00',
    code: 'AUTO100',
    memberLevel: 0
  },
  {
    id: 23,
    name: '医药健康券',
    type: 2,
    amount: 50,
    minPoint: 200,
    startTime: '2024-01-01',
    endTime: '2024-12-31',
    useStatus: 0,
    note: '医药健康类商品专享',
    publishCount: 1500,
    useCount: 380,
    receiveCount: 900,
    enableTime: '2024-01-01 00:00:00',
    code: 'HEALTH50',
    memberLevel: 0
  }
]

// Mock API 响应函数
export const mallMockApi = {
  // ==================== 首页内容 ====================
  '/home/content': () => ({
    code: 200,
    message: '操作成功',
    data: {
      advertiseList: [
        {
          id: 1,
          name: 'iPhone 15 Pro 新品发布',
          pic: generateImageUrl(501),
          startTime: '2024-01-01',
          endTime: '2024-12-31',
          status: 1,
          clickCount: 1000,
          orderCount: 1,
          url: '/mall/product/1',
          note: 'iPhone 15 Pro 新品上市，限时优惠'
        },
        {
          id: 2,
          name: '小米14 Ultra 影像旗舰',
          pic: generateImageUrl(502),
          startTime: '2024-01-01',
          endTime: '2024-12-31',
          status: 1,
          clickCount: 850,
          orderCount: 2,
          url: '/mall/product/2',
          note: '徕卡专业光学镜头，限量发售'
        },
        {
          id: 3,
          name: 'MacBook Pro 专业创作',
          pic: generateImageUrl(503),
          startTime: '2024-01-01',
          endTime: '2024-12-31',
          status: 1,
          clickCount: 720,
          orderCount: 3,
          url: '/mall/product/5',
          note: 'M3 Pro芯片，专业创作者首选'
        },
        {
          id: 4,
          name: '数码配件精选',
          pic: generateImageUrl(504),
          startTime: '2024-01-01',
          endTime: '2024-12-31',
          status: 1,
          clickCount: 650,
          orderCount: 4,
          url: '/mall/category/3',
          note: '精选数码配件，品质保证'
        },
        {
          id: 5,
          name: '家电节大促销',
          pic: generateImageUrl(505),
          startTime: '2024-01-01',
          endTime: '2024-12-31',
          status: 1,
          clickCount: 580,
          orderCount: 5,
          url: '/mall/category/4',
          note: '家电节特惠，满减活动进行中'
        }
      ],
      brandList: mockBrands.slice(0, 8),
      homeFlashPromotion: {
        startTime: '2024-08-08 10:00:00',
        endTime: '2024-08-08 22:00:00',
        nextStartTime: '2024-08-09 10:00:00',
        nextEndTime: '2024-08-09 22:00:00',
        productList: mockProducts.filter(p => p.recommandStatus === 1).slice(0, 6)
      },
      newProductList: mockProducts.filter(p => p.newStatus === 1).slice(0, 8),
      hotProductList: mockProducts.filter(p => p.recommandStatus === 1).slice(0, 10),
      subjectList: [
        {
          id: 1,
          categoryId: 1,
          title: '智能手机专场',
          pic: generateImageUrl(601),
          productCount: 20,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 100,
          readCount: 1000,
          commentCount: 50,
          albumPics: generateImageUrl(601),
          description: '最新智能手机推荐',
          showStatus: 1,
          content: '<h1>智能手机专场</h1><p>为您精选最新最热门的智能手机</p>',
          forwardCount: 30
        },
        {
          id: 2,
          categoryId: 2,
          title: '笔记本电脑专区',
          pic: generateImageUrl(602),
          productCount: 15,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 80,
          readCount: 800,
          commentCount: 35,
          albumPics: generateImageUrl(602),
          description: '专业办公与创作首选',
          showStatus: 1,
          content: '<h1>笔记本电脑专区</h1><p>高性能笔记本，满足您的工作需求</p>',
          forwardCount: 25
        },
        {
          id: 3,
          categoryId: 3,
          title: '数码潮品汇',
          pic: generateImageUrl(603),
          productCount: 30,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 120,
          readCount: 1200,
          commentCount: 60,
          albumPics: generateImageUrl(603),
          description: '时尚数码配件一站购齐',
          showStatus: 1,
          content: '<h1>数码潮品汇</h1><p>精选数码配件，提升您的数字生活品质</p>',
          forwardCount: 40
        },
        {
          id: 4,
          categoryId: 4,
          title: '智能家电节',
          pic: generateImageUrl(604),
          productCount: 25,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 90,
          readCount: 900,
          commentCount: 45,
          albumPics: generateImageUrl(604),
          description: '打造智慧家居生活',
          showStatus: 1,
          content: '<h1>智能家电节</h1><p>智能家电让生活更便捷</p>',
          forwardCount: 35
        },
        {
          id: 5,
          categoryId: 5,
          title: '时尚穿搭秀',
          pic: generateImageUrl(605),
          productCount: 40,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 150,
          readCount: 1500,
          commentCount: 75,
          albumPics: generateImageUrl(605),
          description: '潮流服饰，展现个性风采',
          showStatus: 1,
          content: '<h1>时尚穿搭秀</h1><p>最新潮流服饰，让您成为街头焦点</p>',
          forwardCount: 50
        },
        {
          id: 6,
          categoryId: 6,
          title: '美妆护肤馆',
          pic: generateImageUrl(606),
          productCount: 35,
          recommendStatus: 1,
          createTime: '2024-01-01',
          collectCount: 200,
          readCount: 2000,
          commentCount: 100,
          albumPics: generateImageUrl(606),
          description: '美丽从这里开始',
          showStatus: 1,
          content: '<h1>美妆护肤馆</h1><p>精选美妆护肤产品，让您焕发自信光彩</p>',
          forwardCount: 60
        }
      ]
    }
  }),

  '/home/recommendProductList': ({ pageNum = 1, pageSize = 24 }) => {
    // 智能推荐算法
    const getRecommendedProducts = () => {
      // 为了确保有足够的数据支持无限滚动，我们将现有商品进行扩展
      const expandedProducts: typeof mockProducts = []

      // 基础商品列表
      expandedProducts.push(...mockProducts)

      // 创建变种商品来增加数据量（模拟相似商品推荐）
      mockProducts.forEach((product, index) => {
        if (expandedProducts.length < 50) { // 确保至少有50个商品
          // 创建颜色变种
          const colorVariant = {
            ...product,
            id: product.id + 1000 + index,
            name: `${product.name} (热门色)`,
            subTitle: `${product.subTitle || ''} 热门配色`,
            price: product.price + Math.floor(Math.random() * 500),
            pic: generateImageUrl(product.id + 1000 + index),
            sale: product.sale + Math.floor(Math.random() * 500),
            recommandStatus: Math.random() > 0.3 ? 1 : 0,
            newStatus: Math.random() > 0.7 ? 1 : 0
          }
          expandedProducts.push(colorVariant)
        }

        if (expandedProducts.length < 80) { // 继续扩展到80个商品
          // 创建容量/规格变种
          const specVariant = {
            ...product,
            id: product.id + 2000 + index,
            name: `${product.name} Pro版`,
            subTitle: `${product.subTitle || ''} 升级版本`,
            price: product.price + Math.floor(Math.random() * 1000) + 500,
            pic: generateImageUrl(product.id + 2000 + index),
            sale: Math.max(0, product.sale - Math.floor(Math.random() * 300)),
            recommandStatus: Math.random() > 0.4 ? 1 : 0,
            newStatus: Math.random() > 0.5 ? 1 : 0
          }
          expandedProducts.push(specVariant)
        }
      })

      // 基于多个维度的推荐权重计算
      const scoredProducts = expandedProducts.map(product => {
        let score = 0

        // 1. 销量权重 (30%)
        const saleScore = Math.min(product.sale / 5000, 1) * 30

        // 2. 推荐状态权重 (25%)
        const recommendScore = product.recommandStatus === 1 ? 25 : 0

        // 3. 新品权重 (20%)
        const newScore = product.newStatus === 1 ? 20 : 0

        // 4. 价格区间权重 (15%) - 中等价位商品更容易推荐
        const priceScore = (() => {
          if (product.price >= 1000 && product.price <= 8000) return 15
          if (product.price >= 500 && product.price <= 10000) return 10
          return 5
        })()

        // 5. 库存权重 (10%) - 有库存的商品优先推荐
        const stockScore = product.stock > 50 ? 10 : product.stock > 10 ? 5 : 0

        // 6. 随机因子，增加推荐多样性
        const randomScore = Math.random() * 10

        score = saleScore + recommendScore + newScore + priceScore + stockScore + randomScore

        return {
          ...product,
          recommendScore: score
        }
      })

      // 按推荐分数排序并过滤掉缺货商品
      return scoredProducts
        .filter(product => product.stock > 0)
        .sort((a, b) => b.recommendScore - a.recommendScore)
    }

    // 为了增加推荐的多样性，混合不同类别的商品
    const getBalancedRecommendations = (products: typeof mockProducts, pageSize: number) => {
      const categories = [...new Set(products.map(p => p.productCategoryId))]
      const result: typeof products = []
      const productsPerCategory = Math.ceil(pageSize / categories.length)

      // 从每个分类中选择一定数量的商品
      categories.forEach(categoryId => {
        const categoryProducts = products
          .filter(p => p.productCategoryId === categoryId)
          .slice(0, productsPerCategory)
        result.push(...categoryProducts)
      })

      // 如果还没达到请求的数量，补充剩余的高分商品
      if (result.length < pageSize) {
        const remaining = products
          .filter(p => !result.find(r => r.id === p.id))
          .slice(0, pageSize - result.length)
        result.push(...remaining)
      }

      return result.slice(0, pageSize)
    }

    const recommendedProducts = getRecommendedProducts()
    const totalRecommended = recommendedProducts.length

    // 应用平衡算法获取多样化推荐
    const balancedProducts = getBalancedRecommendations(recommendedProducts, pageSize)
    // pageNum 从 1 开始，转换为 0 开始的索引
    const startIndex = (pageNum - 1) * pageSize
    const paginatedProducts = balancedProducts.slice(startIndex, startIndex + pageSize)

    // 为推荐商品添加推荐理由
    const productsWithReasons = paginatedProducts.map(product => {
      const reasons: string[] = []
      if (product.sale > 2000) reasons.push('热销商品')
      if (product.newStatus === 1) reasons.push('新品上市')
      if (product.originalPrice && product.originalPrice > product.price) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100)
        reasons.push(`限时${discount}折`)
      }
      if (product.recommandStatus === 1) reasons.push('精选推荐')
      if (product.stock < 50) reasons.push('库存紧张')

      const recommendReason = reasons.length > 0 ? reasons[0] : '为你推荐'

      // 创建新对象，包含推荐理由，排除内部计算字段
      return {
        id: product.id,
        name: product.name,
        subTitle: product.subTitle,
        price: product.price,
        originalPrice: product.originalPrice,
        pic: product.pic,
        albumPics: product.albumPics,
        detailTitle: product.detailTitle,
        detailDesc: product.detailDesc,
        productCategoryId: product.productCategoryId,
        productCategoryName: product.productCategoryName,
        brandId: product.brandId,
        brandName: product.brandName,
        stock: product.stock,
        sale: product.sale,
        publishStatus: product.publishStatus,
        newStatus: product.newStatus,
        recommandStatus: product.recommandStatus,
        sort: product.sort,
        productAttributeValueList: product.productAttributeValueList,
        skuStockList: product.skuStockList,
        recommendReason
      }
    })

    return {
      code: 200,
      message: '操作成功',
      data: {
        list: productsWithReasons,
        total: totalRecommended,
        pageNum,
        pageSize,
        totalPage: Math.ceil(totalRecommended / pageSize),
        // 添加推荐元数据
        recommendMeta: {
          algorithm: 'smart_recommend_v2.0',
          timestamp: new Date().toISOString(),
          diversity: true,
          categories: [...new Set(productsWithReasons.map(p => p.productCategoryName))],
          totalCategories: [...new Set(recommendedProducts.map(p => p.productCategoryId))].length
        }
      }
    }
  },

  '/home/hotProductList': ({ pageNum = 1, pageSize = 6 }) => {
    // pageNum 从 1 开始，转换为 0 开始的索引
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize
    const hotProducts = mockProducts.filter(p => p.recommandStatus === 1)

    return {
      code: 200,
      message: '操作成功',
      data: {
        list: hotProducts.slice(startIndex, endIndex),
        total: hotProducts.length,
        pageNum,
        pageSize,
        totalPage: Math.ceil(hotProducts.length / pageSize)
      }
    }
  },

  '/home/newProductList': ({ pageNum = 1, pageSize = 6 }) => {
    // pageNum 从 1 开始，转换为 0 开始的索引
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize
    const newProducts = mockProducts.filter(p => p.newStatus === 1)

    return {
      code: 200,
      message: '操作成功',
      data: {
        list: newProducts.slice(startIndex, endIndex),
        total: newProducts.length,
        pageNum,
        pageSize,
        totalPage: Math.ceil(newProducts.length / pageSize)
      }
    }
  },

  '/home/productCateList/:parentId': ({ parentId = 0 }) => ({
    code: 200,
    message: '操作成功',
    data: mockCategories.filter(cat => cat.parentId === Number(parentId))
  }),

  // ==================== 商品管理 ====================
  '/product/search': ({ keyword = '', brandId, productCategoryId, sort = 0, pageNum = 1, pageSize = 5 }: {
    keyword?: string;
    brandId?: number;
    productCategoryId?: number;
    sort?: number;
    pageNum?: number;
    pageSize?: number;
  }) => {
    // 确保参数为数字类型，并转换为基于0的索引
    const pageNumNum = Number(pageNum)
    const pageSizeNum = Number(pageSize)
    const startIndex = (pageNumNum - 1) * pageSizeNum

    console.log('Mock API: /product/search 被调用，参数:', { keyword, brandId, productCategoryId, sort, pageNum: pageNumNum, pageSize: pageSizeNum })

    let filteredProducts = [...mockProducts]

    if (keyword) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase()) ||
        p.subTitle.toLowerCase().includes(keyword.toLowerCase())
      )
    }

    if (brandId) {
      filteredProducts = filteredProducts.filter(p => p.brandId === Number(brandId))
    }

    if (productCategoryId) {
      filteredProducts = filteredProducts.filter(p => p.productCategoryId === Number(productCategoryId))
    }

    // 排序
    switch (Number(sort)) {
      case 1: // 按新品
        filteredProducts.sort((a, b) => b.newStatus - a.newStatus)
        break
      case 2: // 按销量
        filteredProducts.sort((a, b) => b.sale - a.sale)
        break
      case 3: // 价格从低到高
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 4: // 价格从高到低
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      default: // 按相关度
        break
    }

    const totalPage = Math.ceil(filteredProducts.length / pageSizeNum)

    return {
      code: 200,
      message: '操作成功',
      data: {
        list: filteredProducts.slice(startIndex, startIndex + pageSizeNum),
        total: filteredProducts.length,
        pageNum: pageNumNum,
        pageSize: pageSizeNum,
        totalPage
      }
    }
  },

  '/product/detail/:id': ({ id }) => {
    const product = mockProducts.find(p => p.id === Number(id))
    if (!product) {
      return { code: 404, message: '商品不存在', data: null }
    }

    // 前端期望直接在data中获取完整的商品信息
    return {
      code: 200,
      message: '操作成功',
      data: {
        ...product,
        // 确保包含所有需要的字段
        productAttributeValueList: product.productAttributeValueList || [],
        skuStockList: product.skuStockList || [],
        // 添加关联的优惠券信息
        couponList: mockCoupons.filter(c => c.useStatus === 0 && (c.type === 1 || c.type === 3)).slice(0, 3)
      }
    }
  },

  '/product/categoryTreeList': () => {
    // 构建树形结构的分类数据
    const buildCategoryTree = (categories: any[], parentId = 0): any[] => {
      return categories
        .filter(cat => cat.parentId === parentId && cat.showStatus === 1)
        .map(category => ({
          ...category,
          children: buildCategoryTree(categories, category.id)
        }))
        .sort((a, b) => (b.sort || 0) - (a.sort || 0))
    }

    return {
      code: 200,
      message: '操作成功',
      data: buildCategoryTree(mockCategories)
    }
  },

  // ==================== 购物车 ====================
  '/cart/add': (data: { productId: number; productSkuId: number; quantity: number }) => {
    const product = mockProducts.find(p => p.id === data.productId)
    if (!product) {
      return { code: 404, message: '商品不存在', data: null }
    }

    const existingItem = mockCartItems.find(item =>
      item.productId === data.productId && item.productSkuId === data.productSkuId
    )

    if (existingItem) {
      existingItem.quantity += data.quantity
    } else {
      mockCartItems.push({
        id: mockCartItems.length + 1,
        productId: data.productId,
        productSkuId: data.productSkuId,
        memberId: 1,
        memberUsername: 'testuser',
        quantity: data.quantity,
        price: product.price,
        productPic: product.pic,
        productName: product.name,
        productSubTitle: product.subTitle,
        productSkuCode: product.skuStockList?.[0]?.skuCode || '',
        productAttr: '',
        productBrand: product.brandName,
        productSn: `SN${product.id}`,
        productCategoryId: product.productCategoryId,
        promotionMessage: '',
        reduceAmount: 0,
        realStock: product.stock,
        integrationAmount: 0,
        growthAmount: 0,
        createDate: new Date().toISOString(),
        modifyDate: new Date().toISOString(),
        deleteStatus: 0
      })
    }

    return {
      code: 200,
      message: '添加成功',
      data: null
    }
  },

  '/cart/list': () => ({
    code: 200,
    message: '操作成功',
    data: mockCartItems
  }),

  '/cart/list/promotion': () => ({
    code: 200,
    message: '操作成功',
    data: mockCartItems.map(item => ({
      ...item,
      promotionMessage: '',
      reduceAmount: 0
    }))
  }),

  '/cart/update/quantity': ({ id, quantity }: { id: number; quantity: number }) => {
    const item = mockCartItems.find(item => item.id === Number(id))
    if (item) {
      item.quantity = quantity
      item.modifyDate = new Date().toISOString()
    }
    return {
      code: 200,
      message: '更新成功',
      data: null
    }
  },

  '/cart/getProduct/:productId': ({ productId }: { productId: number }) => {
    const product = mockProducts.find(p => p.id === Number(productId))
    return {
      code: 200,
      message: '操作成功',
      data: product
    }
  },

  '/cart/delete': ({ ids }: { ids: string }) => {
    const idArray = ids.split(',').map((id: string) => Number(id))
    mockCartItems = mockCartItems.filter(item => !idArray.includes(item.id))
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  },

  '/cart/clear': () => {
    mockCartItems = []
    return {
      code: 200,
      message: '清空成功',
      data: null
    }
  },

  // ==================== 订单管理 ====================
  '/order/generateConfirmOrder': (cartIds: number[] | any) => {
    console.log('生成确认订单，接收参数:', cartIds, '类型:', typeof cartIds)

    // 处理不同的参数格式
    let cartIdArray: number[] = []
    if (Array.isArray(cartIds)) {
      cartIdArray = cartIds
    } else if (cartIds && cartIds.cartIds) {
      cartIdArray = cartIds.cartIds
    } else if (typeof cartIds === 'object' && cartIds.body) {
      cartIdArray = JSON.parse(cartIds.body)
    } else if (typeof cartIds === 'object') {
      // 处理类似 { '0': 1, '1': 2 } 这样的对象
      cartIdArray = Object.values(cartIds).map(Number)
    } else if (typeof cartIds === 'string') {
      // 处理字符串格式 "1,2,3"
      cartIdArray = cartIds.split(',').map(Number)
    } else {
      console.error('无法解析cartIds参数:', cartIds)
      return {
        code: 400,
        message: '参数格式错误',
        data: null
      }
    }

    console.log('解析后的cartIdArray:', cartIdArray)
    const orderItems = mockCartItems.filter(item => cartIdArray.includes(item.id))
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      code: 200,
      message: '操作成功',
      data: {
        cartPromotionItemList: orderItems,
        memberReceiveAddressList: mockAddresses,
        couponHistoryDetailList: mockCoupons.filter(c => c.useStatus === 0),
        integrationConsumeSetting: {
          id: 1,
          deductionPerAmount: 100,
          maxPercentPerOrder: 50
        },
        memberIntegration: 1000,
        calcAmount: {
          totalAmount,
          freightAmount: 0,
          promotionAmount: 0,
          payAmount: totalAmount
        }
      }
    }
  },

  '/order/generateOrder': (data: {
    memberReceiveAddressId: number;
    couponId?: number;
    useIntegration?: number;
    payType: number;
    cartIds: number[]
  }) => {
    console.log('Mock API: /order/generateOrder 被调用，参数:', data)

    // 模拟参数验证
    if (!data.memberReceiveAddressId || !data.payType || !data.cartIds || data.cartIds.length === 0) {
      return {
        code: 400,
        message: '请求参数不完整',
        data: null
      }
    }

    // 验证收货地址是否存在
    const address = mockAddresses.find(addr => addr.id === data.memberReceiveAddressId)
    if (!address) {
      return {
        code: 400,
        message: '收货地址不存在',
        data: null
      }
    }

    // 验证购物车项是否存在
    const validCartItems = mockCartItems.filter(item => data.cartIds.includes(item.id))
    if (validCartItems.length === 0) {
      return {
        code: 400,
        message: '购物车商品不存在',
        data: null
      }
    }

    // 检查库存
    for (const cartItem of validCartItems) {
      const product = mockProducts.find(p => p.id === cartItem.productId)
      if (!product || product.stock < cartItem.quantity) {
        return {
          code: 400,
          message: `商品 ${cartItem.productName} 库存不足`,
          data: null
        }
      }
    }

    // 生成新订单
    const newOrderId = mockOrders.length + 1
    const orderSn = `ORDER${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(newOrderId).padStart(3, '0')}`

    // 计算订单金额
    let totalAmount = 0
    let promotionAmount = 0
    const integrationAmount = data.useIntegration || 0

    const orderItems = validCartItems.map(cartItem => {
      const itemTotal = cartItem.price * cartItem.quantity
      totalAmount += itemTotal

      // 模拟满减促销
      let itemPromotionAmount = 0
      if (itemTotal >= 3000) {
        itemPromotionAmount = Math.floor(itemTotal / 3000) * 200
        promotionAmount += itemPromotionAmount
      }

      return {
        ...cartItem,
        orderId: newOrderId,
        orderSn,
        productQuantity: cartItem.quantity,
        productPrice: cartItem.price,
        promotionName: itemTotal >= 3000 ? '满3000减200' : '',
        promotionAmount: itemPromotionAmount,
        couponAmount: 0,
        realAmount: itemTotal - itemPromotionAmount,
        giftIntegration: Math.floor(itemTotal / 100),
        giftGrowth: Math.floor(itemTotal / 200)
      }
    })

    // 应用优惠券
    let couponAmount = 0
    if (data.couponId) {
      const coupon = mockCoupons.find(c => c.id === data.couponId)
      if (coupon && coupon.useStatus === 0) {
        couponAmount = Math.min(coupon.amount, totalAmount - promotionAmount)
      }
    }

    const finalAmount = totalAmount - promotionAmount - couponAmount - integrationAmount
    const freightAmount = finalAmount >= 99 ? 0 : 15 // 满99免邮

    const newOrder: Order = {
      id: newOrderId,
      memberId: 1,
      orderSn,
      couponId: data.couponId,
      memberUsername: 'testuser',
      totalAmount: totalAmount + freightAmount,
      payAmount: finalAmount + freightAmount,
      freightAmount,
      promotionAmount,
      integrationAmount,
      couponAmount,
      discountAmount: 0,
      payType: data.payType,
      sourceType: 1,
      status: 0, // 待付款
      orderType: 0,
      deliveryCompany: '',
      deliverySn: '',
      autoConfirmDay: 15,
      integration: data.useIntegration || 0,
      growth: 0,
      promotionInfo: promotionAmount > 0 ? '满减优惠' : '',
      billType: 0,
      billHeader: '',
      billContent: '',
      billReceiverPhone: '',
      billReceiverEmail: '',
      receiverName: address.name,
      receiverPhone: address.phoneNumber,
      receiverPostCode: '',
      receiverProvince: address.province,
      receiverCity: address.city,
      receiverRegion: address.region,
      receiverDetailAddress: address.detailAddress,
      note: '',
      confirmStatus: 0,
      deleteStatus: 0,
      useIntegration: data.useIntegration || 0,
      paymentTime: null,
      deliveryTime: null,
      receiveTime: null,
      commentTime: null,
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      modifyTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      orderItemList: orderItems
    }

    // 添加到订单列表
    mockOrders.push(newOrder)

    // 扣减库存
    orderItems.forEach(item => {
      const product = mockProducts.find(p => p.id === item.productId)
      if (product) {
        product.stock -= item.quantity
        product.sale += item.quantity
      }
    })

    // 从购物车中移除已下单商品
    data.cartIds.forEach(cartId => {
      const index = mockCartItems.findIndex(item => item.id === cartId)
      if (index > -1) {
        mockCartItems.splice(index, 1)
      }
    })

    console.log('Mock API: 订单创建成功，订单号:', orderSn)

    return {
      code: 200,
      message: '订单提交成功',
      data: {
        order: newOrder,
        payInfo: {
          orderId: newOrderId,
          orderSn,
          payAmount: finalAmount + freightAmount,
          payType: data.payType,
          // 模拟支付信息
          payUrl: data.payType === 1 ?
            `https://openapi.alipay.com/gateway.do?orderSn=${orderSn}&amount=${finalAmount + freightAmount}` :
            `https://api.mch.weixin.qq.com/pay/unifiedorder?orderSn=${orderSn}&amount=${finalAmount + freightAmount}`
        }
      }
    }
  },

  '/order/paySuccess': ({ orderId }: { orderId: number; payType: number }) => {
    const order = mockOrders.find(o => o.id === Number(orderId))
    if (order) {
      order.status = 1 // 待发货
      order.paymentTime = new Date().toISOString()
    }
    return {
      code: 200,
      message: '支付成功',
      data: null
    }
  },

  '/order/list': ({ status = -1, pageNum = 1, pageSize = 5 }: {
    status?: number | string;
    pageNum?: number | string;
    pageSize?: number | string
  }) => {
    // 确保参数为数字类型
    const statusNum = Number(status)
    const pageNumNum = Number(pageNum)
    const pageSizeNum = Number(pageSize)

    console.log('Mock API: /order/list 被调用，参数:', { status: statusNum, pageNum: pageNumNum, pageSize: pageSizeNum })
    console.log('Mock API: mockOrders 数量:', mockOrders.length)

    let filteredOrders = [...mockOrders]

    if (statusNum !== -1) {
      filteredOrders = filteredOrders.filter(order => order.status === statusNum)
    }

    // 按创建时间倒序排序（最新的在前面）
    filteredOrders.sort((a, b) => {
      const timeA = new Date(a.createTime).getTime()
      const timeB = new Date(b.createTime).getTime()
      return timeB - timeA // 倒序：时间越晚的越靠前
    })

    console.log('Mock API: 过滤并排序后订单数量:', filteredOrders.length)

    // pageNum 从 1 开始，需要转换为 0 开始的索引
    const startIndex = (pageNumNum - 1) * pageSizeNum
    const endIndex = pageNumNum * pageSizeNum

    const result = {
      code: 200,
      message: '操作成功',
      data: {
        list: filteredOrders.slice(startIndex, endIndex),
        total: filteredOrders.length,
        pageNum: pageNumNum,
        pageSize: pageSizeNum,
        totalPage: Math.ceil(filteredOrders.length / pageSizeNum)
      }
    }

    console.log('Mock API: 返回结果:', result)
    return result
  },

  '/order/detail/:orderId': ({ orderId }: { orderId: number }) => {
    const order = mockOrders.find(o => o.id === Number(orderId))
    if (!order) {
      return { code: 404, message: '订单不存在', data: null }
    }
    return {
      code: 200,
      message: '操作成功',
      data: order
    }
  },

  '/order/cancelUserOrder': ({ orderId }: { orderId: number }) => {
    const order = mockOrders.find(o => o.id === Number(orderId))
    if (order) {
      order.status = 4 // 已关闭
    }
    return {
      code: 200,
      message: '取消成功',
      data: null
    }
  },

  '/order/confirmReceiveOrder': ({ orderId }: { orderId: number }) => {
    const order = mockOrders.find(o => o.id === Number(orderId))
    if (order) {
      order.status = 3 // 已完成
      order.receiveTime = new Date().toISOString()
    }
    return {
      code: 200,
      message: '确认收货成功',
      data: null
    }
  },

  '/order/deleteOrder': ({ orderId }: { orderId: number }) => {
    const orderIndex = mockOrders.findIndex(o => o.id === Number(orderId))
    if (orderIndex > -1) {
      mockOrders.splice(orderIndex, 1)
    }
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  },

  // ==================== 收货地址 ====================
  '/member/address/add': (data: Omit<Address, 'id' | 'memberId'>) => {
    // 如果设置为默认地址，先将其他地址设为非默认
    if (data.defaultStatus === 1) {
      mockAddresses.forEach(addr => addr.defaultStatus = 0)
    }

    const newAddress: Address = {
      id: mockAddresses.length + 1,
      memberId: 1,
      ...data
    }
    mockAddresses.push(newAddress)

    return {
      code: 200,
      message: '添加成功',
      data: newAddress
    }
  },

  '/member/address/delete/:id': ({ id }: { id: number }) => {
    const addressIndex = mockAddresses.findIndex(addr => addr.id === Number(id))
    if (addressIndex > -1) {
      mockAddresses.splice(addressIndex, 1)
    }
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  },

  '/member/address/update/:id': ({ id, ...data }: { id: number } & Partial<Omit<Address, 'id' | 'memberId'>>) => {
    const address = mockAddresses.find(addr => addr.id === Number(id))
    if (address) {
      // 如果设置为默认地址，先将其他地址设为非默认
      if (data.defaultStatus === 1) {
        mockAddresses.forEach(addr => addr.defaultStatus = 0)
      }
      Object.assign(address, data)
    }
    return {
      code: 200,
      message: '更新成功',
      data: address
    }
  },

  '/member/address/list': () => ({
    code: 200,
    message: '操作成功',
    data: mockAddresses
  }),

  '/member/address/:id': ({ id }: { id: number }) => {
    const address = mockAddresses.find(addr => addr.id === Number(id))
    return {
      code: 200,
      message: '操作成功',
      data: address
    }
  },

  // ==================== 优惠券 ====================
  '/member/coupon/add/:couponId': ({ couponId }: { couponId: number }) => {
    console.log('领取优惠券:', couponId)
    return {
      code: 200,
      message: '领取成功',
      data: null
    }
  },

  '/member/coupon/list': ({ useStatus }: { useStatus?: number }) => {
    let filteredCoupons = [...mockCoupons]
    if (useStatus !== undefined) {
      filteredCoupons = filteredCoupons.filter(coupon => coupon.useStatus === Number(useStatus))
    }
    return {
      code: 200,
      message: '操作成功',
      data: filteredCoupons
    }
  },

  '/member/coupon/listHistory': () => ({
    code: 200,
    message: '操作成功',
    data: mockCoupons
  }),

  '/member/coupon/list/cart/:type': ({ type }: { type: number }) => {
    console.log('购物车优惠券类型:', type)
    return {
      code: 200,
      message: '操作成功',
      data: mockCoupons.filter(c => c.useStatus === 0)
    }
  },

  '/member/coupon/listByProduct/:productId': ({ productId }: { productId: number }) => {
    console.log('商品优惠券:', productId)
    return {
      code: 200,
      message: '操作成功',
      data: mockCoupons.filter(c => c.useStatus === 0 && (c.type === 1 || c.type === 3))
    }
  },

  // ==================== SSO 会员认证接口 ====================
  '/sso/register': (data: {
    username: string;
    password: string;
    telephone: string;
    authCode: string;
  }) => {
    console.log('用户注册:', data)
    return {
      code: 200,
      message: '注册成功',
      data: null
    }
  },

  '/sso/login': (data: {
    username: string;
    password: string;
  }) => {
    console.log('用户登录:', data)
    return {
      code: 200,
      message: '操作成功',
      data: {
        token: 'eyJhbGciOiJIUzUxMiJ9.mock_token_data.mock_signature',
        tokenHead: 'Bearer '
      }
    }
  },

  '/sso/info': () => ({
    code: 200,
    message: '操作成功',
    data: {
      id: 1,
      username: 'testuser',
      nickname: '测试用户',
      phone: '18888888888',
      integration: 1000,
      growth: 500
    }
  }),

  '/sso/getAuthCode': ({ telephone }: { telephone: string }) => {
    console.log('获取验证码:', telephone)
    return {
      code: 200,
      message: '获取验证码成功',
      data: '123456'
    }
  },

  // ==================== 专题列表接口 ====================
  '/home/subjectList': ({ cateId, pageNum = 1, pageSize = 4 }: {
    cateId?: number;
    pageNum?: number;
    pageSize?: number;
  }) => {
    let subjects = mockSubjects || []

    if (cateId) {
      subjects = subjects.filter(subject => subject.categoryId === Number(cateId))
    }

    // pageNum 从 1 开始，转换为 0 开始的索引
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize

    return {
      code: 200,
      message: '操作成功',
      data: {
        list: subjects.slice(startIndex, endIndex),
        total: subjects.length,
        pageNum,
        pageSize,
        totalPage: Math.ceil(subjects.length / pageSize)
      }
    }
  },  // ==================== 售后服务接口 ====================
  '/returnApply/create': (data: {
    orderId: number;
    productId: number;
    orderSn: string;
    returnAmount: number;
    returnName: string;
    returnPhone: string;
    returnReason: string;
    description: string;
    proofPics?: string;
  }) => {
    console.log('申请退货:', data)
    return {
      code: 200,
      message: '退货申请提交成功',
      data: {
        id: Date.now(),
        ...data,
        status: 0, // 待处理
        createTime: new Date().toISOString()
      }
    }
  },

  // ==================== 支付接口 ====================
  '/alipay/pay': ({ outTradeNo, subject, totalAmount }: {
    outTradeNo: string;
    subject: string;
    totalAmount: string
  }) => {
    // 直接返回HTML表单字符串，模拟支付宝网页支付
    return `<form name="punchout_form" method="post" action="https://openapi.alipay.com/gateway.do?charset=UTF-8&method=alipay.trade.page.pay&sign=mock_sign&return_url=http%3A%2F%2Flocalhost%3A5174%2Fmall%2Fpayment%2Fresult&notify_url=http%3A%2F%2Flocalhost%3A8080%2Falipay%2Fnotify&version=1.0&app_id=2021000117648026&sign_type=RSA2&timestamp=2024-01-01+10%3A00%3A00&alipay_sdk=alipay-sdk-java-4.22.110.ALL&format=json">
<input type="hidden" name="biz_content" value="{&quot;out_trade_no&quot;:&quot;${outTradeNo}&quot;,&quot;total_amount&quot;:&quot;${totalAmount}&quot;,&quot;subject&quot;:&quot;${subject}&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;}">
<input type="submit" value="立即支付" style="display:none" >
</form>
<script>document.forms[0].submit();</script>`
  },

  '/alipay/webPay': ({ outTradeNo, subject, totalAmount }: {
    outTradeNo: string;
    subject: string;
    totalAmount: string
  }) => {
    // 直接返回HTML表单字符串，模拟支付宝网页支付
    return `<form name="punchout_form" method="post" action="https://openapi.alipay.com/gateway.do?charset=UTF-8&method=alipay.trade.page.pay&sign=mock_sign&return_url=http%3A%2F%2Flocalhost%3A5174%2Fmall%2Fpayment%2Fresult&notify_url=http%3A%2F%2Flocalhost%3A8080%2Falipay%2Fnotify&version=1.0&app_id=2021000117648026&sign_type=RSA2&timestamp=2024-01-01+10%3A00%3A00&alipay_sdk=alipay-sdk-java-4.22.110.ALL&format=json">
<input type="hidden" name="biz_content" value="{&quot;out_trade_no&quot;:&quot;${outTradeNo}&quot;,&quot;total_amount&quot;:&quot;${totalAmount}&quot;,&quot;subject&quot;:&quot;${subject}&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;}">
<input type="submit" value="立即支付" style="display:none" >
</form>
<script>document.forms[0].submit();</script>`
  },

  '/alipay/query': ({ outTradeNo }: { outTradeNo: string }) => {
    // 根据订单号查询支付状态
    console.log('查询支付状态，订单号:', outTradeNo)
    return {
      code: 200,
      message: '操作成功',
      data: 'TRADE_SUCCESS' // 直接返回支付状态字符串
    }
  },

  // ==================== ElasticSearch商品搜索接口 ====================
  '/esProduct/search/simple': ({ keyword = '', pageNum = 0, pageSize = 5 }: {
    keyword?: string;
    pageNum?: number;
    pageSize?: number;
  }) => {
    let filteredProducts = [...mockProducts];

    if (keyword) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.includes(keyword) ||
        p.subTitle.includes(keyword) ||
        p.brandName.includes(keyword)
      );
    }

    const startIndex = pageNum * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredProducts.slice(startIndex, endIndex);

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: Math.ceil(filteredProducts.length / pageSize),
        total: filteredProducts.length,
        list: pageData
      }
    };
  },

  '/esProduct/search': ({ keyword = '', brandId, productCategoryId, sort = 0, pageNum = 0, pageSize = 5 }: {
    keyword?: string;
    brandId?: number;
    productCategoryId?: number;
    sort?: number;
    pageNum?: number;
    pageSize?: number;
  }) => {
    let filteredProducts = [...mockProducts];

    // 关键词过滤
    if (keyword) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.includes(keyword) ||
        p.subTitle.includes(keyword) ||
        p.brandName.includes(keyword)
      );
    }

    // 品牌过滤
    if (brandId) {
      filteredProducts = filteredProducts.filter(p => p.brandId === brandId);
    }

    // 分类过滤
    if (productCategoryId) {
      filteredProducts = filteredProducts.filter(p => p.productCategoryId === productCategoryId);
    }

    // 排序
    switch (sort) {
      case 1: // 按新品
        filteredProducts = filteredProducts.sort((a, b) => b.newStatus - a.newStatus);
        break;
      case 2: // 按销量
        filteredProducts = filteredProducts.sort((a, b) => b.sale - a.sale);
        break;
      case 3: // 价格从低到高
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 4: // 价格从高到低
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default: // 按相关度（默认）
        break;
    }

    const startIndex = pageNum * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredProducts.slice(startIndex, endIndex);

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: Math.ceil(filteredProducts.length / pageSize),
        total: filteredProducts.length,
        list: pageData
      }
    };
  },

  '/esProduct/recommend/:id': ({ id, pageNum = 0, pageSize = 5 }: {
    id: number;
    pageNum?: number;
    pageSize?: number;
  }) => {
    const currentProduct = mockProducts.find(p => p.id === Number(id));
    let recommendedProducts: typeof mockProducts = [];

    if (currentProduct) {
      // 推荐同品牌或同分类的商品
      recommendedProducts = mockProducts.filter(p =>
        p.id !== currentProduct.id &&
        (p.brandId === currentProduct.brandId || p.productCategoryId === currentProduct.productCategoryId)
      );
    } else {
      // 如果找不到商品，推荐热门商品
      recommendedProducts = mockProducts.filter(p => p.recommandStatus === 1);
    }

    const startIndex = pageNum * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = recommendedProducts.slice(startIndex, endIndex);

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: Math.ceil(recommendedProducts.length / pageSize),
        total: recommendedProducts.length,
        list: pageData
      }
    };
  },

  // ==================== 新增密码修改接口 ====================
  '/sso/changePassword': (data: {
    telephone: string;
    password: string;
    authCode: string;
  }) => {
    console.log('修改密码:', data);
    // 验证验证码
    if (data.authCode !== '123456') {
      return {
        code: 400,
        message: '验证码错误',
        data: null
      };
    }

    return {
      code: 200,
      message: '密码修改成功',
      data: null
    };
  },

  // ==================== 新增Token刷新接口 ====================
  '/sso/refreshAccessToken': () => ({
    code: 200,
    message: '操作成功',
    data: {
      token: 'eyJhbGciOiJIUzUxMiJ9.refreshed_token_data.refreshed_signature',
      tokenHead: 'Bearer '
    }
  }),

  // ==================== 品牌相关接口 ====================
  '/brand/listAll': () => ({
    code: 200,
    message: '操作成功',
    data: mockBrands.filter(b => b.showStatus === 1)
  }),

  '/brand/detail/:id': ({ id }: { id: number }) => {
    const brand = mockBrands.find(b => b.id === Number(id));
    return {
      code: 200,
      message: '操作成功',
      data: brand || null
    };
  },

  // ==================== 促销活动接口 ====================
  '/promotion/flashPromotion/list': ({ pageNum = 1, pageSize = 5 }: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    const flashPromotions = [
      {
        id: 1,
        title: '每日秒杀',
        startDate: '2024-08-09',
        endDate: '2024-08-09',
        status: 1,
        createTime: '2024-08-08 10:00:00',
        productList: mockProducts.filter(p => p.recommandStatus === 1).slice(0, 10)
      }
    ];

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: 1,
        total: flashPromotions.length,
        list: flashPromotions
      }
    };
  },

  // ==================== 收藏相关接口 ====================
  '/member/productCollection/add': (data: { productId: number }) => {
    console.log('添加收藏:', data);
    return {
      code: 200,
      message: '收藏成功',
      data: null
    };
  },

  '/member/productCollection/delete': (data: { productId: number }) => {
    console.log('取消收藏:', data);
    return {
      code: 200,
      message: '取消收藏成功',
      data: null
    };
  },

  '/member/productCollection/list': ({ pageNum = 1, pageSize = 5 }: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    const favoriteProducts = mockProducts.slice(0, 8); // 模拟收藏的商品

    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = favoriteProducts.slice(startIndex, endIndex);

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: Math.ceil(favoriteProducts.length / pageSize),
        total: favoriteProducts.length,
        list: pageData
      }
    };
  },

  // ==================== 积分相关接口 ====================
  '/member/integration/list': ({ pageNum = 1, pageSize = 10 }: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    const integrationHistory = [
      {
        id: 1,
        memberId: 1,
        createTime: '2024-08-09 10:00:00',
        changeCount: 100,
        note: '购买商品获得积分',
        sourceType: 1
      },
      {
        id: 2,
        memberId: 1,
        createTime: '2024-08-08 15:30:00',
        changeCount: -50,
        note: '使用积分抵扣',
        sourceType: 2
      },
      {
        id: 3,
        memberId: 1,
        createTime: '2024-08-07 09:15:00',
        changeCount: 200,
        note: '签到获得积分',
        sourceType: 3
      }
    ];

    return {
      code: 200,
      message: '操作成功',
      data: {
        pageNum,
        pageSize,
        totalPage: 1,
        total: integrationHistory.length,
        list: integrationHistory
      }
    };
  }
}

// 模拟专题数据
const mockSubjects = [
  {
    id: 1,
    categoryId: 1,
    title: '智能手机专场',
    pic: generateImageUrl(601),
    productCount: 20,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 100,
    readCount: 1000,
    commentCount: 50,
    albumPics: generateImageUrl(601),
    description: '最新智能手机推荐',
    showStatus: 1,
    content: '<h1>智能手机专场</h1><p>为您精选最新最热门的智能手机</p>',
    forwardCount: 30
  },
  {
    id: 2,
    categoryId: 2,
    title: '笔记本电脑专区',
    pic: generateImageUrl(602),
    productCount: 15,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 80,
    readCount: 800,
    commentCount: 35,
    albumPics: generateImageUrl(602),
    description: '专业办公与创作首选',
    showStatus: 1,
    content: '<h1>笔记本电脑专区</h1><p>高性能笔记本，满足您的工作需求</p>',
    forwardCount: 25
  },
  {
    id: 3,
    categoryId: 3,
    title: '数码潮品汇',
    pic: generateImageUrl(603),
    productCount: 30,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 120,
    readCount: 1200,
    commentCount: 60,
    albumPics: generateImageUrl(603),
    description: '时尚数码配件一站购齐',
    showStatus: 1,
    content: '<h1>数码潮品汇</h1><p>精选数码配件，提升您的数字生活品质</p>',
    forwardCount: 40
  },
  {
    id: 4,
    categoryId: 4,
    title: '智能家电节',
    pic: generateImageUrl(604),
    productCount: 25,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 90,
    readCount: 900,
    commentCount: 45,
    albumPics: generateImageUrl(604),
    description: '打造智慧家居生活',
    showStatus: 1,
    content: '<h1>智能家电节</h1><p>智能家电让生活更便捷</p>',
    forwardCount: 35
  },
  {
    id: 5,
    categoryId: 5,
    title: '时尚穿搭秀',
    pic: generateImageUrl(605),
    productCount: 40,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 150,
    readCount: 1500,
    commentCount: 75,
    albumPics: generateImageUrl(605),
    description: '潮流服饰，展现个性风采',
    showStatus: 1,
    content: '<h1>时尚穿搭秀</h1><p>最新潮流服饰，让您成为街头焦点</p>',
    forwardCount: 50
  },
  {
    id: 6,
    categoryId: 6,
    title: '美妆护肤馆',
    pic: generateImageUrl(606),
    productCount: 35,
    recommendStatus: 1,
    createTime: '2024-01-01',
    collectCount: 200,
    readCount: 2000,
    commentCount: 100,
    albumPics: generateImageUrl(606),
    description: '美丽从这里开始',
    showStatus: 1,
    content: '<h1>美妆护肤馆</h1><p>精选美妆护肤产品，让您焕发自信光彩</p>',
    forwardCount: 60
  },
  {
    id: 7,
    categoryId: 7,
    title: '健康食品专区',
    pic: generateImageUrl(607),
    productCount: 50,
    recommendStatus: 1,
    createTime: '2024-01-15',
    collectCount: 80,
    readCount: 800,
    commentCount: 40,
    albumPics: generateImageUrl(607),
    description: '健康生活，从饮食开始',
    showStatus: 1,
    content: '<h1>健康食品专区</h1><p>精选健康食品，守护家人健康</p>',
    forwardCount: 25
  },
  {
    id: 8,
    categoryId: 8,
    title: '母婴用品大全',
    pic: generateImageUrl(608),
    productCount: 60,
    recommendStatus: 1,
    createTime: '2024-02-01',
    collectCount: 180,
    readCount: 1800,
    commentCount: 90,
    albumPics: generateImageUrl(608),
    description: '宝宝成长每一步，我们都在',
    showStatus: 1,
    content: '<h1>母婴用品大全</h1><p>为宝宝提供最好的成长陪伴</p>',
    forwardCount: 45
  },
  {
    id: 9,
    categoryId: 9,
    title: '运动健身专场',
    pic: generateImageUrl(609),
    productCount: 45,
    recommendStatus: 1,
    createTime: '2024-02-15',
    collectCount: 120,
    readCount: 1200,
    commentCount: 65,
    albumPics: generateImageUrl(609),
    description: '运动改变生活，健康成就未来',
    showStatus: 1,
    content: '<h1>运动健身专场</h1><p>专业运动装备，助您达成健身目标</p>',
    forwardCount: 35
  },
  {
    id: 10,
    categoryId: 10,
    title: '汽车用品精选',
    pic: generateImageUrl(610),
    productCount: 30,
    recommendStatus: 1,
    createTime: '2024-03-01',
    collectCount: 60,
    readCount: 600,
    commentCount: 30,
    albumPics: generateImageUrl(610),
    description: '让爱车更贴心，让出行更安心',
    showStatus: 1,
    content: '<h1>汽车用品精选</h1><p>精选汽车用品，提升驾驶体验</p>',
    forwardCount: 20
  }
]

export default mallMockApi
