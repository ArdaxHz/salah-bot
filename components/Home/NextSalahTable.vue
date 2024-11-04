<script setup>
import { DateTime } from "luxon";
const times = [{ "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }, { "masjid": "Test", "time": new Date() }, { "masjid": "Teaaaaaaaaaaaaast", "time": new Date() }, { "masjid": "Tt", "time": new Date() }];

</script>

<template>
    <table class="w-full table-auto">
        <thead class="text-xl font-semibold sm:text-2xl sm:font-bold text-ellipsis text-pretty">
            <tr>
                <th class="">
                    Place
                </th>
                <th class="">
                    Start
                </th>
                <th class="">
                    Time
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="text-lg font-regular sm:text-xl sm:font-semibold text-ellipsis text-pretty"
                v-for="masjid in times">
                <td class="w-[70%]">
                    {{ masjid.masjid }}
                </td>
                <td class="w-[20%]">
                    {{ DateTime.fromJSDate(masjid.time).toLocaleString(DateTime.TIME_24_SIMPLE) }}
                </td>
                <td class="w-[20%]">
                    {{ DateTime.fromJSDate(masjid.time).toLocaleString(DateTime.TIME_24_SIMPLE) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style>
thead {

    text-align: left;
}
</style>