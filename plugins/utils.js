// import { saveAs } from 'file-saver'

import Vue from 'vue'
import moment from 'moment'

// Vue.prototype.$fileSaver = function (response) {
//   const contentDisposition = response.headers['content-disposition']
//   let fileName = 'no-title'
//   if (contentDisposition && contentDisposition.startsWith('filename=')) {
//     fileName = contentDisposition.replace('filename=', '')
//   }
//   saveAs(new Blob([response.data]), fileName)
// }

Vue.prototype.$formatNumber = function (
  v,
  { decimal = 2, showZeroAs = '-', showNullAs = '' } = {}
) {
  if (v == null || v === undefined) {
    return showNullAs
  }
  if (typeof v === 'string') {
    v = parseFloat(v)
  }
  if (v === 0) {
    return showZeroAs
  } else if (v < 0) {
    return (
      '(' +
      (v * -1).toLocaleString('en-US', {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
      }) +
      ')'
    )
  }
  return v.toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  })
}

Vue.prototype.$formatInteger = function (
  v,
  { showZeroAs = '-', showNullAs = '' } = {}
) {
  if (v == null || v === undefined) {
    return showNullAs
  }
  if (typeof v === 'string') {
    v = parseFloat(v)
  }
  if (v === 0) {
    return showZeroAs
  } else if (v < 0) {
    return (
      '(' +
      (v * -1).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) +
      ')'
    )
  }
  return v.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

Vue.prototype.$formatHumanDate = function (
  v,
  { showBlankAs = '-', showNullAs = '-', uppercaseFirstChar = true } = {}
) {
  if (v == null || v === undefined) {
    return showNullAs
  }
  if (v === '') {
    return showBlankAs
  }

  if (uppercaseFirstChar) {
    return capitalizeFirstLetter(moment(v).fromNow())
  }
  return moment(v).fromNow()
}
