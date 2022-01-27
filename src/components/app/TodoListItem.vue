<template>
  <BaseListItem class="todo__list__item" :class="classes">
    {{todo.text}}
    <BaseButton @click.native="$emit('complete', todo)">Complete</BaseButton>
  </BaseListItem>
</template>

<script>
import BaseButton from "../base/BaseButton";
import BaseListItem from "../base/BaseListItem";

export default {
  name: "TodoListItem",
  props: ["todo", "completeTodo"],
  computed: {
    classes() {
      return {
        complete: this.todo.isComplete
      };
    }
  },
  components: { BaseButton, BaseListItem }
};
</script>

<style>
.todo__list__item {
  display: flex;
  justify-content: space-between;
}

.complete.todo__list__item {
  text-decoration: line-through;
}
</style>
