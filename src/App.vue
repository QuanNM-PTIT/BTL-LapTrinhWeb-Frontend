<script setup>
import { RouterView } from "vue-router"
import Nav from "./components/Nav.vue";
</script>

<template>
    <main>
        <Nav />
        <RouterView />
    </main>
</template>

<style scoped></style>