
var tableElem = document.getElementById('table');

function setMonthsValue(months) {
    document.getElementById("numMonths").value = months;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatNumberInput(num) {
    num = num.toString().replace(/[^0-9]/g,'');
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return parts.join(".");
}

function clearTable() {
    while (tableElem.rows.length > 1) {
        tableElem.deleteRow(1);
    }
}

function removeFormatNumberInput(num = null) {
    return num.replace(/\./g,'');
}

function validateInputs() {
    const loanAmountInput = document.getElementById("loanAmount");
    const interestRateInput = document.getElementById("interestRate");
    const numMonthsInput = document.getElementById("numMonths");
    return loanAmountInput.validity.valid && interestRateInput.validity.valid && numMonthsInput.validity.valid;
}

function updateTable(tableData) {
    for (const rowData of tableData) {
        const row = tableElem.insertRow();
        console.log('ok')
        for (const key in rowData) {
            const cell = row.insertCell();
            cell.innerHTML = key === 'Month' ? rowData[key] : "$" + formatNumber(rowData[key]);
        }
    }
}

function showErrorAlert() {
    const errorAlert = document.getElementById("errorAlert");
    errorAlert.style.display = "block";
}

function hideErrorAlert() {
    const errorAlert = document.getElementById("errorAlert");
    errorAlert.style.display = "none";
}

function calculateAndDisplay() {
    if (validateInputs()) {
        hideErrorAlert(); // Oculta la alerta en caso de éxito
        const loanAmount = document.getElementById("loanAmount").value;
        const interestRate = document.getElementById("interestRate").value / 100;
        const numMonths = document.getElementById("numMonths").value;
        const addCapital = document.getElementById("addCapital").value;
        const tableData = amortizationTable(loanAmount, interestRate, numMonths, addCapital);
        clearTable();
        updateTable(tableData);
    } else {
        showErrorAlert(); // Muestra la alerta si la validación falla
    }
}

function amortizationTable(loanAmount, interestRate, numMonths, monthlyAddCapital = '') {
    loanAmount = removeFormatNumberInput(loanAmount)
    monthlyAddCapital = removeFormatNumberInput(monthlyAddCapital)

    // Calcular el pago mensual
    var monthlyPayment = loanAmount * interestRate / (1 - Math.pow(1 + interestRate, -numMonths));

    // Crear una tabla vacía para almacenar los resultados
    var table = [];
    var monthlyInterestAccumulated = 0
    var monthlyAddCapitalAccumulated = 0
    var monthlyCapitalAccumulated = 0

    // Loop a través de cada mes
    for (var i = 1; i <= numMonths; i++) {
        // Calcular el interés mensual
        var monthlyInterest = (loanAmount * interestRate);

        // Calcular el capitales mensual
        var monthlyFeeCapital = monthlyPayment - monthlyInterest;
        monthlyAddCapital = monthlyAddCapital !== '' ? parseFloat(monthlyAddCapital) : 0
        var monthlyCapitalTotal = (monthlyPayment + monthlyAddCapital) - monthlyInterest;

        // Restar el capital mensual del saldo restante del préstamo
        loanAmount -= monthlyCapitalTotal;

        // Calcular acumulados
        monthlyInterestAccumulated += monthlyInterest
        monthlyAddCapitalAccumulated += monthlyAddCapital;
        monthlyCapitalAccumulated += monthlyCapitalTotal

        // Agregar los resultados al final de la tabla
        table.push({
            Month: i,
            Payment: monthlyPayment.toFixed(0),
            Interest: monthlyInterest.toFixed(0),
            interestAccumulated: monthlyInterestAccumulated.toFixed(0),
            feeCapital: monthlyFeeCapital.toFixed(0),
            addCapital: monthlyAddCapital,
            addCapitalAccumulated: monthlyAddCapitalAccumulated,
            Capital: monthlyCapitalTotal.toFixed(0),
            capitalAccumulated: monthlyCapitalAccumulated.toFixed(0),
            Balance: loanAmount.toFixed(0)
        });

        if (loanAmount < 0)
            break
    }

    return table;
}
