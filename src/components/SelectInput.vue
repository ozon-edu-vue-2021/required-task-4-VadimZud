<template>
  <div>
    <input
      class="input"
      v-model="display"
      @focus="onfocus"
      @blur="onblur"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <ul v-if="opened" class="options">
      <li v-if="isLoading" class="loader"></li>
      <template v-else>
        <li
          v-for="option in options"
          :key="option.value"
          class="option"
          :class="{ preselected: preselectedOption === option }"
          @click="selectOption(option)"
        >
          {{ option.display }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SelectInput",
  inheritAttrs: false,
  props: {
    loadOptionsFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      opened: false,
      preselectedOption: null,
      value: null,
      display: "",
      options: [],
      isLoading: false,
    };
  },
  methods: {
    loadOptions() {
      this.isLoading = true;

      if (this.loader) {
        clearTimeout(this.loader);
      }

      this.loader = setTimeout(async () => {
        console.log("Загрузка опций начата");
        this.loader = null;
        this.controller = AbortController();
        try {
          this.options = await this.loadOptionsFunc(
            this.display,
            this.controller
          );
          console.log("Загрузка опций завершена");
        } catch (e) {
          if (e.name === "AbortError") {
            console.log("Загрузка опций прервана");
          } else {
            console.log("Загрузка опций прекращена с ошибкой");
            this.$notify({
              group: "main",
              type: "error",
              title: e.name,
              text: e.message,
            });
          }
        } finally {
          this.controller = null;
        }
      }, 500);
    },
  },
};
</script>