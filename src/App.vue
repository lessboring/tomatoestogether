<template>
    <TomatoTimer />
</template>

<script>
import TomatoTimer from './components/TomatoTimer';

export default {
    name: 'App',
    components: {
        TomatoTimer,
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
