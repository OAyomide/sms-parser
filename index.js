const { GTB } = require('./banks/gtb/index')
class SMS_PARSER {
  gtb(input) {
    return GTB(input)
  }
}


const sms_parser = new SMS_PARSER()
module.exports = { sms_parser }