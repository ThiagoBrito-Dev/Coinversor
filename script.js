const currencyInfoRequest = new XMLHttpRequest()

const section = document.querySelector('#exchange-container')
const currencySelect = document.querySelector('#currency-select')
const exchangeInput = document.querySelector('#exchange-input')
const buttonContainer = document.querySelector('.button-container')

// ---------- SECTION ----------
const sectionLastTitle = document.createElement('h2')
sectionLastTitle.setAttribute('class', 'last-title')
sectionLastTitle.textContent = 'Detalhes da conversão'

// ---------- GRID ----------
const detailedResultGrid = document.createElement('div')
detailedResultGrid.setAttribute('class', 'detailed-result-container')

// ---------- COLUNA ESQUERDA ----------
const leftColumn = document.createElement('div')
leftColumn.setAttribute('class', 'left-column')

const variationText = document.createElement('p')
variationText.textContent = 'Taxa de variação:'

const bid = document.createElement('span')
bid.textContent = 'BID: '
const varBidResult = document.createElement('span')
bid.appendChild(varBidResult)

const divider = document.createElement('span')
divider.setAttribute('class', 'divider')
divider.textContent = '|'

const ask = document.createElement('span')
ask.textContent = 'ASK: '
const varAskResult = document.createElement('span')
ask.appendChild(varAskResult)

const exchangeResultText = document.createElement('p')
exchangeResultText.textContent = 'Resultado da conversão:'

const exchangeResult = document.createElement('input')
exchangeResult.setAttribute('type', 'text')
exchangeResult.setAttribute('class', 'read-only last-input')
exchangeResult.setAttribute('readonly', 'true')

// ---------- COLUNA DIREITA ----------
const rightColumn = document.createElement('div')
rightColumn.setAttribute('class', 'right-column')

const highestQuotationText = document.createElement('p')
highestQuotationText.innerHTML = 'Maior cotação <span>(dia)</span>:'

const highestQuotationResult = document.createElement('input')
highestQuotationResult.setAttribute('type', 'text')
highestQuotationResult.setAttribute('class', 'read-only')
highestQuotationResult.setAttribute('readonly', 'true')

const lowestQuotationText = document.createElement('p')
lowestQuotationText.innerHTML = 'Menor cotação <span>(dia)</span>:'

const lowestQuotationResult = document.createElement('input')
lowestQuotationResult.setAttribute('type', 'text')
lowestQuotationResult.setAttribute('class', 'read-only last-input')
lowestQuotationResult.setAttribute('readonly', 'true')
// ---------- FIM ----------

exchangeInput.value = 1
exchangeInput.focus()

function exchange() {
  const currency = currencySelect.value
  const exchangeType = `${currency}BRL`
  const valueToExchange = Number(exchangeInput.value)

  currencyInfoRequest.open('GET', `https://economia.awesomeapi.com.br/json/last/${currency}-BRL`)

  currencyInfoRequest.onreadystatechange = () => {
    if (currencyInfoRequest.readyState == 4) {
      if (currencyInfoRequest.status == 200) {
        const currencyInfo = JSON.parse(currencyInfoRequest.responseText)
        const { varBid, pctChange, ask, high, low } = currencyInfo[exchangeType]

        let varBidValue = Number(varBid)
        let varAskValue = Number(pctChange)
        let exchangeValue = convertToCurrencyFormat(valueToExchange * ask)
        let highestValue = convertToCurrencyFormat(Number(high))
        let lowestValue = convertToCurrencyFormat(Number(low))

        displayElements(varBidValue, varAskValue, exchangeValue, highestValue, lowestValue)
      }
    }
  }

  currencyInfoRequest.send()
}

function convertToCurrencyFormat(value) {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4
    }
  )
}

function displayElements(varBidValue, varAskValue, exchangeValue, highestValue, lowestValue) {
  varBidResult.textContent = `${varBidValue}%`
  varAskResult.textContent = `${varAskValue}%`
  exchangeResult.value = exchangeValue
  lowestQuotationResult.value = lowestValue
  highestQuotationResult.value = highestValue

  rightColumn.appendChild(highestQuotationText)
  rightColumn.appendChild(highestQuotationResult)
  rightColumn.appendChild(lowestQuotationText)
  rightColumn.appendChild(lowestQuotationResult)

  leftColumn.appendChild(variationText)
  leftColumn.appendChild(bid)
  leftColumn.appendChild(divider)
  leftColumn.appendChild(ask)
  leftColumn.appendChild(exchangeResultText)
  leftColumn.appendChild(exchangeResult)

  detailedResultGrid.appendChild(leftColumn)
  detailedResultGrid.appendChild(rightColumn)

  section.insertBefore(sectionLastTitle, buttonContainer)
  section.insertBefore(detailedResultGrid, buttonContainer)

  exchangeInput.value = ''
  exchangeInput.focus()
}