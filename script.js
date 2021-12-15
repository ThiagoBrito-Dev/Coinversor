function formatInputValue() {
  const currency = document.querySelector("select").value;
  const exchangeInput = document.querySelector("input#exchange-input");

  if (exchangeInput.value.indexOf(",") === -1) {
    let inputValue = Number(exchangeInput.value.replace(/\D/g, ""));

    if (!inputValue) {
      inputValue = 1;
    }

    inputValue = convertToCurrencyFormat(inputValue, currency, 0);
    exchangeInput.value = inputValue;
  } else {
    const splittedInputValue = exchangeInput.value.split(",");
    const lastPosition = splittedInputValue.length - 1;

    if (
      splittedInputValue.length > 2 &&
      splittedInputValue[lastPosition] === ""
    ) {
      splittedInputValue.pop();
    }

    splittedInputValue[0] = Number(splittedInputValue[0].replace(/\D/g, ""));
    splittedInputValue[0] = convertToCurrencyFormat(
      splittedInputValue[0],
      currency,
      0
    );
    splittedInputValue[1] = splittedInputValue[1].replace(/\D/g, "");
    exchangeInput.value = splittedInputValue.join(",");
  }
}

async function exchange() {
  const currency = document.querySelector("select").value;
  const exchangeInput = document.querySelector("input#exchange-input");
  const exchangeType = `${currency}BRL`;
  let valueToExchange = Number(
    exchangeInput.value.replace(/[^0-9\,]/g, "").replace(",", ".")
  );

  if (!valueToExchange) {
    valueToExchange = exchangeInput.value = 1;
  }

  try {
    const currencyInfo = await fetch(
      `https://economia.awesomeapi.com.br/json/last/${currency}-BRL`
    ).then((response) => {
      if (response.status === 200 && response.ok) {
        return response.json();
      } else {
        throw new Error(
          "Desculpe, mas devido a algum erro, não foi possível realizar o câmbio desta moeda. Por favor, tente novamente."
        );
      }
    });

    const { varBid, pctChange, ask, high, low } = currencyInfo[exchangeType];
    const currencyData = {
      varBidValue: varBid.replace(".", ","),
      varAskValue: pctChange.replace(".", ","),
      exchangeValue: convertToCurrencyFormat(valueToExchange * ask, "BRL", 4),
      highestValue: convertToCurrencyFormat(Number(high), "BRL", 4),
      lowestValue: convertToCurrencyFormat(Number(low), "BRL", 4),
    };

    displayElements(currencyData);
    exchangeInput.value = "";
    exchangeInput.focus();
  } catch (error) {
    console.log(error.message);
  }
}

function convertToCurrencyFormat(value, currency, minimumFractionDigits) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits,
  });
}

function createResultSection() {
  let resultSection = document.createElement("section");
  resultSection.setAttribute("class", "result");
  resultSection = appendResultSectionElements(resultSection);

  return resultSection;
}

function appendResultSectionElements(parent) {
  const sectionTitle = createSectionTitle();
  const resultGrid = createResultGrid();

  parent.appendChild(sectionTitle);
  parent.appendChild(resultGrid);

  return parent;
}

function createSectionTitle() {
  const sectionTitle = document.createElement("h2");
  sectionTitle.textContent = "Detalhes da conversão";

  return sectionTitle;
}

function createResultGrid() {
  let resultGrid = document.createElement("div");
  resultGrid.setAttribute("class", "result-container");

  resultGrid = appendResultGridColumns(
    resultGrid,
    createGridLeftColumn(),
    createGridRightColumn()
  );

  return resultGrid;
}

function appendResultGridColumns(parent, leftColumn, rightColumn) {
  parent.appendChild(leftColumn);
  parent.appendChild(rightColumn);

  return parent;
}

function createGridLeftColumn() {
  let leftColumn = document.createElement("div");
  leftColumn.setAttribute("class", "left-column");

  appendGridLeftColumnElements(leftColumn);
  return leftColumn;
}

function createGridLeftColumnElements() {
  const variationText = document.createElement("p");
  variationText.textContent = "Taxas de variação:";

  const variationResult = document.createElement("p");
  variationResult.innerHTML =
    'BID: <span id="var-bid-result"></span> &nbsp;|&nbsp; ASK: <span id="var-ask-result"></span>';

  const exchangeResultText = document.createElement("label");
  exchangeResultText.setAttribute("for", "exchange-result");
  exchangeResultText.textContent = "Resultado da conversão:";

  const exchangeResult = document.createElement("input");
  exchangeResult.setAttribute("type", "text");
  exchangeResult.setAttribute("id", "exchange-result");
  exchangeResult.setAttribute("readonly", "true");

  return [variationText, variationResult, exchangeResultText, exchangeResult];
}

function appendGridLeftColumnElements(parent) {
  const [variationText, variationResult, exchangeResultText, exchangeResult] =
    createGridLeftColumnElements();

  parent.appendChild(variationText);
  parent.appendChild(variationResult);
  parent.appendChild(exchangeResultText);
  parent.appendChild(exchangeResult);

  return parent;
}

function createGridRightColumn() {
  let rightColumn = document.createElement("div");
  rightColumn.setAttribute("class", "right-column");
  rightColumn = appendGridRightColumnElements(rightColumn);

  return rightColumn;
}

function createGridRightColumnElements() {
  const highestQuotationText = document.createElement("label");
  highestQuotationText.setAttribute("for", "highest-quot-result");
  highestQuotationText.innerHTML = "Maior cotação <span>(dia)</span>:";

  const highestQuotationResult = document.createElement("input");
  highestQuotationResult.setAttribute("type", "text");
  highestQuotationResult.setAttribute("id", "highest-quot-result");
  highestQuotationResult.setAttribute("readonly", "true");

  const lowestQuotationText = document.createElement("label");
  lowestQuotationText.setAttribute("for", "lowest-quot-result");
  lowestQuotationText.innerHTML = "Menor cotação <span>(dia)</span>:";

  const lowestQuotationResult = document.createElement("input");
  lowestQuotationResult.setAttribute("type", "text");
  lowestQuotationResult.setAttribute("id", "lowest-quot-result");
  lowestQuotationResult.setAttribute("readonly", "true");

  return [
    highestQuotationText,
    highestQuotationResult,
    lowestQuotationText,
    lowestQuotationResult,
  ];
}

function appendGridRightColumnElements(parent) {
  const [
    highestQuotationText,
    highestQuotationResult,
    lowestQuotationText,
    lowestQuotationResult,
  ] = createGridRightColumnElements();

  parent.appendChild(highestQuotationText);
  parent.appendChild(highestQuotationResult);
  parent.appendChild(lowestQuotationText);
  parent.appendChild(lowestQuotationResult);

  return parent;
}

function displayElements(data) {
  const exchangeContainer = document.querySelector("div.exchange-card");
  const result = document.querySelector("section.result");
  const buttonContainer = document.querySelector("div.btn-container");
  const resultSection = createResultSection();

  insertResultData(resultSection, data);

  if (result) {
    exchangeContainer.removeChild(result);
  }

  exchangeContainer.insertBefore(resultSection, buttonContainer);
}

function insertResultData(resultSection, data) {
  const varBidResult = resultSection.querySelector("span#var-bid-result");
  const varAskResult = resultSection.querySelector("span#var-ask-result");
  const exchangeResult = resultSection.querySelector("input#exchange-result");
  const highestQuotationResult = resultSection.querySelector(
    "input#highest-quot-result"
  );
  const lowestQuotationResult = resultSection.querySelector(
    "input#lowest-quot-result"
  );

  varBidResult.textContent = `${data.varBidValue}%`;
  varAskResult.textContent = `${data.varAskValue}%`;
  exchangeResult.value = data.exchangeValue;
  lowestQuotationResult.value = data.lowestValue;
  highestQuotationResult.value = data.highestValue;
}
