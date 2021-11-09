<template>
  <div class="select-input">
    <input
      class="input"
      v-model="display"
      :disabled="displayIsLoading"
      @click="toogleOptions"
      @keydown.enter.prevent="onenter"
      @keydown.up="preselectPrevOption"
      @keydown.down="preselectNextOption"
      @blur="onblur"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <span v-if="displayIsLoading" class="display-loader">
      <loader class="loader" />
    </span>
    <span v-else class="triangle">
      <triangle class="triangle" />
    </span>
    <ul v-show="opened" class="options">
      <li v-if="optionsIsLoading" class="options-loader"><loader /></li>
      <template v-else>
        <!-- Использование mousedown вместо click возможно не самый
        лучший вариант, но оно происходит раньше события blur на input'е
        и позволяет позже использовать blur для скрытия dropdown'а.
        Использование событий click в связке с директивами типа
        v-click-outside тоже является решением, но при этом input
        не очень естественно ведет себя при управлении с клавиатуры
        (например, перемещение при помощи Tab) -->
        <li
          v-for="option in options"
          :key="option.value"
          class="option"
          :class="{ preselected: preselectedOption === option }"
          @mousedown.left="selectOption(option)"
        >
          {{ option.display }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Loader from "../assets/images/loader.svg";
import Triangle from "../assets/images/triangle.svg";

export default {
  name: "SelectInput",
  inheritAttrs: false,
  props: {
    loadOptionsFunc: {
      type: Function,
      required: true,
    },
    loadDisplayByValueFunc: {
      type: Function,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      opened: false,
      preselectedOption: null,
      displayIsLoading: false,
      display: "",
      options: [],
      optionsIsLoading: false,
    };
  },
  async created() {
    // Хранилище для контроллеров прерывания запросов к API (AbortController)
    // Использовать только одну переменную опасно, так как не совсем ясно
    // гарантировано ли, что исключение на старом обращении к API обработается
    // раньше запуска нового обращения. Если так произойдет, то новое обращение
    // может записать в такую переменную свой контроллер, а после, исключение
    // на старом обращении, подчищая за собой этот контроллер может испортить.
    // Поэтому лучше будем хранить множество контроллеров для каждого обращения,
    // а, подчищая за собой, обработчики смогут просто удалять свои контроллеры
    // из этого множества.
    this.controllers = new Set();
    this.syncDisplayValue();
  },

  methods: {
    onenter() {
      if (this.opened) {
        this.selectOption();
        this.closeOptions();
      } else {
        this.openOptions();
      }
    },

    async onblur() {
      this.closeOptions();
      if (!this.displayValueSynced) {
        this.syncDisplayValue();
      }
    },

    async syncDisplayValue() {
      this.displayIsLoading = true;
      this.disableUpdate = true;
      if (this.value) {
        try {
          this.display = await this.loadDisplayByValueFunc(this.value);
        } catch (e) {
          this.$notify({
            group: "main",
            type: "error",
            title: e.name,
            text: e.message,
          });
          this.display = "";
          this.disableUpdate = false;
        }
      } else {
        this.value = "";
      }
      this.displayIsLoading = false;
      this.displayValueSynced = true;
    },

    setOptions(options) {
      this.options = options;
      this.preselectedOption = options.length ? options[0] : null;
      this.optionsIsLoading = false;
    },

    abortLoadingOptions() {
      if (this.loader) {
        clearTimeout(this.loader);
        this.loader = null;
      }
      for (let controller of this.controllers) {
        controller.abort();
      }
    },

    async loadOptions() {
      this.abortLoadingOptions();

      const controller = new AbortController();
      this.controllers.add(controller);

      try {
        this.setOptions(await this.loadOptionsFunc(this.display, controller));
      } catch (e) {
        if (e.name !== "AbortError") {
          this.$notify({
            group: "main",
            type: "error",
            title: e.name,
            text: e.message,
          });
        }
        this.setOptions([]);
      } finally {
        this.controllers.delete(controller);
        this.optionsIsLoading = false;
      }
    },

    debouncedLoadOptions() {
      this.abortLoadingOptions();

      this.loader = setTimeout(this.loadOptions, 500);
    },

    selectOption(option = null) {
      if (!option) {
        option = this.preselectedOption;
      }

      if (option) {
        this.disableUpdate = true;
        this.display = option.display;
        this.$emit("input", option.value);
        this.displayValueSynced = true;
      }
    },

    openOptions() {
      this.optionsIsLoading = true;
      this.loadOptions();
      this.opened = true;
    },

    closeOptions() {
      this.abortLoadingOptions();
      this.opened = false;
    },

    toogleOptions() {
      if (this.opened) {
        this.closeOptions();
      } else {
        this.openOptions();
      }
    },

    preselectNextOption() {
      if (this.opened && !this.optionsIsLoading && this.preselectedOption) {
        const index = this.options.findIndex(
          (it) => it === this.preselectedOption
        );
        if (index !== -1 && index < this.options.length - 1) {
          this.preselectedOption = this.options[index + 1];
        }
      }
    },

    preselectPrevOption() {
      if (this.opened && !this.optionsIsLoading && this.preselectedOption) {
        const index = this.options.findIndex(
          (it) => it === this.preselectedOption
        );
        if (index > 0) {
          this.preselectedOption = this.options[index - 1];
        }
      }
    },
  },
  watch: {
    display() {
      if (this.disableUpdate) {
        this.disableUpdate = false;
        return;
      }

      this.displayValueSynced = false;
      this.optionsIsLoading = true;
      this.debouncedLoadOptions();
      if (!this.opened) {
        this.opened = true;
      }
    },
  },

  components: {
    Loader,
    Triangle,
  },
};
</script>

<style scoped>
.select-input {
  position: relative;
}

.options {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 20px;
}

.option,
.options-loader {
  list-style-type: none;
  margin: 0;
  padding: 5px;
  border: 1px solid #aaa;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
}

.option:hover {
  background-color: #ddd;
}

.option.preselected {
  background-color: #aaa;
}
</style>