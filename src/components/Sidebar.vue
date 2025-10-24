<template>
    <aside class="side-bar" :class="{collapsed: collapsed }">
      <div class="s">
        <div class="logo"></div>
        <h2 class="name-web" v-if="!collapsed">MangaAdmin</h2>
      </div>

      <nav class="nav">
        <router-link to="/" class="nav-item">
          <div class="img logo-home"></div>
          <span v-if="!collapsed">Trang chủ</span>
        </router-link>

        <router-link to="/truyen" class="nav-item">
          <div class="img logo-book"></div>
          <span v-if="!collapsed">Quản lý truyện</span>
        </router-link>

        <a href="#" class="nav-item">
          <div class="img logo-users"></div>
          <span v-if="!collapsed">Quản lý người dùng</span>
        </a>
        <a href="#" class="nav-item">
          <div class="img logo-setting"></div>
          <span v-if="!collapsed">Cài đặt</span>
        </a>
      </nav>
    </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    collapsed: Boolean
  }
}
</script>

<style scoped>
.side-bar {
  width: 240px;
  background: #ffffff;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: #e8f0fe solid 2px;
  transition: width 0.3s ease;
  overflow: hidden;
}

.side-bar.collapsed {
  width: 60px;
}

.s {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.logo {
  width: 40px;
  height: 40px;
  background: url(../assets/logo-web-admin.svg) no-repeat center/contain;
}

.name-web {
  color: #2f5492;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  text-decoration: none;
  color: #828292;
  padding: 15px;
  border-radius: 8px;
  transition: 0.3s;
  display: flex;
  align-items: center;
}

.nav-item:hover {
  background-color: #cadcfa;
  color: #2f5492;
}

.img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  margin-bottom: 5px;
}

.logo-home {
  background: url(../assets/logo-home.svg) no-repeat center/contain;
}
.logo-book {
  background: url(../assets/logo-book.svg) no-repeat center/contain;
}
.logo-users {
  background: url(../assets/logo-users.svg) no-repeat center/contain;
}
.logo-setting {
  background: url(../assets/logo-setting.svg) no-repeat center/contain;
}
/* Khi router-link đang active */
.nav-item.router-link-exact-active {
  background-color: #cadcfa;
  color: #2f5492;
  font-weight: 600;
}

/* Icon và text đổi màu khi active */
.nav-item.router-link-exact-active .img {
  filter: brightness(0) saturate(100%) invert(24%) sepia(85%) saturate(1212%) hue-rotate(200deg) brightness(95%) contrast(91%);
}

</style>
