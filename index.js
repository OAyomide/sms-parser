
const vt = `Acct: 0175456083\nAmt: 2,000.00 CR \nDesc: -- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986\nAvail Bal: 129,696.51\n`
const data = vt.toUpperCase()

const TOKENS = {
  BANK: 'BANK',
  ACCTNO: 'ACCT',
  AMT: 'AMT',
  DESC: 'DESC',
  TRANSTYPECR: 'CR',
  TRANSTYPEDR: 'DR',
  BALANCE: 'BAL'
}

const DELIMITERS = {
  SPACE: '\s',
  TAB: '\t',
  LINE: '\n',
  COMMA: ',',
  COLON: ':',
}

let char = ''
const LETTERS = /[a-z]/ig
const NUMBERS = /\d+/

function AgbowoParserV1(input) {
  let pos = 0
  let nextpos = 0
  let val = []
  while (pos < input.length) {
    if (pos >= input.length) {
      char = ''
    } else {
      char = input[nextpos]
    }

    pos = nextpos
    nextpos++

    if (Object.values(DELIMITERS).includes(input[pos])) {
      pos = nextpos
      char = input[pos]
      continue
    }

    while (LETTERS.test(input[pos].toUpperCase())) {
      let v = ''
      char = input[pos] + input[nextpos]

      // check if one our token has been matched. especially DR/CR

      if (Object.values(TOKENS).includes(char)) {

        let vj = {
          LITERAL: char,
          INDEX: char.length + data.indexOf(char),
        }
        let tokenValue = parseLiteralTypes(char, vj.INDEX, input)
        vj.VALUE = tokenValue

        val.push(vj)
        continue
      }
      nextpos++
      v = char


      while (!Object.values(TOKENS).includes(char)) {
        pos = nextpos
        char = v + input[pos]

        if (Object.values(TOKENS).includes(char)) {
          nextpos++
          let vj = {
            LITERAL: char,
            INDEX: char.length + data.indexOf(char),
          }

          let tokenValue = parseLiteralTypes(char, vj.INDEX, input)
          vj.VALUE = tokenValue
          val.push(vj)
        }
        break
      }

      char = v + input[pos] + input[pos + 1]
      if (Object.values(TOKENS).includes(char)) {
        let vj = {
          LITERAL: char,
          INDEX: char.length + data.indexOf(char),
        }

        let tokenValue = parseLiteralTypes(char, vj.INDEX, input)
        vj.VALUE = tokenValue
        val.push(vj)
        nextpos++
      }
    }
  }

  if (val.length !== 6) {
    console.log("Parser Error. A token is missing")
  }
  console.log(val)
}


function parseLiteralTypes(literal, index, input) {
  switch (literal) {
    case 'ACCT':
      return extractAcctNo(index, input)
    case 'DR':
      return false
    case 'CR':
      return true
    case 'AMT':
      return extractTxAmount(index)
    case 'DESC':
      return extractTxDescription(index)
    case 'BAL':
      return extractBalance(index)
    default:
      return ''
    // DEFAULT DEFAULT WHO IS THE BOSS OF THEM ALL
  }
}

function extractAcctNo(literalIndex, input) {
  // account numbers are 11 digits long. then we have characters preceeding it. currently, we can discard the preceeding characters
  // until the beginning of the field. so how about:
  // if the next character is not a number, jump over to the next... and so on
  // until we meet a character. then in that case, jump 11 times and return the data
  // but since we already know the index of other 'TOKENS', why not use this? TO-DO in v2
  let vd = data.slice(literalIndex)
  let pos = 0
  let nextpos = 0
  let acctN = ''
  while (pos < vd.length) {
    if (pos >= vd.length) {
      acctN = ''
    } else {
      acctN = vd[pos]
      pos = nextpos
      nextpos++
    }
    while (NUMBERS.test(vd[pos])) {
      let v = ''
      v = vd[pos] + vd[nextpos]
      pos = nextpos
      // nextpos++
      while (pos <= 12) {
        nextpos++
        v = v + vd[nextpos]
        if (v.length === 11) {
          acctN = v
          return acctN.trim()
        }
      }
      nextpos++
      break
    }
  }
}

// extracts the monetary value of the transaction -- how much was debited/credited
function extractTxAmount(literalIndex, nextIndex) {
  // first, we already have the index of this. so the next we need to do is read all inputs from the index of ```AMT```
  // to the beginning of ```CR``` or ```DR```
  let vd = data.slice(literalIndex)
  let ind = data.indexOf('CR')

  if (ind === -1) {
    ind = data.indexOf('DR')
  }

  let range = ind - literalIndex // because literalIndex of CR/DR is always smaller --it comes first
  let amtstrings = vd.slice(0, range)
  let amt = amtstrings.replace(/:/ig, '').trim()
  return amt
}

// extracts the description of the transaction
function extractTxDescription(literalIndex) {
  let vd = data.slice(literalIndex)
  let ind = data.indexOf('AVAIL')

  let range = ind - literalIndex
  let descstrng = vd.slice(0, range)
  return descstrng.replace(/-/ig, '').trim()
}

// extracts the remaining balance
function extractBalance(literalIndex) {
  let vd = data.slice(literalIndex)
  
  let balStrings = vd.replace(/:/ig, '').trim()
  return balStrings
}


AgbowoParserV1(data)