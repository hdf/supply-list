<template>
  <div>
    <login></login>
    <div class="title"><h1>{{ $t('title') }}</h1></div>
    <div class="box">
      <p>{{ $t('details1') }}</p>
      <p>{{ $t('details2') }}</p>
    </div>
  </div>
</template>

<script>
import login from './login'

export default {
  name: 'reg',
  components: {
    login
  },
  data () {
    return { }
  }
}
</script>

<style scoped>
h1 {
  margin: 0;
  padding: 20px;
  text-shadow: 1px 1px #000;
  color: #222;
}
.box {
  margin: auto;
  width: 50%;
  padding: 5px 20px 10px 20px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  text-align: left;
  font-size: 120%;
  text-shadow: 1px 1px #444;
  font-family: "Open Sans", sans-serif;
}
.title {
  margin: 5%;
  display: inline-block;
  border-radius: 18px;
  box-shadow: 0 0 3px rgba(0, 0, 0, .6);
  box-sizing: content-box;
  background-color: rgba(255, 255, 255, 0.06);
}
</style>
