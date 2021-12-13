<template>
  <a-modal
    :visible="modalShow"
    title="Sponsor"
    ok-text="Sponsor"
    @cancel="$emit('cancel')"
    @ok="handleOkClick()"
  >
    <div class="payment-logo">
      <img v-if="type === 'paypal'" src="~assets/svg/paypal.svg" />
    </div>
    <div>
      <a-radio-group v-model="sponsorAmt">
        <a-radio class="radio-btn" :value="20"> RM20 </a-radio>
        <a-radio class="radio-btn" :value="50"> RM50 </a-radio>
        <a-radio class="radio-btn" :value="100"> RM100 </a-radio>
        <a-radio class="radio-btn" :value="0">
          Other
          <a-input-number
            v-if="sponsorAmt === 0"
            v-model="otherAmt"
            class="other-amt-input"
          />
        </a-radio>
      </a-radio-group>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      modalShow: this.show,
      sponsorAmt: 20,
      otherAmt: null,
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.sponsorAmt = 20
        this.otherAmt = null
      }
      this.$nextTick(() => {
        this.modalShow = this.show
      })
    },
  },
  methods: {
    handleOkClick() {
      let finalAmt = 0
      if (this.sponsorAmt) {
        finalAmt = this.sponsorAmt
      } else {
        finalAmt = parseFloat(this.otherAmt)
      }

      if (!finalAmt) {
        this.$error({
          title: 'Please enter valid amount to sponsor',
        })
        return
      }

      console.log(finalAmt)
    },
  },
}
</script>
<style lang="less" scoped>
.payment-logo {
  height: 50px;
  width: 100px;
}

.radio-btn {
  display: block;
  height: 30px;
  line-height: 30px;
}

.other-amt-input {
  width: 150px;
  margin-left: 16px;
}
</style>
