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
    return {
    }
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
</style>
