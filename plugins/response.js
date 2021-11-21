import Vue from 'vue'
Vue.prototype.$responseError = function (
  response,
  { vueInstance = null } = {}
) {
  const instance = vueInstance || this
  const content = constructContent(response, instance)
  instance.$error({
    title: 'Error',
    content,
  })
}

function constructContent(response, vueInstance) {
  const { status, statusText } = response
  let { data } = response
  const dataString = JSON.stringify(data).trim()

  if (dataString !== '{}' && dataString !== '""' && dataString) {
    if (data && vueInstance && typeof data === 'object') {
      const { $createElement } = vueInstance
      if (Array.isArray(data)) {
        data = { Message: data }
      }
      return $createElement(
        'a-tree',
        {
          props: {
            defaultExpandAll: true,
          },
        },
        [
          ...Object.entries(data).map((a) =>
            $createElement(
              'a-tree-node',
              {
                props: {
                  title:
                    toFirstUppercase(a[0]) +
                    ' : ' +
                    toStringIfStringOrArray1(a[1]),
                },
              },
              [
                ...(isStringOrArray1(a[1]) ? [] : a[1]).map((b, index) =>
                  $createElement(
                    'a-tree-node',
                    {
                      props: {
                        title: '#' + (index + 1),
                      },
                    },
                    [
                      ...Object.entries(b).map((c) =>
                        $createElement(
                          'a-tree-node',
                          {
                            props: {
                              title: `${toFirstUppercase(c[0])} : ${c[1]}`,
                            },
                          },
                          []
                        )
                      ),
                    ]
                  )
                ),
              ]
            )
          ),
        ]
      )
    }
    return dataString
  }
  if (status && statusText) {
    return `${status} ${statusText}`
  }
  return response.toString()
}

function toFirstUppercase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function toStringIfStringOrArray1(v) {
  if (Array.isArray(v) && v.length === 1) {
    return v[0]
  }
  if (typeof v === 'string' || v instanceof String) {
    return v
  }
  return ''
}

function isStringOrArray1(v) {
  if (typeof v === 'string' || v instanceof String) {
    return true
  }
  if (Array.isArray(v) && v.length === 1) {
    if (typeof v[0] === 'string') {
      return true
    }
    return false
  }
  return false
}
