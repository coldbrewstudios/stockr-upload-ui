// https://github.com/sheetjs/sheetjs
import XLSX from "xlsx";
import { http } from "../../utils";

// vue
export default {
  name: "upload",

  data: () => ({
    stock: {
      lastModifiedDate: null, //date
      records: []
    },
    company_id: null,
    companies: [],
    step: 1,
    selectedCompany: {},
    isStockPutLoading: false,
    isStockPutError: false,
    isLoading: true,
    error: ""
  }),

  computed: {
    json_ui_output() {
      return this.stock.records;
    },
    isAdmin() {
      return this.company_id === "showspace_za";
    },
    selectedCompanyStockUrl() {
      return `https://booqnly-stockr.herokuapp.com/api/v1/stock?company_id=${this.selectedCompany._id}`;
    }
  },

  watch: {
    step(cv) {
      if (cv === 1) {
        this.stock = {
          lastModifiedDate: null,
          records: []
        };
      }
    }
  },

  methods: {
    GET_COMPANY(id) {
      return http(`/companies?company_id=${id}`, {
        method: "GET"
      });
    },
    GET_COMPANIES() {
      return http(`/companies`, {
        method: "GET"
      });
    },
    INSERT_STOCK(company_id, stock_data) {
      return http(`/stock?company_id=${company_id}`, {
        method: "PUT",
        body: JSON.stringify(stock_data)
      });
    },

    whenCompanySelect({ target }) {
      const { value } = target;
      const company = this.companies.find((c) => c._id === value);

      this.selectedCompany = company;
      if (company && company._id && this.step < 2) {
        this.step = 2;
      }
    },

    whenFileSelected(evt) {
      let f = evt.target.files[0];
      const fileLastModified = new Date(f.lastModified).toDateString();

      this.step = 2;

      if (f) {
        let r = new FileReader();

        r.onload = (e) => {
          const file = e.target.result;

          const workbook = XLSX.read(file, {
            type: "binary"
          });

          let records = [];

          workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              // header: 1,
              // dateNF: "FMT 14",
              raw: false,
              blankrows: false
            });

            if (roa.length) records = roa;
          });

          // in case something falls over, we still need error handling
          if (records.length > 0) {
            this.stock = {
              lastModifiedDate: fileLastModified,
              records
            };
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
        .then(async (res) => {
          console.log("res", res);
          this.step = 4;
          this.isStockPutLoading = false;
          this.isStockPutError = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.isStockPutLoading = false;
          this.isStockPutError = true;
        });
    },

    goToNextCompany() {
      this.step = 1;
      const currentCompanyIndex = this.companies.findIndex(
        (c) => c._id === this.selectedCompany._id
      );
      if (
        currentCompanyIndex >= 0 &&
        currentCompanyIndex !== this.companies.length - 1
      ) {
        this.selectedCompany = this.companies[currentCompanyIndex + 1];
      }
    }
  },

  async mounted() {
    const { company_id } = this.$route.query;
    this.company_id = company_id;

    let file = document.getElementById("file_input");
    file.addEventListener("change", this.whenFileSelected);

    if (!company_id) {
      this.error = "You need a company id to upload data";
      this.isLoading = false;
    }

    if (company_id === "showspace_za") {
      this.companies = await this.GET_COMPANIES();

      if (this.companies.error) {
        this.error =
          "Oops, we weren't able to fetch all companies! Please contact Gregg on 081 205 7395!";
      } else if (this.companies && this.companies.length > 0) {
        this.selectedCompany = this.companies[0];
        this.step = 2;
      }

      this.isLoading = false;
    } else if (company_id) {
      const companies = await this.GET_COMPANY(company_id);

      if (companies && companies.length > 0) {
        this.selectedCompany = companies[0];
      }
      if (companies.error || companies.length === 0) {
        this.error = `Oops, something went wrong fetching the company: ${company_id} . Check the id is correct in the url or refresh and try again. <br/>&nbsp;<br/>Call Gregg on 081 205 7395 for immediate help!`;
      }

      this.isLoading = false;
    }
  }
};
