<template>
    <div class="form-group">
        <div class="row">
            <div class="col-6" v-for="duration in durations" :key="duration">
                <button type="text"
                        class="btn btn-block mb-3"

                        @click="$emit('input', duration)"

                        :class="{
                            'btn-outline-secondary': value !== duration,
                            'btn-primary': value === duration,
                        }">
                    Work <strong>{{ Math.floor(duration / 1000 / 60) }}</strong> Minutes
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectDuration',
    props: ['value', 'durations'],
};
</script>
