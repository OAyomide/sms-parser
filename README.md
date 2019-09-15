## Motivation
I was (am) working on a[ mobile app for tracking my own spending](https://github.com/oayomide/agbowo). While there are a lot of apps out there that do this, what I needed was one that "just works". Other apps require you to input values, take pictures of your receipts, etc when using them (at least the ones I tried) and this is exhausting, gives room for "cheating" (not tracking a particular spending and thus "false positives" of your finances) and also sometimes you pay with your card online. So I decided: ***"I am going to write mine!"*** Not only would my app work great offline (no "3rd party API to user's account details and all that"), it's going to **perfectly** track my spending and I dont have to do almost anything! 🔥🔥🔥 😎


So I had the app up in no time (okay maybe not. took a while. I had to work) and then I hit a wall: **"HOW DO I RETRIEVE ALL THE INFORMATION I NEED FROM THE SMS I RECEIVE?"**. I receive both SMS and E-mail notifications of ***every*** transaction! Thus, I decided to write a "parser". I couldnt continue so I stopped temporarily.

And if you have been seeing my github recently, I have been experimenting with lexers and parsers (and sweet WebAssembly!). Using a book, I even wrote a [lexer for yorlang](https://github.com/oayomide/yl-lexer) [WIP though...no schedule]. So it made sense!


### So whats up?
Yeah this particular version is the very first version. Let me say: **ITS NOT THE BEST CODE EVER.** It basically was a way for me to put what I had in my head into code. I got something at the end and that was my aim. I am rewriting from scratch, the v2. With better ideas.

So easy on my code 🥺🙏

So please hang around. After this parser, the development of the app continues! 😎😎.


## What does this then return?
Lets say you have this credit alert from GTBank (thats my bank):

```
Acct: 0175456083\nAmt: 2,000.00 CR \nDesc: -- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986\nAvail Bal: 129,696.51\n
```
the parser returns something like this:

```json
[
  { LITERAL: 'ACCT', INDEX: 4, VALUE: '0175456083\n' },
  { LITERAL: 'AMT', INDEX: 20, VALUE: '' },
  { LITERAL: 'CR', INDEX: 33, VALUE: true },
  {
    LITERAL: 'DESC',
    INDEX: 39,
    VALUE: ': -- --JAIZ BANK FAJUYI DUGBE IBADAN    OYNGSTAN9999002986\n'
  },
  { LITERAL: 'BANK', INDEX: 55, VALUE: '' },
  { LITERAL: 'BAL', INDEX: 107, VALUE: '129,696.51' }
]
```
and tokens:

```js
const TOKENS = {
  BANK: 'BANK',
  ACCTNO: 'ACCT',
  AMT: 'AMT',
  DESC: 'DESC',
  TRANSTYPECR: 'CR',
  TRANSTYPEDR: 'DR',
  BALANCE: 'BAL'
}
```
the `INDEX` is the ending position of the token. Note this is for GTBank. This might change for other banks.


So from the parser's output, we know that its a `CR` (credit) transaction, the `AMT` (amount) that left our account is: &#8358;2000. The `DESC` (description) is that its from JAIZ BANK at DUGBE IBADAN (therefore its from an ATM) and the `BAL` (balance left in accout) is &#8358;129, 696.51

Tada! 🎊🎉 we got what we wanted!!

Room for improvement though!