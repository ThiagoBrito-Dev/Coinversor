function formatInputValue() {
  const selectedCurrency = document.getElementById("currency-select").value;
  const exchangeInput = document.getElementById("exchange-input");
  let exchangeValue = exchangeInput.value;

  if (!exchangeValue.includes(",")) {
    exchangeValue = Number(exchangeValue.replace(/\D/g, ""));

    if (!exchangeValue) {
      exchangeValue = 1;
    }

    const formattedExchangeValue = convertToCurrencyFormat(
      exchangeValue,
      selectedCurrency,
      0
    );

    exchangeInput.value = formattedExchangeValue;
  } else {
    let splittedExchangeValue = exchangeValue
      .replace(/[^0-9,]/g, "")
      .split(",");
    let exchangeIntValue = Number(splittedExchangeValue.shift());

    exchangeIntValue = convertToCurrencyFormat(
      exchangeIntValue,
      selectedCurrency,
      0
    );

    const exchangeDeciValue = splittedExchangeValue.join("");
    exchangeInput.value = exchangeIntValue + "," + exchangeDeciValue;
  }
}

async function exchange() {
  const selectedCurrency = document.getElementById("currency-select").value;
  const exchangeInput = document.getElementById("exchange-input");
  let exchangeValue = Number(
    exchangeInput.value.replace(/[^0-9,]/g, "").replace(",", ".")
  );

  if (!exchangeValue) {
    exchangeValue = exchangeInput.value = 1;
  }

  try {
    const selectedCurrencyData = await fetch(
      `https://economia.awesomeapi.com.br/json/last/${selectedCurrency}-BRL`
    ).then((response) => {
      if (response.status === 200 && response.ok) {
        return response.json();
      } else {
        throw new Error(
          "Desculpe, mas não foi possível realizar o câmbio desta moeda. Por favor, tente novamente!"
        );
      }
    });

    const exchangeType = `${selectedCurrency}BRL`;
    const { varBid, pctChange, ask, high, low } =
      selectedCurrencyData[exchangeType];

    const resultData = {
      varBid: varBid.replace(".", ","),
      varAsk: pctChange.replace(".", ","),
      exchangeResult: convertToCurrencyFormat(exchangeValue * ask, "BRL", 4),
      highestQuot: convertToCurrencyFormat(Number(high), "BRL", 4),
      lowestQuot: convertToCurrencyFormat(Number(low), "BRL", 4),
    };

    displayElements(resultData);
    exchangeInput.value = "";
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

function displayElements(data) {
  const exchangeCard = document.querySelector("div.exchange-card");
  const existentResultSection = document.querySelector("section.result");
  const resultSection = createResultSection();
  const sectionTitle = resultSection.querySelector("h2");
  const actionsContainer = document.querySelector("div.card-actions");

  insertExchangeResultData(resultSection, data);

  if (existentResultSection) {
    exchangeCard.removeChild(existentResultSection);
  }

  exchangeCard.insertBefore(resultSection, actionsContainer);
  sectionTitle.focus(); // for accessibility purposes
}

function createResultSection() {
  let resultSection = document.createElement("section");
  resultSection.setAttribute("class", "result");
  resultSection = appendResultSectionElements(resultSection);

  return resultSection;
}

function appendResultSectionElements(resultSection) {
  const sectionTitle = createSectionTitle();
  const sectionContent = createSectionContent();

  resultSection.appendChild(sectionTitle);
  resultSection.appendChild(sectionContent);

  return resultSection;
}

function createSectionTitle() {
  const sectionTitle = document.createElement("h2");
  sectionTitle.setAttribute("tabindex", "-1");
  sectionTitle.textContent = "Detalhes da conversão";

  return sectionTitle;
}

function createSectionContent() {
  let sectionContent = document.createElement("div");
  sectionContent.setAttribute("class", "section-content");

  sectionContent = appendContentElements(
    sectionContent,
    createContentLeftColumn(),
    createContentRightColumn()
  );

  return sectionContent;
}

function createContentLeftColumn() {
  let leftColumn = document.createElement("div");
  leftColumn.setAttribute("class", "left-column");

  appendLeftColumnElements(leftColumn);
  return leftColumn;
}

function appendLeftColumnElements(leftColumn) {
  const [
    variationWrapper,
    variationText,
    variationResult,
    expressionResultWrapper,
    exchangeResultText,
    exchangeResult,
  ] = createLeftColumnElements();

  variationWrapper.appendChild(variationText);
  variationWrapper.appendChild(variationResult);
  leftColumn.appendChild(variationWrapper);

  expressionResultWrapper.appendChild(exchangeResultText);
  expressionResultWrapper.appendChild(exchangeResult);
  leftColumn.appendChild(expressionResultWrapper);

  return leftColumn;
}

function createLeftColumnElements() {
  const variationWrapper = document.createElement("div");
  variationWrapper.setAttribute("class", "data-wrapper");

  const variationText = document.createElement("p");
  variationText.textContent = "Taxas de variação:";

  const variationResult = document.createElement("p");
  variationResult.innerHTML = `BID: 
    <span id="bid-variation"></span> 
    &nbsp;|&nbsp; ASK: 
    <span id="ask-variation"></span>`;

  const exchangeResultWrapper = document.createElement("div");
  exchangeResultWrapper.setAttribute("class", "data-wrapper");

  const exchangeResultText = document.createElement("label");
  exchangeResultText.setAttribute("for", "exchange-result");
  exchangeResultText.textContent = "Resultado da conversão:";

  const exchangeResult = document.createElement("input");
  exchangeResult.setAttribute("type", "text");
  exchangeResult.setAttribute("id", "exchange-result");
  exchangeResult.setAttribute("readonly", "true");

  return [
    variationWrapper,
    variationText,
    variationResult,
    exchangeResultWrapper,
    exchangeResultText,
    exchangeResult,
  ];
}

function createContentRightColumn() {
  let rightColumn = document.createElement("div");
  rightColumn.setAttribute("class", "right-column");
  rightColumn = appendRightColumnElements(rightColumn);

  return rightColumn;
}

function appendRightColumnElements(rightColumn) {
  const [
    highestQuotWrapper,
    highestQuotationText,
    highestQuotationResult,
    lowestQuotWrapper,
    lowestQuotationText,
    lowestQuotationResult,
  ] = createRightColumnElements();

  highestQuotWrapper.appendChild(highestQuotationText);
  highestQuotWrapper.appendChild(highestQuotationResult);
  rightColumn.appendChild(highestQuotWrapper);

  lowestQuotWrapper.appendChild(lowestQuotationText);
  lowestQuotWrapper.appendChild(lowestQuotationResult);
  rightColumn.appendChild(lowestQuotWrapper);

  return rightColumn;
}

function createRightColumnElements() {
  const highestQuotWrapper = document.createElement("div");
  highestQuotWrapper.setAttribute("class", "data-wrapper");

  const highestQuotText = document.createElement("label");
  highestQuotText.setAttribute("for", "highest-quotation");
  highestQuotText.innerHTML = "Maior cotação <span>(dia)</span>:";

  const highestQuotResult = document.createElement("input");
  highestQuotResult.setAttribute("type", "text");
  highestQuotResult.setAttribute("id", "highest-quotation");
  highestQuotResult.setAttribute("readonly", "true");

  const lowestQuotWrapper = document.createElement("div");
  lowestQuotWrapper.setAttribute("class", "data-wrapper");

  const lowestQuotText = document.createElement("label");
  lowestQuotText.setAttribute("for", "lowest-quotation");
  lowestQuotText.innerHTML = "Menor cotação <span>(dia)</span>:";

  const lowestQuotResult = document.createElement("input");
  lowestQuotResult.setAttribute("type", "text");
  lowestQuotResult.setAttribute("id", "lowest-quotation");
  lowestQuotResult.setAttribute("readonly", "true");

  return [
    highestQuotWrapper,
    highestQuotText,
    highestQuotResult,
    lowestQuotWrapper,
    lowestQuotText,
    lowestQuotResult,
  ];
}

function appendContentElements(sectionContent, leftColumn, rightColumn) {
  sectionContent.appendChild(leftColumn);
  sectionContent.appendChild(rightColumn);

  return sectionContent;
}

function insertExchangeResultData(resultSection, data) {
  const varBidSpan = resultSection.querySelector("span#bid-variation");
  const varAskSpan = resultSection.querySelector("span#ask-variation");
  const resultInput = resultSection.querySelector("input#exchange-result");
  const highestQuotInput = resultSection.querySelector(
    "input#highest-quotation"
  );
  const lowestQuotInput = resultSection.querySelector("input#lowest-quotation");

  varBidSpan.textContent = `${data.varBid}%`;
  varAskSpan.textContent = `${data.varAsk}%`;
  resultInput.value = data.exchangeResult;
  lowestQuotInput.value = data.lowestQuot;
  highestQuotInput.value = data.highestQuot;
}
