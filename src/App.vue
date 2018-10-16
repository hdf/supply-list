<template>
  <div id="app">
    <!--<component :is="component"></component>-->
    <router-view></router-view>
    <br>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return { }
  }
}
</script>

<style>
#app {
  margin: 0;
  text-align: center;
  font-family: Georgia,Cambria,"Times New Roman",Times,serif;
  box-sizing: border-box;
}
html, body {
  margin: 0;
  height: 100%;
}
body {
  background: linear-gradient(150deg,#281080 -5%,#8f6ed5 70%,#d782e0 94%);
  background-attachment: fixed;
}
.v--modal-box {
  box-shadow: 4px 2px 4px rgba(0, 0, 0, .6), 0 20px 60px -2px rgba(27, 33, 58, 0.4) !important;
}
.lastChanged {
  color: #bbbb;
  font-size: smaller;
}
</style>
