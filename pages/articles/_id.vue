<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
    <a-col :xs="24" :sm="12" class="content">
      <div class="title">
        {{ data.title }}
      </div>
      <div v-for="p in data.paragraphs" :key="p.id" class="paragraph">
        {{ p.content }}
      </div>
      <a-divider />
      Support this article by:
      <br />
      <a-button type="primary"> Paypal </a-button>
      <a-divider />
      <div class="comment-title">Comments</div>
      <a-textarea class="comment-textarea" placeholder="Enter comment">
        ></a-textarea
      >
      <div v-for="cmt in comments" :key="cmt.id">
        <div class="comment-user-name">{{ cmt.user_firstname }}</div>
        <div class="comment-user-content">{{ cmt.comment }}</div>
      </div>
    </a-col>
    <a-col :xs="24" :sm="4" class="author-profile">
      <nuxt-link :to="'/authors/' + data.author.id">
        <a-card hoverable>
          <div class="text-center">
            <a-avatar
              :size="64"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
            />
            <div class="author-name">{{ data.author.name }}</div>
            <div class="author-bio">{{ data.author.bio }}</div>
          </div>
        </a-card>
      </nuxt-link>
      <br />
      <div class="author-other-articles">
        Other Articles by this author:
        <div v-for="oa in otherArticles" :key="oa.id">
          <nuxt-link :to="'/articles/' + oa.id">
            <a> {{ oa.title }}</a>
          </nuxt-link>
        </div>
      </div>
    </a-col>
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      data: {
        id: 1,
        title: 'Kpower 的浅层分析',
        author: {
          id: 1,
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
      comments: [
        {
          id: 1,
          user: 1,
          user_firstname: 'Jack',
          comment: 'very good',
        },
        {
          id: 2,
          user_firstname: 'Nathan',

          comment: 'very nice',
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
<style lang="less" scoped>
.container {
  padding: 16px;
}

.content {
  padding: 0 16px;
}
.title {
  letter-spacing: 2px;
  font-size: 24px;
  font-weight: bolder;
  margin-bottom: 24px;
}

.paragraph {
  margin-bottom: 24px;
}

.comment-title {
  font-weight: bold;
}

.comment-textarea {
  margin-bottom: 12px;
}
.comment-user-name {
  font-size: 12px;
  font-weight: bold;
}

.comment-user-content {
  margin-bottom: 8px;
}

.author-profile {
  padding-right: 16px;
}
.author-name {
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.author-bio {
  font-size: 12px;
}
.author-other-articles {
  padding: 0 16px;
}
</style>
