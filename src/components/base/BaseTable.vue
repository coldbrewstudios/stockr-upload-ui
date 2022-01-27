<template>
  <main>
    <div @click="Table.clear()"> FOR LUKE </div>
    <div class="table" v-html="Table.html" @click="Table.loopRows()"></div>
  </main>
</template>

<script>
// table constructor init
let table = new Table({
  rows: ["gregg", "jordan", "brad"]
});

//
export default {
  name: "BaseTable",
  data() {
    return {
      Table: table
    };
  }
};

// i wanna hold table html in here
// i wanna hold all table logic in here
// i wanna hold table styling (how do i get styling into vue)
function Table(options) {
  // locals
  this.sort = false;
  this.html = "click me";
  this.rows = options.rows || [];

  this.clear = function() {
    this.html = 'Hello World'
  }

  this.loopRows = function() {
    let html = "";
    let rows = this.rows;
    for (let i = 0, len = rows.length; i !== len; i++) {
      html += `<div class="row">${rows[i]}</div>`;
    }
    this.html = html;
  };

  // this.loopRows()
}
</script>

<style>
</style>