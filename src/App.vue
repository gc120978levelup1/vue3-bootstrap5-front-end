<template>
  <!-- 
  <nav class="d-flex sticky-top">
    <div class="container d-flex">
      <div class="p-2 bg-white">
        <img
          width="60px"
          height="60px"
          src="@/assets/JAEDWEBSITE_03.jpg"
          alt="image file"
        />
      </div>
      <div class="d-flex ms-auto mt-auto mb-auto m-2 nav-menu-bar">
        <div class="d-flex">
          <router-link to="/">Home</router-link>&nbsp;|&nbsp;
        </div>
        <div class="d-flex">
          <router-link to="/home2">Home2</router-link>&nbsp;|&nbsp;
        </div>
        <div class="d-flex">
          <router-link to="/home3">Home3</router-link>&nbsp;|&nbsp;
        </div>
        <div class="d-flex">
          <router-link to="/home4">Home4</router-link>&nbsp;|&nbsp;
        </div>
        <div><router-link to="/about">About</router-link></div>
      </div>
    </div>
  </nav>
  -->
  <router-view />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.brand-logo {
}
nav {
  background-color: white;
  margin: 0;

  .nav-menu-bar {
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    &.router-link-exact-active {
      color: #42b983;
      text-decoration: underline;
    }
  }
}
</style>
