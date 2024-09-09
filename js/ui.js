import { getTransactions, deleteTransaction } from './transaction.js';

// Mettre à jour l'interface utilisateur
export function updateUI() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    const transactions = getTransactions();
    let totalAmount = 0;

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${transaction.description} - ${transaction.amount}MGA (${transaction.category}) - ${transaction.type === 'expense' ? 'Dépense' : 'Gain'} 
            <span class="text-muted">${transaction.dateTime}</span>
            <button class="delete-btn btn btn-danger btn-sm" data-id="${transaction.id}"><i class="fas fa-trash-alt"></i></button>
        `;
        transactionList.appendChild(li);

        // Ajouter de l'animation d'apparition
        setTimeout(() => li.classList.add('appear'), 10);

        // Ajouter ou soustraire le montant en fonction du type de transaction
        totalAmount += transaction.type === 'expense' ? -transaction.amount : transaction.amount;
    });

    // Mettre à jour le budget total et le solde
    document.getElementById('total-budget').textContent = totalAmount.toFixed(2);
    document.getElementById('balance').textContent = (totalAmount).toFixed(2);

    // Ajouter des gestionnaires d'événements pour les boutons de suppression
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            deleteTransaction(id);
            updateUI();  // Mettre à jour l'interface après suppression
        });
    });
}
