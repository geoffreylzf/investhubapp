<template>
  <div class="mt-4 flex">
    <div class="flex-none w-96 h-16"></div>
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
        {{ data.title }}
      </p>
      <div v-for="p in data.paragraphs" :key="p.id" class="mt-8">
        {{ p.content }}
      </div>
    </div>
    <div class="flex-none w-96">
      <div class="flex flex-col items-center mx-8 p-8 border-2 rounded-lg">
        <div class="h-10 w-10">
          <img
            class="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
            alt=""
          />
        </div>
        <p class="mt-4">{{ data.author.name }}</p>
        <p class="mt-4 text-sm">{{ data.author.bio }}</p>

        <div class="mt-4 w-full text-xs">
          Other Articles by this author:
          <div v-for="oa in otherArticles" :key="oa.id">
            <nuxt-link :to="'/articles/' + oa.id">
              <a class="text-blue-700 hover:text-green-700"> {{ oa.title }}</a>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        id: 1,
        title: 'Kpower 的浅层分析',
        author: {
          name: '和狼瓜子',
          bio: '我坚信勤奋工作和无私的分享是提升个人灵性的基础，凭着利他的心，我把我所做的功课都分享出来，这就是此部落格的使命和意义',
        },
        create_date: '2021-04-08 14:20:34',
        paragraphs: [
          {
            id: 1,
            content:
              '好像也有整个月没写过文章了，这个月真的忙得不可开交，在甲洞的新家终于拿到了钥匙，所以也开始筹备着装修的事宜，而另一个在万绕的新家也会在下个星期拿钥匙了，而沙叻秀的预计多几个礼拜或几个月，也会拿钥匙了，真的是等了几年都没得拿。一好就全部一起好，加上10月基金王正式开启，所以也特别忙碌（其实也趁机休闲偷懒才真），我再不写，貌似有些网民都不记得天哥是谁了XD。。',
          },
          {
            id: 2,
            content:
              '不过停了整个月，也忘记怎么写文章了，所以直接把近期比较多网友问天哥的一些问题犹如RCECAP是否太高估了，FPI是否还值得抓，AEONCR怎么突然冲高那么多？GENM是否还值得入场等问题分享给大家吧，其实问题有很多的，不过天哥把接近一样的问题综合起来，然后只选一些向来有跟进的公司而已，毕竟其他的大家也未必有兴趣，废话少说，我们直接进正题吧。。',
          },
          {
            id: 3,
            content:
              '由于天哥很少私下谈论股票，毕竟天哥本身是一家公司的操盘手，也避免会有利益输送，所以都不会私下给予任何的投资建议或者谈论股票，加上目前SC也比较严格，所以今天也用比较公开和合法的方式分享天哥的看法，以下是集合了许多网友问题的一些综合（由于有综合了许多问题，所以跟原本的问题和答案会有少许偏差）',
          },
        ],
      },
      otherArticles: [
        {
          id: 11,
          title: '隐藏的盈利，隐藏的投资高手！',
        },
        {
          id: 12,
          title: 'JOHOTIN 值得长期投资吗？',
        },
        {
          id: 13,
          title: 'kesm 科技线图呈现头肩顶吗？',
        },
      ],
    }
  },
  head() {
    return {
      title: 'Kpower 的浅层分析',
    }
  },
}
</script>
