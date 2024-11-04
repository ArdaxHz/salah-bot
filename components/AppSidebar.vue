<script setup>
const SideBarMenu = ref(true);
const props = defineProps({
    windowHeight: Number,
    windowWidth: Number,
    expandedMenu: Boolean,
    expandedMenuVal: Number
})
const emits = defineEmits(['ToggleMenu'])
const is_expanded = ref(props.expandedMenu)

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
    emits('ToggleMenu', is_expanded.value)
}

watch(() => props.expandedMenuVal, (newValue, _) => {
    if (newValue) {
        if (newValue % 2 == 0) {
            is_expanded.value = true
        }

        if (Math.abs(newValue % 2) == 1) {
            is_expanded.value = false
        }
    }
});
</script>


<template>
    <aside class="sidebar bg-whtie ring-2 ring-mulled-500 dark:bg-flax-950" :class="`${is_expanded ? 'is-expanded bg-white ' : ''}`    " ref="SideBarMenu">
        <!--<div class="logo">
             <img :src="logoURL" alt="Vue" />
        </div> -->

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-8 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>

        <div class="menu">
            <!-- <NuxtLink to="/about">
                About page
            </NuxtLink> -->
        </div>

        <div class="flex"></div>

        <div class="menu">
        </div>
    </aside>
</template>


<style>
@keyframes translateIn {
    from {
        transition: 0.2s ease-in-out;
        transform: translateX(-100%);
    }

    to {
        transition: 0.2s ease-in-out;
        transform: translateX(0);
        display: flex;
    }
}

@keyframes translateOut {
    from {
        transition: 0.2s ease-in-out;
        transform: translateX(0);
        display: flex;
    }

    to {
        transition: 0.2s ease-in-out;
        transform: translateX(-100%);
        display: none;
    }
}


.animateOut {
    @media (max-width: 1023px) {
        animation: translateOut 500ms forwards;
    }
}

aside {
    display: flex;
    flex-direction: column;
    background-color: var(--dark);
    color: var(--light);

    box-shadow: 4px 0 2px -2px;

    min-width: var(--sidebar-width-collapse);
    max-width: var(--sidebar-width-collapse);
    overflow: hidden;
    padding-block: 1rem;
    padding-inline: 1rem;

    transition: 0.2s ease-in-out;

    @media (max-width: 1023px) {
        animation: translateOut 500ms forwards;
    }

    .logo {
        margin-bottom: 1rem;

        img {
            width: 2rem;
        }
    }

    .menu-toggle-wrap {
        display: flex;
        /* justify-content: center; */
        transition: 0.2s ease-in-out;

        .menu-toggle {
            transition: 0.2s ease-in-out;

            .material-icons {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover {
                .material-icons {
                    color: var(--primary);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    h3,
    .button .text {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    h3 {
        color: var(--grey);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .menu {
        margin: 0 -1rem;

        .button {
            display: flex;
            align-items: center;
            text-decoration: none;

            transition: 0.2s ease-in-out;
            padding: 0.5rem 1rem;

            .material-icons {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-in-out;
            }

            .text {
                color: var(--light);
                transition: 0.2s ease-in-out;
            }

            &:hover {
                background-color: var(--dark-alt);

                .material-icons,
                .text {
                    color: var(--primary);
                }
            }

            &.router-link-exact-active {
                background-color: var(--dark-alt);
                border-right: 5px solid var(--primary);

                .material-icons,
                .text {
                    color: var(--primary);
                }
            }
        }
    }

    .footer {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;

        p {
            font-size: 0.875rem;
            color: var(--grey);
        }
    }

    &.is-expanded {
        box-shadow: 4px 0 2px -2px theme('colors.mulled.500');

        display: flex;
        min-width: var(--sidebar-width);
        max-width: var(--sidebar-width);
        height: 100%;
        padding-block: 1rem;

        transition: 0.2s ease-in-out;

        @media (max-width: 1023px) {
            animation: translateIn 500ms forwards;
            position: absolute;
        }

        .menu-toggle-wrap {
            justify-content: flex-start;

            .menu-toggle {
                transform: rotate(-180deg);
            }
        }

        h3,
        .button .text {
            opacity: 1;
        }

        .button {
            .material-icons {
                margin-right: 1rem;
            }
        }

        .footer {
            opacity: 0;
        }
    }

}
</style>