<template>
  <BaseList class="todo__list">
    <slot></slot>
  </BaseList>
</template>

<script>
import BaseList from "../base/BaseList";

export default {
  name: "TodoList",
  components: {
    BaseList
  }
};
</script>

<style>
</style>
