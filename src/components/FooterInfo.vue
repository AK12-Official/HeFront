<!-- src/components/FooterInfo.vue -->
<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 左侧 联系方式 -->
      <div class="footer-section left">
        <div>地址：中南大学湘雅医院</div>
        <div>电话：XXXXXXXXXX</div>
        <div>邮箱：XXXXXXXXXX</div>
        <div class="footer-icons">
          <span class="icon wechat"></span>
          <span class="icon qq"></span>
        </div>
        <div class="footer-links">
          友情链接：
          <a href="https://www.baidu.com/">百度</a> |
          <a href="https://www.sina.com.cn/">新浪</a> |
          <a href="https://www.163.com/">网易</a>
        </div>
      </div>
      <!-- 中间 项目介绍 -->
      <div class="footer-section center">
        <div><a href="#">项目介绍</a></div>
        <div><a href="#">平台介绍</a></div>
        <div><a href="#">团队介绍</a></div>
        <div><a href="#">关于我们</a></div>
      </div>
      <!-- 右侧 服务范围 -->
      <div class="footer-section right">
        <div><a href="#">服务范围</a></div>
        <div><a href="#">平台成果</a></div>
        <div><a href="#">新闻动态</a></div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #222;
  color: #fff;
  padding: 40px 0 20px 0;
  font-size: 14px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 60px;
  padding-right: 40px;
}

.footer-section.center {
  margin-left: auto;
  margin-right: 80px;
}

.footer-section a {
  color: #fff;
  text-decoration: none;
  margin-right: 8px;
}

.footer-section a:hover {
  text-decoration: underline;
}

.footer-icons {
  margin: 10px 0;
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #444;
  border-radius: 50%;
  margin-right: 8px;
}

.wechat::before {
  content: "微";
  display: inline-block;
  color: #fff;
  font-size: 14px;
  text-align: center;
  width: 100%;
}

.qq::before {
  content: "Q";
  display: inline-block;
  color: #fff;
  font-size: 14px;
  text-align: center;
  width: 100%;
}
</style>