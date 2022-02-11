<template>
  <div class="page">
    <div class="drop-container">
      <div class="logo" v-show="selectedCompany.logo">
        <img width="100%" :src="selectedCompany.logo" />
      </div>

      <div class="intro">
        <h3 for="avatar">Upload your stocksheet</h3>
        <small>So your resellers can access your stock</small>
        <br />
      </div>

      <div class="company-name dropbox-section" v-if="!isAdmin">
        <h4>{{ selectedCompany.name }}</h4>
      </div>

      <div class="dropbox-section company_select" v-if="isAdmin">
        <label for="companies">Choose a company</label>
        <select
          name="companies"
          id="companies"
          class="company-input"
          @change="whenCompanySelect"
        >
          <option v-if="companies.length === 0">loading companies...</option>
          <option
            v-for="company in companies"
            :value="company._id"
            :key="company._id"
          >
            {{ company.name }}
          </option>
        </select>
      </div>

      <div class="dropbox-section" v-show="step >= 1">
        <label>Choose a file</label>
        <small>we support csv and xlsx files</small>

        <input
          id="file_input"
          name="file"
          type="file"
          accept=".csv,application/vnd.ms-excel,.xlt,application/vnd.ms-excel,.xla,application/vnd.ms-excel,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xltx,application/vnd.openxmlformats-officedocument.spreadsheetml.template,.xlsm,application/vnd.ms-excel.sheet.macroEnabled.12,.xltm,application/vnd.ms-excel.template.macroEnabled.12,.xlam,application/vnd.ms-excel.addin.macroEnabled.12,.xlsb,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
          class="file-input"
          value="Choose a file"
          @click="(e) => (e.target.value = null)"
        />
        <div mt-1 v-show="stock.lastModifiedDate">
          File date: {{ this.stock.lastModifiedDate }}
        </div>
      </div>

      <div class="dropbox-section" v-show="step == 3">
        <!-- <label>Csv read successfully</label> -->
        <button class="sync-button" @click="whenSyncClicked" type="button">
          <span v-show="!isStockPutLoading">
            Sync {{ selectedCompany.name }} stock
            <div>
              <b>{{ stock.records.length }} items</b>
            </div>
          </span>
          <span v-show="isStockPutLoading">uploading...</span>
        </button>

        <p v-show="isStockPutError" style="color: red; margin-top: 8px">
          There was an error uploading this sheet
        </p>
      </div>

      <div class="dropbox-section" v-show="step >= 4">
        <label style="color: green; font-weight: 600">
          Csv upload / sync was successful for
          {{ stock.records.length }} records
        </label>
        <br />
        find the data here:

        <br />
        <button @click="step = 1" class="reset-button" type="button">
          <span>upload another?</span>
        </button>
      </div>
    </div>

    <div class="drop-container loading" v-show="isLoading"></div>

    <div class="drop-container error" v-show="error" v-html="error"></div>

    <div class="background">
      <div class="background-content">
        <xmp id="json_output" v-show="json_ui_output.length > 0">{{
          JSON.stringify(json_ui_output, null, 2)
        }}</xmp>
      </div>
    </div>
  </div>
</template>

<script>
import uploadvue from "./upload";
export default uploadvue;
</script>

<style lang="scss">
@import "./upload.scss";
</style>