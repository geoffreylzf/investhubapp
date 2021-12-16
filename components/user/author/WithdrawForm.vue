<template>
  <a-form :form="form">
    <a-form-item
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      label="Amount"
      extra="Withdraw amount at least RM100"
    >
      <a-input-number
        v-decorator="[
          'amt',
          {
            rules: [
              { required: true, message: 'Please enter withdraw amount' },
            ],
          },
        ]"
        :disabled="isDisabled"
      />
    </a-form-item>
    <a-form-item
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      label="Remark"
    >
      <a-input
        v-decorator="['author_remark']"
        :max-length="500"
        :disabled="isDisabled"
      />
    </a-form-item>
    <a-form-item
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      label="Status"
      extra="Only confirm status will be proceed, you can change this status afterward"
    >
      <a-radio-group v-decorator="['flow_status']">
        <a-radio :value="100"> Draft </a-radio>
        <a-radio :value="200"> Confirm </a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'view',
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isDisabled: !['update', 'create'].includes(this.mode),
      form: (() => {
        const form = this.$form.createForm(this)
        if (this.data) {
          form.getFieldDecorator('amt', {
            initialValue: this.data.amt,
          })
          form.getFieldDecorator('author_remark', {
            initialValue: this.data.author_remark,
          })
          form.getFieldDecorator('flow_status', {
            initialValue: this.data.flow_status,
          })
        } else {
          form.getFieldDecorator('flow_status', { initialValue: 100 })
        }

        return form
      })(),
    }
  },
  methods: {
    validate() {
      let data = null
      this.form.validateFields((e, v) => {
        if (!e) {
          data = v
        }
      })
      return data
    },
  },
}
</script>
