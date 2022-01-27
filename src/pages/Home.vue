<template>
  <div class="page">
    <div class="drop-container">
      <h3 for="avatar">Upload your stocksheet</h3>
      <small>we support csv and xlsx</small>
      <br />

      <div class="dropbox-section company_select">
        <label for="companies">Choose a company</label>
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

      <div class="dropbox-section" v-show="step >= 1">
        <label>Choose a file</label>
        <input
          id="file_input"
          name="file"
          type="file"
          accept=".csv,application/vnd.ms-excel,.xlt,application/vnd.ms-excel,.xla,application/vnd.ms-excel,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xltx,application/vnd.openxmlformats-officedocument.spreadsheetml.template,.xlsm,application/vnd.ms-excel.sheet.macroEnabled.12,.xltm,application/vnd.ms-excel.template.macroEnabled.12,.xlam,application/vnd.ms-excel.addin.macroEnabled.12,.xlsb,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
          class="file-input"
          value="Choose a file"
          @click="(e) => (e.target.value = null)"
        />
      </div>

      <div class="dropbox-section" v-show="step == 3">
        <!-- <label>Csv read successfully</label> -->
        <button class="sync-button" @click="whenSyncClicked" type="button">
          <span v-show="!isStockPutLoading"
            >Sync {{ selectedCompany.name }} stock</span
          >
          <span v-show="isStockPutLoading">uploading...</span>
        </button>
      </div>

      <div class="dropbox-section" v-show="step >= 4">
        <label style="color: green; font-weight: 600"
          >Csv upload / sync was successful for
          {{ stock.length }} records</label
        >
        <br />
        <button class="sync-button" @click="step = 1" type="button">
          <span>upload another?</span>
        </button>
      </div>
    </div>

    <div class="background">
      <div class="background-content">
        <xmp id="json_output">{{ json_ui_output }}</xmp>
      </div>
    </div>
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
    INSERT_STOCK(company_id, stock_data) {
      return http(`/stock?company_id=${company_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(stock_data),
      })
        .then((res) => res.json())
        .catch(console.log);
    },

    whenCompanySelect(company) {
      this.stock = [];
      this.selectedCompany = company || {};
      if (company && company._id && this.step < 2) {
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
            const header = [];
            const columnCount =
              XLSX.utils.decode_range(workbook.Sheets[sheetName]["!ref"]).e.c +
              1;

            for (let i = 0; i < columnCount; ++i) {
              header[i] =
                workbook.Sheets[sheetName][`${XLSX.utils.encode_col(i)}1`].v;
            }

            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              // header: 1,
              // dateNF: "FMT 14",
              // defval: null,
              raw: false,
              blankrows: false,
            });

            if (roa.length)
              result = {
                headers: header,
                records: roa,
              };
          });

          // in case something falls over, we still need error handling
          if (result.headers.length > 0 && result.records.length > 0) {
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
        .then(() => {
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
  const baseURL = process.env.VUE_APP_API_BASE_URI
    ? process.env.VUE_APP_API_BASE_URI
    : "https://booqnly-stockr.herokuapp.com";
  return fetch(`${baseURL}/api/v1${url}`, options);
}

// export
export default Vue;
</script>

<style lang="scss">
.page {
  --font-color: #17181a;

  height: 100vh;
  padding: 12% 18%;
  display: flex;
  flex-direction: column;

  font-size: 16px;
  color: var(--font-color);
}

.drop-container {
  --padding: 20px;
  --blue: #409fff;

  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1), 0 10px 30px 0 rgba(0, 0, 0, 0.2);
  height: 25.625em;
  left: 5em;
  margin: -12.8125em 0 0;
  position: absolute;
  top: 50%;
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  width: 17.5em;
  z-index: 30;

  padding: var(--padding);

  label {
    font-size: inherit;
    line-height: 1;
    display: block;
  }

  h3 {
    display: block;
    margin: 0;
    font-size: 1.375em;
    font-weight: 400;
    line-height: 1;
  }

  .dropbox-section {
    font-size: 1em;
    font-weight: 400;
    line-height: 1;

    border-top: 1px solid #babcbf;

    padding: 0.65em 0.5em 0.7em 0.5em;
  }

  .company-input,
  .file-input,
  .sync-button {
    margin-top: 5px;
  }

  .file-input {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }

  .sync-button {
    font-family: inherit;
    width: 10.75em;
    border-radius: 1.25em;
    border: 1px solid #409fff;
    font-size: 1em;
    font-weight: 500;
    outline: 0;
    user-select: none;
    line-height: 2em;
    vertical-align: top;
    display: inline-block;
    cursor: pointer;

    //
    color: #fff;
    background: #409fff;

    &:hover {
      filter: brightness(0.9);
    }

    span {
      position: relative;
      display: block;
      top: -1px;
    }
  }

  .company_select select.company_select {
    width: auto;
    min-width: 200px;
  }
}

.background {
  position: absolute;
  overflow: auto;
  top: 0;
  left: 0;
  padding-left: 400px;
  right: 0;
  height: 100%;
  display: flex;
  top: 50%;
  transform: translate(0, -50%);
  transform: translate3d(0, -50%, 0);

  background-color: #c1c7c2;
  background-image: none;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>