document.addEventListener('DOMContentLoaded', function () {
  const cardTypes = ['Feature', 'Bug', 'Tech Debt'];
  const costs = [1, 2, 3, 4, 5]; // Adjusted costs
  const benefits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const featureDiscounts = [1, 2];
  const expenses = [1, 2];
  let amountToSpend = 5;
  let amountSpent = 0;
  let amountSpentTotal = 0; // Initialize running total
  let featureDiscountsTotal = 0;
  let expenseSaved = 0;
  let costSaved = 0;
  let totalBenefit = 0;
  let dealCount = 1; // Start Deal Count at 1


  function updateCardStats(cardElement) {
    const type = cardElement.getAttribute('data-type');
    const benefit = parseInt(cardElement.getAttribute('data-benefit') || 0);
    const featureDiscount = parseInt(cardElement.getAttribute('data-feature-discount') || 0);
    const expense = parseInt(cardElement.getAttribute('data-expense') || 0);
    var cost = parseInt(cardElement.getAttribute('data-cost'));
  
    if (type === 'Feature') {
      totalBenefit += benefit;
      let applicableCostSaved = Math.min(featureDiscountsTotal, cost);
      costSaved += applicableCostSaved;
      cost = cost - applicableCostSaved;
      // Update the card display with the discounted cost only if a discount is applied
      if (applicableCostSaved > 0) {
        cardElement.innerHTML = `<h4>${type}</h4><p><s>Cost: ${cost}</s> ${cost - applicableCostSaved}</p>` +
          (benefit ? `<p>Benefit: ${benefit}</p>` : '');
      } else {
        cardElement.innerHTML = `<h4>${type}</h4><p>Cost: ${cost}</p>` +
          (benefit ? `<p>Benefit: ${benefit}</p>` : '');
      }
    } else if (type === 'Tech Debt') {
      featureDiscountsTotal += featureDiscount;
      cardElement.innerHTML = `<h4>${type}</h4><p>Cost: ${cost}</p>` +
          (featureDiscount ? `<p>Feature Discount: ${featureDiscount}</p>` : '');
    } else if (type === 'Bug') {
      expenseSaved += expense;
      cardElement.innerHTML = `<h4>${type}</h4><p>Cost: ${cost}</p>` +
          (expense ? `<p>Expense: ${expense}</p>` : '');
    }
    amountSpentTotal += cost; // Add spent amount to total
  }
  

  function updateStatsDisplay() {
    console.log("Updating stats display...");  // Debug: Confirm function call
    console.log("Amount to Spend:", amountToSpend);  // Debug: Check variable value
    console.log("Amount Spent:", amountSpent);  // Debug: Check variable value
    console.log("Amount Spent Total:", amountSpentTotal);  // Debug: Check variable value

    document.getElementById('amount-to-spend').textContent = amountToSpend;
    document.getElementById('amount-spent').textContent = amountSpent;
    document.getElementById('amount-spent-total').textContent = amountSpentTotal;
    document.getElementById('total-benefit').textContent = totalBenefit;
    document.getElementById('feature-discounts').textContent = featureDiscountsTotal;
    document.getElementById('expense-saved').textContent = expenseSaved;
    document.getElementById('cost-saved').textContent = costSaved;
    document.getElementById('deal-count').textContent = dealCount;
}


  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var cardElement = document.getElementById(data);
    const cost = parseInt(cardElement.getAttribute('data-cost'));

    if (cost > amountToSpend) {
      alert("Not enough Amount to Spend. This card costs more than you can afford.");
      return;
    }

    if (ev.target.className.includes('card-container')) {
      ev.target.appendChild(cardElement);
      amountToSpend -= cost;
      amountSpent += cost;
      updateCardStats(cardElement);
      updateStatsDisplay();
    }
  }

  document.getElementById('deal-button').addEventListener('click', function() {
    amountToSpend = 5;
    amountSpent = 0;
    dealCount += 1; // Increment deal count
    let newDeck = createDeck();
    displayCards(newDeck.slice(0, 4));
    updateStatsDisplay();
  });

  function createDeck() {
    let deck = [];
    for (let i = 0; i < 48; i++) {
      let typeIndex = Math.floor(Math.random() * cardTypes.length);
      let type = cardTypes[typeIndex];
      let cost = costs[Math.floor(Math.random() * costs.length)];
      let card = { type, cost, id: i, benefit: 0, featureDiscount: 0, expense: 0 };

      if (type === 'Feature') {
        card.benefit = benefits[Math.floor(Math.random() * benefits.length)];
      }
      if (type === 'Tech Debt') {
        card.featureDiscount = featureDiscounts[Math.floor(Math.random() * featureDiscounts.length)];
      }
      if (type === 'Bug') {
        card.expense = expenses[Math.floor(Math.random() * expenses.length)];
      }

      deck.push(card);
    }
    return deck;
  }

  function displayCards(cards) {
    const container = document.getElementById('card-deck');
    container.innerHTML = '';
    cards.forEach(card => {
      let cardElement = document.createElement('div');
      cardElement.className = 'card ' + card.type.toLowerCase().replace(/\s+/g, '-');
      cardElement.id = `card-${card.id}`;
      cardElement.setAttribute('data-type', card.type);
      cardElement.setAttribute('data-cost', card.cost);
      if (card.benefit) cardElement.setAttribute('data-benefit', card.benefit);
      if (card.featureDiscount) cardElement.setAttribute('data-feature-discount', card.featureDiscount);
      if (card.expense) cardElement.setAttribute('data-expense', card.expense);
      cardElement.draggable = true;
      cardElement.addEventListener('dragstart', drag);
      cardElement.innerHTML = `<h4>${card.type}</h4><p>Cost: ${card.cost}</p>` +
        (card.benefit ? `<p>Benefit: ${card.benefit}</p>` : '') +
        (card.featureDiscount ? `<p>Feature Discount: ${card.featureDiscount}</p>` : '') +
        (card.expense ? `<p>Expense: ${card.expense}</p>` : '');
      container.appendChild(cardElement);
    });
  }

  let initialDeck = createDeck();
  displayCards(initialDeck.slice(0, 4));
  updateStatsDisplay();
  document.getElementById('card-deck').addEventListener('dragover', allowDrop);
  document.getElementById('played-cards').addEventListener('dragover', allowDrop);
  document.getElementById('played-cards').addEventListener('drop', drop);
});

