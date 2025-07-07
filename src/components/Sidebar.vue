<template>
  <nav class="sidebar">
    <div class="logo">

      <img src="@/assets/Logo/csulogo.svg" alt="Logo" />
    </div>
    <ul class="menu">
      <li class="menu-item active">
        <i class="iconfont">&#xe600;</i>
        <span>主页</span>
      </li>
      <li class="menu-item">
        <i class="iconfont">&#xe601;</i>
        <span>推荐</span>
      </li>
      <li class="menu-item">
        <i class="iconfont">&#xe602;</i>
        <span>我的</span>
      </li>

    </ul>
  </nav>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.sidebar {
  width: 90px;
  background: #181823;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 200;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 32px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-item {
  width: 100%;
  color: #fff;
  font-size: 16px;
  padding: 16px 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover, &.active {
    background: #23233a;
    color: #00eaff;
  }
  i {
    font-size: 24px;
    margin-bottom: 6px;
  }
}
</style>
