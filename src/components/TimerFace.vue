<template>
    <div class="text-white rounded text-monospace position-relative mb-3">
        <h3 class="text-center position-absolute text-shadow along-top">
            {{ label }}
        </h3>
        <h1
            class="time-display display-2 text-center nowrap white-border text-shadow mb-0"
        >
            {{ timeDisplay }}
        </h1>
        <h2 class="text-center position-absolute text-shadow along-bottom">
            {{ body }}
        </h2>
    </div>
</template>

<script>
const padZeros = (value) => {
    const str = value.toString();
    if (str.length === 1) {
        return '0' + str;
    } else {
        return str;
    }
};

export default {
    name: 'TimerFace',
    props: [
        'label',
        'milliseconds',
        'body',
    ],
    computed: {
        hours() {
            return Math.floor(this.milliseconds / (1000 * 60 * 60));
        },
        minutes() {
            return Math.floor((this.milliseconds / (1000 * 60)) % 60);
        },
        seconds() {
            return Math.floor((this.milliseconds / 1000) % 60);
        },
        timeDisplay() {
            return `${
                this.hours !== 0 ? `${this.hours}:` : ''
            }${
                padZeros(this.minutes)
            }:${
                padZeros(this.seconds)
            }`;
        },
    },
};
</script>

<style lang="scss">
.white-border {
    border: 1px solid transparent;
}

.text-shadow {
    text-shadow: 2px 2px 2px black;
}
.time-display {
    height: 15rem;
    line-height: 15rem;
    letter-spacing: -5px;
}
.along-top {
    left: 0;
    right: 0;
    top: 0.3rem;
}
.along-bottom {
    left: 0;
    right: 0;
    bottom: 0.3rem;
}
</style>
