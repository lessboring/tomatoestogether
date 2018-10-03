<template>
    <div id="app">
        <img src="./assets/logo.png">
        <HelloWorld/>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
    name: 'App',
    components: {
        HelloWorld,
    },
};
</script>

<style lang="scss">
@import './styles/bootstrap.scss';
@import './styles/styles.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';

html, body, #app {
    min-height: 100vh;
}
</style>
