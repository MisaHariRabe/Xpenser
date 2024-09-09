export function getTransactions() {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
}

export function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function deleteTransaction(id) {
    let transactions = getTransactions();
    transactions = transactions.filter(transaction => transaction.id !== parseInt(id));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois en deux chiffres
    const day = String(now.getDate()).padStart(2, '0'); // Jour en deux chiffres
    const hours = String(now.getHours()).padStart(2, '0'); // Heure en deux chiffres
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes en deux chiffres

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
