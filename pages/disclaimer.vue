<template>
  <UtilAdsContainer>
    <div class="m-16">
      <h1>Disclaimer</h1>
      <p>
        The data on this website has been provided by a number of external data
        vendors and has not been verified by us. All recommendations, data,
        calculation and values have been provided for your information only.
      </p>

      <p>
        The data has been prepared without taking account of the objectives,
        financial or taxation situation or needs of any particular individual.
        Before acting on the information displayed, you should consider its
        appropriateness to your circumstances and, if necessary, seek
        appropriate professional advice.
      </p>
      <p>
        Investment has high risks. By viewing any data or using the information
        within this site you agree that you will not hold any person or entity
        responsible for loss or damages resulting from the content provided
        here.
      </p>
      <p>
        {{ domainName }} is not an investment adviser, brokerage firm, or
        investment company. Your investment decisions should NOT be based solely
        upon what is shown on the {{ domainName }} website.
      </p>
    </div>
  </UtilAdsContainer>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      domainName: 'investhub.net',
    }
  },
  head() {
    return {
      title: 'Disclaimer',
    }
  },
}
</script>
