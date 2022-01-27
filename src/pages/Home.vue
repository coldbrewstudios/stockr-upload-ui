<template>
  <div class="page">
    <div class="drop-container">
      <h3 for="avatar">Upload your stocksheet</h3>
      <small>we support csv and xlsx</small>
      <br />

      <div class="company_select">
        <label for="companies">Choose a company</label>
        <br />
        <select name="companies" id="companies" class="company-input">
          <option v-if="companies.length === 0">loading companies...</option>
          <option
            v-for="company in companies"
            :value="company._id"
            :key="company._id"
            @click="whenCompanySelect(company)"
          >
            {{ company.name }}
          </option>
        </select>
      </div>

      <div v-show="step >= 1">
        <br />
        <label>Choose a file</label>
        <br />
        <input
          id="file_input"
          name="file"
          type="file"
          accept=".csv,application/vnd.ms-excel,.xlt,application/vnd.ms-excel,.xla,application/vnd.ms-excel,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xltx,application/vnd.openxmlformats-officedocument.spreadsheetml.template,.xlsm,application/vnd.ms-excel.sheet.macroEnabled.12,.xltm,application/vnd.ms-excel.template.macroEnabled.12,.xlam,application/vnd.ms-excel.addin.macroEnabled.12,.xlsb,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
          class="file-input"
          value="Choose a file"
        />
      </div>

      <div v-show="step == 3">
        <br />
        <label>Csv read successfully</label>
        <br />
        <button class="sync-button" @click="whenSyncClicked" type="button">
          <span v-show="!isStockPutLoading"
            >Click here to sync {{ selectedCompany.name }} stock</span
          >
          <span v-show="isStockPutLoading">uploading...</span>
        </button>
      </div>

      <div v-show="step >= 4">
        <br />
        <label style="color: green; font-weight: 600"
          >Csv upload / sync was successful</label
        >
        <br />
        <button class="sync-button" @click="step = 1" type="button">
          Click here to upload another
        </button>
      </div>
    </div>

    <xmp id="json_output">{{ json_ui_output }}</xmp>
  </div>
</template>

<script>
// https://github.com/sheetjs/sheetjs
import XLSX from "xlsx";

// vue
const Vue = {
  name: "upload",

  data: () => ({
    stock: [],
    companies: [],
    step: 1,
    selectedCompany: {},
    isStockPutLoading: false,
  }),

  computed: {
    json_ui_output() {
      return JSON.stringify(this.stock, null, 2);
    },
  },

  watch: {
    step(cv) {
      if (cv === 1) {
        this.stock = [];
        this.selectedCompany = {};
      }
    },
  },

  methods: {
    GET_COMPANIES() {
      return http(`/companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch(console.log);
    },
    INSERT_STOCK(company_id, stock_as_json) {
      return http(`/stock?company_id=${company_id}`, {
        method: "PUT",
        body: JSON.stringify(stock_as_json),
      })
        .then((res) => res.json())
        .catch(console.log);
    },

    whenCompanySelect(company) {
      this.stock = [];
      this.selectedCompany = company || {};
      if (company && company._id) {
        this.step = 2;
      }
    },

    whenFileSelected(evt) {
      let f = evt.target.files[0];
      this.step = 2;

      if (f) {
        let r = new FileReader();

        r.onload = (e) => {
          const file = e.target.result;

          const workbook = XLSX.read(file, {
            type: "binary",
          });

          let result = [];

          workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              // header: 1,
              // dateNF: "FMT 14",
              // defval: null,
              raw: false,
              blankrows: false,
            });
            if (roa.length) result = roa;
          });

          // in case something falls over, we still need error handling
          if (result.length > 0) {
            this.stock = result;
            this.step = 3;
          }
        };

        r.readAsBinaryString(f);
      } else {
        console.log("Failed to load file");
      }
    },

    whenSyncClicked() {
      this.isStockPutLoading = true;
      this.INSERT_STOCK(this.selectedCompany._id, this.stock)
        .then((res) => {
          this.step = 4;
          this.isStockPutLoading = false;
        })
        .catch(() => {
          this.isStockPutLoading = false;
        });
    },
  },
  async mounted() {
    let file = document.getElementById("file_input");
    file.addEventListener("change", this.whenFileSelected);

    this.companies = await this.GET_COMPANIES();
    if (this.companies && this.companies.length > 0) {
      this.selectedCompany = this.companies[0];
      this.step = 2;
    }
  },
};

// api functions
function http(url, options) {
  return fetch(`https://booqnly-stockr.herokuapp.com/api/v1${url}`, options);
}

// export
export default Vue;
</script>

<style lang="scss">
.page {
  height: 100vh;
  padding: 8%;
}

.drop-container {
  padding: 40px;
  border: 2px solid #ebebeb;

  h3 {
    margin: 0;
    font-weight: 400;
  }

  .company-input,
  .file-input,
  .sync-button {
    margin-top: 5px;
  }

  .company_select {
    padding-top: 10px;
  }
  .company_select label {
    padding-bottom: 10px;
  }
  .company_select select.company_select {
    width: auto;
    min-width: 200px;
  }
}
</style>