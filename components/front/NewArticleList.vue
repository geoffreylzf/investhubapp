<template>
  <div class="shadow overflow-hidden border-b border-gray-200 rounded-sm">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-8 py-2 text-xs text-left font-medium text-gray-500 uppercase"
          >
            Title
          </th>
          <th
            class="w-1/4 px-8 py-2 text-xs font-medium text-gray-500 uppercase"
          >
            Author
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="art in articles" :key="art.id">
          <td class="px-8 py-2 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ art.title }}
            </div>
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-center">
            <div class="text-sm text-gray-900">{{ art.author }}</div>
            <div class="text-sm text-gray-500">
              {{ formatHumanDate(art.create_date) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
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
  methods: {
    formatHumanDate(datetime) {
      if (datetime) {
        return moment(datetime).fromNow()
      }
    },
  },
}
</script>
