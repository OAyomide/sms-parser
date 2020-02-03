// const text = `Acct: 0175456083\nAmt: 2,000.00 CR \nDesc: -- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986\nAvail Bal: 129,696.51\n`
const text = `Acct: 0016369011
Amt: 3,100.00 DR 
Desc: -- --PAYCOM NIGERIA LIMIT  LA      LANGSTAN9999709112
Avail Bal: 1,944.19`

function Maggi(input) {
  let TOKENS = ['Acct', 'Desc', 'Amt', 'Avail', 'CR', 'DR', 'Desc']
  let currentPos = 0
  let nextPos = 0

  let chars = ''
  const keywords = []
  const output = []
  while (currentPos < input.length) {
    if (currentPos >= input.length) {
      chars = ''
    } else {
      chars = input[nextPos]
    }
    let tempchar = ''
    tempchar = chars
    chars = ''

    while (!TOKENS.includes(chars) && currentPos < input.length) {
      currentPos++
      chars = tempchar + input[currentPos]
      chars = input.substring(0, currentPos)
      if (TOKENS.includes(chars)) {
        keywords.push({ TYPE: 'KEYWORD', LITERAL: chars, START: nextPos, END: currentPos })
        nextPos = currentPos
        chars = input.substring(nextPos, currentPos)
        currentPos++
        continue
      }
      // console.log(`next pos & curr pos:`, nextPos, currentPos)
      break
    }

    chars = input.substring(nextPos, currentPos)
    if (input[currentPos] === '\n' || input[currentPos] === '\t' || input[currentPos] === ' ' || input[currentPos] === '-' || input[currentPos] === ':') {
      currentPos++
      if (input[currentPos] === '-' || input[currentPos] === ':') {
        currentPos++
      }
      nextPos = currentPos
    }

    chars = (chars + input[currentPos++]).trim()

    if (TOKENS.includes(chars)) {

      // remember we're eating whitespace and jumping twice earlier and also we're "triming" which means our current pos jumps forward? yeah we're backtracking here cos the whitespace is often close to the acct
      // and also, substring doesnt include the last index specified so we have to account for that.
      if (chars === 'CR' || chars === 'DR') {
        keywords.push({ TYPE: 'KEYWORD', LITERAL: chars, START: nextPos - 3, END: currentPos - 2 })
        // break
      }


      if (chars === 'Avail') {
        keywords.push({ TYPE: 'KEYWORD', LITERAL: chars + ' Bal', START: nextPos, END: currentPos + 4 })
        break
      }

      keywords.push({ TYPE: 'KEYWORD', LITERAL: chars, START: nextPos, END: currentPos })
      continue
    }
  }
  let filterRegex = /(:\s)/ig
  // find the starting and ending of
  function ParseAcctNumber() {
    let [Acct, Amt] = keywords.filter(x => x.LITERAL === 'Acct' || x.LITERAL === 'Amt')
    let { END: START } = Acct
    let { START: END } = Amt
    return {
      Acct: input.substring(START, END).replace(filterRegex, '').trim()
    }
  }

  function ParseTxAmt() {
    let [Amt, CRDR] = keywords.filter(x => x.LITERAL === 'Amt' || x.LITERAL === 'DR' || x.LITERAL === 'CR')
    let { END: START } = Amt
    let { START: END } = CRDR
    return {
      Amt: input.substring(START, END).replace(filterRegex, '').trim()
    }
  }

  function ParseTxType() {
    let tx = keywords.filter(x => x.LITERAL === 'CR' || x.LITERAL === 'DR')
    return {
      TxType: tx[0].LITERAL
    }
  }

  function ParseTxDesc() {
    let [Desc, Bal] = keywords.filter(x => x.LITERAL === 'Desc' || x.LITERAL === 'Avail Bal')
    let { END: START } = Desc
    let { START: END } = Bal
    return {
      Desc: input.substring(START, END).replace(filterRegex, '').trim()
    }
  }

  function ParseAvailBal() {
    let [Bal] = keywords.filter(x => x.LITERAL === 'Avail Bal')
    let { END: START } = Bal
    let END = input.length
    return {
      Bal: input.substring(START, END).replace(filterRegex, '').trim()
    }
  }


  let acct = ParseAcctNumber()
  let amt = ParseTxAmt()
  let txtype = ParseTxType()
  let desc = ParseTxDesc()
  let avail = ParseAvailBal()

  output.push(acct, amt, txtype, desc, avail)
  return output
}

let parsed = Maggi(text)
console.log(parsed)
