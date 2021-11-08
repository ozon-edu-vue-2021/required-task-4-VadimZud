<template>
  <div id="app">
    <notifications group="main" />
    <Form />
    <input-renderer label="Label" error="123">
      <input />
    </input-renderer>
  </div>
</template>

<script>
import Form from "./components/Form.vue";
import InputRenderer from "./components/InputRenderer.vue";

export default {
  name: "App",
  components: {
    Form,
    InputRenderer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: #fafafa;
  padding: 24px;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}
</style>
