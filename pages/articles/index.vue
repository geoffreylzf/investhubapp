<template>
  <div class="mt-4 flex">
    <div class="flex-none w-1/6 h-16"></div>
    <div class="flex-grow h-16">
      <p
        class="
          inline-block
          text-3xl
          font-extrabold
          text-gray-900
          tracking-tight
        "
      >
        List of Articles
      </p>
      <div>
        <input
          placeholder="Search..."
          class="
            w-full
            p-2
            border-b-2 border-gray-600
            outline-none
            focus:border-indigo-800
          "
        />
      </div>
    </div>
    <div class="flex-none w-1/6 h-16"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: [
        {
          id: 1,
          title: 'Kpower 的浅层分析',
          author: '和狼瓜子',
          create_date: '2021-04-08 14:20:34',
        },
        {
          id: 2,
          title: 'CCM 手套原料需求增加受益的公司',
          author: 'koko888',
          create_date: '2021-04-08 12:20:34',
        },
      ],
    }
  },
}
</script>
