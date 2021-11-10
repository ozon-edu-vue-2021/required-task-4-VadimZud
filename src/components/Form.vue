<template>
  <div class="form">
    <form novalidate @submit.prevent="onsubmit">
      <fieldset>
        <legend>Личные данные</legend>
        <div class="row">
          <input-renderer label="Фамилия" :error="errors['secondname']">
            <input type="text" v-model="form.secondname" />
          </input-renderer>
          <input-renderer label="Имя" :error="errors['firstname']">
            <input type="text" v-model="form.firstname" />
          </input-renderer>
          <input-renderer label="Отчество" :error="errors['patronymic']">
            <input type="text" v-model="form.patronymic" />
          </input-renderer>
        </div>
        <div class="row">
          <input-renderer label="Дата рождения" :error="errors['birthdate']">
            <input type="date" v-model="form.birthdate" />
          </input-renderer>
        </div>
        <div class="row">
          <input-renderer label="E-mail" :error="errors['email']">
            <input type="email" v-model="form.email" />
          </input-renderer>
        </div>
      </fieldset>
      <fieldset>
        <legend>Пол</legend>
        <label>
          <input type="radio" name="sex" v-model="form.sex" value="male" />
          Мужской
        </label>
        <label>
          <input type="radio" name="sex" v-model="form.sex" value="female" />
          Женский
        </label>
      </fieldset>
      <fieldset>
        <legend>Паспортные данные</legend>
        <div class="row">
          <select-object
            v-model="form.citizenship"
            label="Гражданство"
            :error="errors['citizenship']"
            :toDisplay="(obj) => obj.nationality"
            :toKey="(obj) => obj.id"
            :loadOptionsFunc="loadCitizenships"
          />
        </div>
        <template v-if="form.citizenship">
          <div
            v-if="form.citizenship && form.citizenship.id === 8604"
            class="row"
          >
            <input-renderer label="Серия" :error="errors['passportSeries']">
              <input
                type="number"
                maxlength="4"
                v-model="form.passportSeries"
              />
            </input-renderer>
            <input-renderer label="Номер" :error="errors['passportNumber']">
              <input
                type="number"
                maxlength="6"
                v-model="form.passportNumber"
              />
            </input-renderer>
            <input-renderer label="Дата выдачи" :error="errors['passportDate']">
              <input type="date" v-model="form.passportDate" />
            </input-renderer>
          </div>
          <template v-else>
            <div class="row">
              <input-renderer
                label="Фамилия на латинице"
                :error="errors['latinSecondname']"
              >
                <input type="text" v-model="form.latinSecondname" />
              </input-renderer>
              <input-renderer
                label="Имя на латинице"
                :error="errors['latinFirstname']"
              >
                <input type="text" v-model="form.latinFirstname" />
              </input-renderer>
            </div>
            <div class="row">
              <input-renderer label="Номер" :error="errors['passportNumber']">
                <input type="text" v-model="form.passportNumber" />
              </input-renderer>
              <select-object
                v-model="form.passportCountry"
                label="Страна выдачи"
                :error="errors['passportCountry']"
                :toDisplay="(obj) => obj.nationality"
                :toKey="(obj) => obj.id"
                :loadOptionsFunc="loadCitizenships"
              />
              <select-object
                v-model="form.passportType"
                label="Тип паспорта"
                :error="errors['passportType']"
                :toDisplay="(obj) => obj.type"
                :toKey="(obj) => obj.id"
                :loadOptionsFunc="loadPassportTypes"
              />
            </div>
          </template>
        </template>
      </fieldset>
      <fieldset>
        <legend>Вы меняли фамилию или имя?</legend>
        <label>
          <input
            type="radio"
            name="nameChanged"
            v-model="form.nameChanged"
            value="no"
          />
          Нет
        </label>
        <label>
          <input
            type="radio"
            name="nameChanged"
            v-model="form.nameChanged"
            value="yes"
          />
          Да
        </label>
        <div v-if="form.nameChanged === 'yes'" class="row">
          <input-renderer
            label="Предыдущая фамилия"
            :error="errors['previousSecondname']"
          >
            <input type="text" v-model="form.previousSecondname" />
          </input-renderer>
          <input-renderer
            label="Предыдущее имя"
            :error="errors['previousFirstname']"
          >
            <input type="text" v-model="form.previousFirstname" />
          </input-renderer>
        </div>
      </fieldset>
      <input type="submit" />
    </form>
  </div>
</template>

<script>
import InputRenderer from "./InputRenderer.vue";
import SelectObject from "./SelectObject.vue";
import { loadCitizenships, loadPassportTypes } from "../helpers/DataLoaders";

export default {
  data() {
    return {
      form: {
        firstname: "",
        secondname: "",
        patronymic: "",
        birthdate: "",
        email: "",
        sex: "male",
        citizenship: null,

        passportSeries: "",
        passportNumber: "",
        passportDate: "",
        passportCountry: null,
        passportType: null,

        latinFirstname: "",
        latinSecondname: "",

        nameChanged: "no",
        previousFirstname: "",
        previousSecondname: "",
      },

      errors: {},
    };
  },
  methods: {
    loadCitizenships,
    loadPassportTypes,

    validateRequired(field) {
      if (!this.form[field]) {
        this.errors[field] = "Обязательное поле";
        this.err = true;
        return false;
      }
      return true;
    },

    validateCyrillic(field, required) {
      if (required && !this.validateRequired(field)) {
        return false;
      }
      if (this.form[field] && !/[а-яА-ЯёЁ]+/.test(this.form[field])) {
        this.errors[field] = "Используйте кириллицу";
        this.err = true;
        return false;
      }
      return true;
    },

    validateLatin(field, required) {
      if (required && !this.validateRequired(field)) {
        return false;
      }
      if (this.form[field] && !/[a-zA-Z]+/.test(this.form[field])) {
        this.errors[field] = "Используйте латиницу";
        this.err = true;
        return false;
      }
      return true;
    },

    validateDate(field, required) {
      if (required && !this.validateRequired(field)) {
        return false;
      }
      if (this.form[field]) {
        const date = new Date(this.form[field]);
        const now = new Date();
        if (now - date < 0) {
          this.errors[field] = "Дата не может быть в будущем";
          this.err = true;
          return false;
        }
      }
      return true;
    },

    validateEmail(field, required) {
      if (required && !this.validateRequired(field)) {
        return false;
      }
      if (this.form[field] && !/.*@.*/.test(this.form[field])) {
        this.errors[field] = "e-mail должен содержать @";
        this.err = true;
        return false;
      }
      return true;
    },

    validateNumber(field, length, required) {
      if (required && !this.validateRequired(field)) {
        return false;
      }
      if (
        this.form[field] &&
        !RegExp(`\\d{${length}}`).test(this.form[field])
      ) {
        this.errors[field] = `Введите ${length} цифр`;
        this.err = true;
        return false;
      }
      return true;
    },

    validateForm() {
      this.err = false;
      this.errors = {};

      this.validateCyrillic("firstname", true);
      this.validateCyrillic("secondname", true);
      this.validateCyrillic("firstname", false);
      this.validateDate("birthdate", true);
      this.validateEmail("email", true);
      this.validateRequired("citizenship");

      if (this.form.citizenship) {
        if (this.form.citizenship.id === 8604) {
          this.validateNumber("passportSeries", 4, true);
          this.validateNumber("passportNumber", 6, true);
          this.validateDate("passportDate", true);
          this.form.passportCountry = null;
          this.form.passportType = null;
          this.form.latinFirstname = "";
          this.form.latinSecondname = "";
        } else {
          this.validateRequired("passportNumber");
          this.validateRequired("passportCountry");
          this.validateRequired("passportType");
          this.validateLatin("latinFirstname", true);
          this.validateLatin("latinSecondname", true);
          this.form.passportSeries = "";
          this.form.passportDate = "";
        }
      }

      if (this.form.nameChanged === "yes") {
        this.validateCyrillic("previousFirstname", false);
        this.validateCyrillic("previousSecondname", false);
      } else {
        this.form.previousFirstname = "";
        this.form.previousSecondname = "";
      }
    },

    onsubmit() {
      this.validateForm();
      if (this.err) {
        this.$notify({
          group: "main",
          type: "error",
          title: "Данные не отправлены",
          text: "Исправьте ошибки, указанные в форме",
        });
      } else {
        this.$notify({
          group: "main",
          title: "Данные отправлены",
          text: "Посмотрите в консоль",
        });
        console.log(JSON.stringify(this.form));
      }
    },
  },
  components: {
    InputRenderer,
    SelectObject,
  },
};
</script>

<style scoped>
.row {
  display: flex;
  gap: 10px;
}
</style>
