<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

h5 {
  margin: 0;
}
p {
  margin: 0;
}

* {
  box-sizing: border-box;
}

[mt-1] {
  margin-top: 4px;
}

#app {
  /* max-width: 760px; */
  color: #4a4a4a;
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
}
</style>
