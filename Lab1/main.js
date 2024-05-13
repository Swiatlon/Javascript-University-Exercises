document.addEventListener('DOMContentLoaded', function () {
  const inputContainer = document.getElementById('input-container');
  const addFieldBtn = document.getElementById('add-field-btn');
  const sumDisplay = document.getElementById('sum');
  const averageDisplay = document.getElementById('average');
  const minDisplay = document.getElementById('min');
  const maxDisplay = document.getElementById('max');

  function addInputField() {
    const newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.classList.add('number-input');
    newInput.placeholder = 'value'
    newInput.addEventListener('input', updateCalculations);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Usuń';
    removeBtn.addEventListener('click', function () {
      newInput.remove();
      removeBtn.remove();
      updateCalculations();
    });

    inputContainer.appendChild(newInput);
    inputContainer.appendChild(removeBtn);
    updateCalculations();
  }

  function updateCalculations() {
    const inputs = document.querySelectorAll('.number-input');
    let values = Array.from(inputs).map((input) => parseFloat(input.value) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = values.length > 0 ? sum / values.length : 0;
    const min = Math.min(...values);
    const max = Math.max(...values);

    sumDisplay.textContent = sum;
    averageDisplay.textContent = average.toFixed(2);
    minDisplay.textContent = values.length > 0 ? min : 0;
    maxDisplay.textContent = values.length > 0 ? max : 0;
  }

  addFieldBtn.addEventListener('click', addInputField);

  addInputField();
  addInputField();
  addInputField();
});
