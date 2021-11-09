<template>
  <div class="select-object">
    <label>
      <div v-if="label" class="label">
        {{ label }}
      </div>
      <div
        class="display"
        :class="{ error }"
        tabindex="0"
        ref="display"
        @keydown.enter.prevent="activate"
        @click="toogleActive"
      >
        <span class="display-text">{{ display }}</span>
      </div>
    </label>
    <div v-if="error" class="error-text">
      {{ error }}
    </div>
    <div class="options" v-if="active">
      <div class="filter">
        <input
          type="text"
          v-model="filter"
          ref="filter"
          @keydown.enter.prevent="selectOption(selected)"
          @keydown.esc="deactivateWithoutBlur"
          @keydown.up="selectedPrev"
          @keydown.down="selectedNext"
          @blur="deactivate"
        />
      </div>
      <div class="loader" v-if="isLoading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <template v-else>
        <div
          class="option"
          v-for="option in options"
          :key="toKey(option)"
          :class="{ selected: option === selected }"
          @mousedown.left="selectOption(option)"
        >
          {{ toDisplay(option) }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// Компонент для выбора из динамически подгружаемого
// списка объектов
export default {
  name: "SelectObject",
  props: {
    value: {
      type: Object,
      default: new Object(),
    },
    // toDisplay(object)
    // Возвращает строку для визуального представления объекта
    toDisplay: {
      type: Function,
      required: true,
    },
    // toKey(object)
    // Возвращает уникальный идентификатор объекта
    toKey: {
      type: Function,
      required: true,
    },
    // loadOptionsFunc(filter, controller)
    // Асинхронная функция, загружает объекты для выбора с сервера
    // controller - это объект типа AbortController
    loadOptionsFunc: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Выберите значение",
    },
  },
  data() {
    return {
      active: false,
      filter: "",
      options: [],
      isLoading: false,
      selected: null,
    };
  },
  computed: {
    display() {
      return this.value ? this.toDisplay(this.value) : this.placeholder;
    },
  },

  methods: {
    async loadOptions() {
      this.timeout = null;
      this.controller = new AbortController();
      try {
        this.options = await this.loadOptionsFunc(this.filter, this.controller);
        if (this.options.length) {
          this.selected = this.options[0];
        }
        this.controller = null;
      } catch (e) {
        if (e.name !== "AbortError") {
          this.$notify({
            group: "main",
            type: "error",
            title: e.name,
            text: e.message,
          });
          this.controller = null;
        }
      } finally {
        this.isLoading = false;
      }
    },

    abortLoading() {
      if (this.controller) {
        this.controller.abort();
        this.controller = null;
      }
    },

    activateOptions() {
      this.isLoading = true;
      this.options = [];
      this.selected = null;
      this.loadOptions();
    },

    deactivateOptions() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      } else {
        this.abortLoading();
      }
    },

    filterOptions() {
      this.isLoading = true;
      this.options = [];
      this.selected = null;
      if (this.timeout) {
        clearTimeout(this.timeout);
      } else {
        this.abortLoading();
      }
      this.timeout = setTimeout(this.loadOptions, 500);
    },

    activate() {
      if (!this.active) {
        this.active = true;
        this.activateOptions();
        this.$refs.display.tabIndex = -1;
        this.$nextTick(() => {
          this.$refs.filter.focus();
        });
      }
    },

    deactivate() {
      if (this.active) {
        this.active = false;
        this.deactivateOptions();
        this.$refs.display.tabIndex = 0;
      }
    },

    deactivateWithoutBlur() {
      if (this.active) {
        this.deactivate();
        this.$refs.display.focus();
      }
    },

    toogleActive() {
      if (this.active) {
        this.deactivateWithoutBlur();
      } else {
        this.activate();
      }
    },

    selectOption(option) {
      if (option) {
        this.$emit("input", option);
      }
      this.deactivateWithoutBlur();
    },

    selectedPrev() {
      if (this.active && this.selected) {
        const index = this.options.findIndex(
          (option) => option === this.selected
        );
        if (index > 0) {
          this.selected = this.options[index - 1];
        }
      }
    },

    selectedNext() {
      if (this.active && this.selected) {
        const index = this.options.findIndex(
          (option) => option === this.selected
        );
        if (index !== -1 && index < this.options.length - 1) {
          this.selected = this.options[index + 1];
        }
      }
    },
  },
  watch: {
    filter() {
      this.filterOptions();
    },
  },
};
</script>

<style scoped>
.display {
  border: 1px solid #999;
  border-radius: 3px;
  width: fit-content;
  padding: 5px;
  cursor: pointer;
}

.display.error {
  border-color: red;
}

.display:focus {
  border-color: blue;
  outline: none;
}

.label {
  color: #999;
  margin-bottom: 5px;
}

.error-text {
  color: red;
  font-size: 10px;
}

.select-object {
  position: relative;
}

.options {
  position: absolute;
  top: 50px;
}

.option,
.loader {
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

.option.selected {
  background-color: #aaa;
}

.loader {
  display: inline-block;
  position: relative;
  width: 150px;
  height: 22px;
  padding: 0;
}
.loader div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  margin: 2px 67px;
  border: 2px solid #000;
  border-radius: 50%;
  animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000 transparent transparent transparent;
}
.loader div:nth-child(1) {
  animation-delay: -0.45s;
}
.loader div:nth-child(2) {
  animation-delay: -0.3s;
}
.loader div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>