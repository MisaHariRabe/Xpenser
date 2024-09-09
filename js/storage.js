// Fonction pour sauvegarder les transactions dans le localStorage
export function saveToLocalStorage(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Fonction pour charger les transactions depuis le localStorage
export function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('transactions'));
}
