const currencyInfoRequest = new XMLHttpRequest()

const currencySelect = document.querySelector('#currency-select')
const exchangeInput = document.querySelector('#exchange-input')
const resultInput = document.querySelector('#result-input')

exchangeInput.focus()

function convert() {
  const currency = currencySelect.value
  const conversionType = `${currency}BRL`
  const exchangeValue = Number(exchangeInput.value)

  currencyInfoRequest.open('GET', `https://economia.awesomeapi.com.br/json/last/${currency}-BRL`)

  currencyInfoRequest.onreadystatechange = () => {
    if (currencyInfoRequest.readyState == 4) {
      if (currencyInfoRequest.status == 200) {
        const currencyInfo = JSON.parse(currencyInfoRequest.responseText)
        let currencyValue = 0

        for (let item in currencyInfo[conversionType]) {
          if (item == 'ask') {
            currencyValue = currencyInfo[conversionType][item]
          }
        }

        let convertedValue = exchangeValue * currencyValue

        convertedValue = convertedValue.toLocaleString(
          'pt-BR',
          { style: 'currency', currency: 'BRL' }
        )

        resultInput.value = convertedValue
      }
    }
  }

  currencyInfoRequest.send()

  exchangeInput.value = ''
  exchangeInput.focus()
}