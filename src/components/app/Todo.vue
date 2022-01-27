<template>
  <TodoList>
    <TodoListItem
      v-for="(todo, index) in todos"
      :key="index"
      :todo="todo"
      @complete="completeTodo($event, index)"
    />
  </TodoList>
</template>

<script>
import TodoList from "./TodoList";
import TodoListItem from "./TodoListItem";

export default {
  name: "Todo",
  data() {
    return {
      todos: [
        {
          text: "Read vue styleguide",
          isComplete: false
        },
        {
          text: "Setup folder structure",
          isComplete: false
        },
        {
          text: "Get a few files and components in",
          isComplete: false
        },
        {
          text: "Test structure by building to do app",
          isComplete: false
        }
      ]
    };
  },
  methods: {
    completeTodo(todo, index) {
      this.todos[index].isComplete = true;
    }
  },
  components: { TodoList, TodoListItem }
};
</script>

<style>
</style>