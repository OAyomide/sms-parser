## Use case
This repo contains the parsers for each bank.


## Example
```js

const { sms_parser } = require('./')

const sample_sms = `Acct: 0175456083\nAmt: 2,000.00 CR \nDesc: -- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986\nAvail Bal: 129,696.51\n`
const gbank_details = sms_parser.gtb(sample_sms)

console.log(gtbank_details) // outputs the below
/**
 * [
  { Acct: '0175456083' },
  { Amt: '2,000.00' },
  { TxType: 'CR' },
  { Desc: '-- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986' },
  { Bal: '129,696.51' }
]
 * /
```

## Goals
The aim of this repository is to have a single repo for all the parsers for the (Nigerian) banks to be supported. Each Bank would be a method of the class `SMS_PARSER`.

This can then be used in the react-native app like a regular module/library.