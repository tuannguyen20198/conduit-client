import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  vi: {
    translation: {
      // common
      amount: 'Tổng tiền',
      content: 'Nội dung',
      copy: 'Sao chép',
      cancel: 'Hủy bỏ',
      confirm: 'Tôi đã chuyển khoản',
      download: 'Tải về',
      share: 'Chia sẻ',

      // deposit
      amount_placeholder: 'Tổng tiền',
      amount_err_message: 'Vui lòng nhập số tiền',
      currencyUnit: 'Đơn vị tiền tệ',
      paymentMethod: 'Phương thức thanh toán',
      paymentMethod_placeholder: 'Phương thức thanh toán',
      paymentMethod_err_message: 'Vui lofng chọn phương thức thanh toán',
      btn_submit: 'Thực hiện',

      // deposit/query-detail
      warning_expired: 'Vui lòng thanh toán trong thời gian',
      query_detail_detail: 'Thông tin chi tiết',
      query_detail_bank: 'Ngân hàng',
      query_detail_bank_number: 'Số tài khoản',
      query_detail_bank_name: 'Tên tài khoản',
      query_detail_payer: 'Người trả tiền',
      query_detail_type: 'Loại',
      query_detail_branch: 'Nhánh'
    }
  },
  eng: {
    translation: {
      // common
      amount: 'Amount',
      content: 'Content',
      copy: 'Copy',
      cancel: 'Cancel',
      confirm: 'I have transferred money',
      download: 'Download',
      share: 'Share',

      // deposit
      amount_placeholder: 'Please enter the amount',
      amount_err_message: 'Please enter the amount',
      currencyUnit: 'Currency unit',
      paymentMethod: 'Payment method',
      paymentMethod_placeholder: 'Select a method',
      paymentMethod_err_message: 'Please select a method',
      btn_submit: 'Submit',

      // deposit/query-detail
      warning_expired: 'Please pay in time',
      query_detail_detail: 'Infomation details',
      query_detail_bank: 'Bank',
      query_detail_bank_number: 'Bank number',
      query_detail_bank_name: 'Bank name',
      query_detail_payer: 'Payer',
      query_detail_type: 'Type',
      query_detail_branch: 'Branch'
    }
  },
  jp: {
    translation: {
      //Common
      amount: '額',
      content: 'コンテンツ',
      copy: 'コピー',
      cancel: 'キャンセル',
      confirm: 'トイ・ダ・チュイン・ティアン',
      download: 'ダウンロード',
      share: '共有',

      // deposit
      amount_placeholder: '額',
      amount_err_message: '金額を入力してください',
      currencyUnit: '通貨単位',
      paymentMethod: '支払方法',
      paymentMethod_placeholder: '方法を選択してください',
      paymentMethod_err_message: '方法を選択してください',
      btn_submit: '提出する',

      // deposit/query-detail
      warning_expired: '期限内にお支払いください',
      query_detail_detail: '情報詳細',
      query_detail_bank: '銀行',
      query_detail_bank_number: '銀行番号',
      query_detail_bank_name: '銀行名',
      query_detail_payer: '支払者',
      query_detail_type: 'タイプ',
      query_detail_branch: '支店'
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'vi', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
