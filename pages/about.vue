<template>
  <div class="flex h-[80svh] flex-col">
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="font-bold text-lg sm:text-2xl">
          Who are we?
        </h1>
        <p>
          We built salah.bot to fill the gap of finding the closest prayer time in a masjid near you, especially when
          you're in an area new to you.
        </p>
      </div>
      <div>
        <h1 class="font-bold text-lg sm:text-2xl">
          How does it work?
        </h1>
        <div class="">
          <p>
            We use a variety of sources for the nearest Masaajid, from lists pre-gathered for cities, to your
            contributions.
          </p>
          <p>
            For the UK, we used the list from
            <NuxtLink
              class="font-semibold hover:underline" target="_blank"
              to="https://mosques.muslimsinbritain.org/gps.php"
            >
              Muslims In Britain
            </NuxtLink>
            and for London, we combined the data with the Google Maps Map
            <NuxtLink class="font-semibold hover:underline" target="_blank" to="https://islamicmusichub.com/maps">
              Prayer Rooms.
            </NuxtLink>
          </p>
          <p>
            We are always looking for more sources to add to the list. If you have a list of Masaajid for your city or
            just one missing Masjid, please contact us with the link.
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div>
          <h1 class="font-bold text-lg sm:text-2xl">
            Can we contribute?
          </h1>
          <p>
            Yes! We are always open to helpers. If you have any ideas to improve the application, please send us
            <NuxtLink class="font-semibold hover:underline" target="_blank" to="mailto:contact@salah.bot">
              an email.
            </NuxtLink>
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <h2 class="font-semibold text-base sm:text-lg">
              There is a Masjid missing! How do I add it to the list?
            </h2>
            <p>
              Please send us
              <NuxtLink class="font-semibold hover:underline" target="_blank" to="mailto:masjids@salah.bot">
                an email
              </NuxtLink>
              with the Masjid's name, address, and a Google Maps link.
            </p>
          </div>

          <div>
            <h2 class="font-semibold text-base sm:text-lg">
              My Masjid is missing its prayer times!
            </h2>
            <p>
              If you have a contact for the Masjid, please send us
              <NuxtLink class="font-semibold hover:underline" target="_blank" to="mailto:masjids@salah.bot">
                an email
              </NuxtLink>
              with the contact information, the Masjid's name, and a Google Maps link.
              If you are part of the Masjid committee and can update the prayer times yourself, please inform us and we
              can
              set an account up for you to edit your Masjid's details and prayer times.
            </p>
          </div>
        </div>
      </div>
      <div>
        <h1 class="font-bold text-lg sm:text-2xl">
          Why are signups disabled?
        </h1>
        <p>
          We see no value in having a signup system for the app, however, Masjid committee members will have accounts
          they
          can use to update the prayer times. If you think a signup system is important, please contact us with your
          suggestions.
        </p>
      </div>
    </div>
    <div class="flex w-full h-full justify-center items-end">
      <div
        class="flex items-center justify-center gap-4 w-24 bg-white/75 dark:bg-white/5 shadow shadow-neutral-500 p-6 rounded-xl text-ellipsis whitespace-normal overflow-hidden"
      >
        <NuxtLink
          class="leading-[0] text-2xl dark:text-[--dark-text-color] text-[--light-text-color]"
          target="_blank"
          to="mailto:contact@salah.bot"
        >
          <Icon
            name="material-symbols:mail-outline-rounded"
          />
        </NuxtLink>
        <!--        <NuxtLink -->
        <!--          class="leading-[0] text-2xl dark:text-[&#45;&#45;dark-text-color] text-[&#45;&#45;light-text-color]" -->
        <!--          target="_blank" -->
        <!--          to="https://github.com/ArdaxHz/salah-bot" -->
        <!--        > -->
        <!--          <Icon name="mdi:github" /> -->
        <!--        </NuxtLink> -->
      </div>
    </div>
  </div>
</template>
