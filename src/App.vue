<template>
  <div id="app">
    <!--<component :is="component"></component>-->
    <router-view></router-view>
    <br><br>
    <div class="footer">&copy; 2018 HDF <span style="font-size: 70%;">(Build: 2018.10.19)</span></div>
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
#app > div:first-child {
  min-height: calc(100vh - 4.2em);
}
html, body {
  margin: 0;
  height: 100%;
}
body {
  background: linear-gradient(150deg,#281080 -5%,#8f6ed5 70%,#d782e0 94%);
  background-attachment: fixed;
}
.footer {
  background: #fff5;
  width: 100%;
  padding: 5px 0 5px 0;
  bottom: 0;
}
.v--modal-box {
  box-shadow: 4px 2px 4px rgba(0, 0, 0, .6), 0 20px 60px -2px rgba(27, 33, 58, 0.4) !important;
}
.lastChanged {
  color: #bbbb;
  font-size: smaller;
}
</style>
