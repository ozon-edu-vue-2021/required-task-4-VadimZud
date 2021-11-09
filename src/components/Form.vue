<template>
  <div class="form">
    <form>
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
            <input type="text" v-model="form.email" />
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
          <div v-if="form.citizenship.id === 8604" class="row">
            <input-renderer label="Серия" :error="errors['passportSeries']">
              <input type="text" v-model="form.passportSeries" />
            </input-renderer>
            <input-renderer label="Номер" :error="errors['passportNumber']">
              <input type="text" v-model="form.passportNumber" />
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

.form {
}
</style>
