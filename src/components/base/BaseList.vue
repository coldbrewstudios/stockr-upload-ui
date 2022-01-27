<template>
  <ul class="list">
    <slot>
      <BaseListItem>Please use BaseListItem as child</BaseListItem>
    </slot>
  </ul>
</template>

<script>
import BaseListItem from "./BaseListItem";

export default {
  name: "BaseList",
  components: { BaseListItem }
};
</script>

<style lang="scss">
.list {
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid #e8e8e8;
}
</style>