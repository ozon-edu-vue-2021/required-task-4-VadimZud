<template>
  <div id="app">
    <notifications group="main" />
    <Form />
    <input-renderer label="Label" error="123">
      <input />
    </input-renderer>
    <input-renderer label="Label" error="123">
      <select-input
        :loadOptionsFunc="loadOptions"
        :loadDisplayByValueFunc="loadDisplayByValue"
        value="4530"
      />
    </input-renderer>
  </div>
</template>

<script>
import Form from "./components/Form.vue";
import InputRenderer from "./components/InputRenderer.vue";
import SelectInput from "./components/SelectInput.vue";
import {
  loadCitizenshipsOptions,
  loadCitizenshipsDisplayByValue,
} from "./helpers/DataLoaders";

export default {
  name: "App",
  components: {
    Form,
    InputRenderer,
    SelectInput,
  },
  methods: {
    loadOptions: loadCitizenshipsOptions,
    loadDisplayByValue: loadCitizenshipsDisplayByValue,
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
