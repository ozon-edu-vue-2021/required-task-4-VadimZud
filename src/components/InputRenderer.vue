<template>
  <div>
    <label>
      <div v-if="label" class="label">
        {{ label }}
      </div>
      <div class="input" :class="{ focused, error }">
        <slot></slot>
      </div>
    </label>
    <div v-if="error" class="error-text">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "InputRenderer",
  props: {
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    focus() {
      this.focused = true;
    },
    blur() {
      this.focused = false;
    },
  },
  mounted() {
    this.input = this.$el.querySelector("input");
    if (this.input) {
      this.input.addEventListener("focus", this.focus);
      this.input.addEventListener("blur", this.blur);
    }
  },
  beforeUnmount() {
    if (this.input) {
      this.input.removeEventListener("focus", this.focus);
      this.input.removeEventListener("blur", this.blur);
    }
  },
};
</script>

<style scoped>
.input {
  border: 1px solid #999;
  border-radius: 3px;
  width: fit-content;
  padding: 5px;
}

.input.error {
  border-color: red;
}

.input.focused {
  border-color: blue;
}

.input >>> input {
  background-color: transparent;
  border: none;
  outline: none;
  color: #444;
}

.label {
  color: #999;
  margin-bottom: 5px;
}

.error-text {
  color: red;
  font-size: 10px;
}
</style>
