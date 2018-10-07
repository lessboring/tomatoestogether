<template>
    <div class="form-group">
        <select ref="selectProjectSelect"
                class="form-control"
                :value="value"
                @input="$emit('input', parseInt($refs.selectProjectSelect.value, 10))">
            <option :value="null">What project are you working on?</option>
            <option v-for="project in projects"
                    :key="project.id"
                    :value="project.id">
                {{ project.name }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'SelectProject',
    props: ['value', 'projects'],
};
</script>
