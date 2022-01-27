<template>
  <li class="list__item">
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: "BaseListItem"
};
</script>

<style>
.list__item {
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.list__item:last-child {
  border-bottom: 0;
}
</style>