import { updateUI } from './ui.js';
import { getTransactions, addTransaction, getCurrentDateTime } from './transaction.js';

// Sélection des éléments du DOM
const form = document.getElementById('transaction-form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const categorySelect = document.getElementById('category');
const toggleButton = document.getElementById('toggle-theme');
const alertMessage = document.getElementById('alert-message');
let expensesChart = null;

// Charger les transactions et les catégories au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateUI();
    setupChart();
});

// Charger les catégories depuis le fichier JSON
function loadCategories() {
    fetch('data/categories.json')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des catégories :", error));
}

// Gestionnaire d'événements pour ajouter une nouvelle transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        description: description.value,
        amount: parseFloat(amount.value),
        category: categorySelect.value,
        type: type.value, // Ajouter le type de transaction
        dateTime: getCurrentDateTime() // Ajouter la date et l'heure actuelles
    };

    addTransaction(transaction);
    showMessage('Transaction ajoutée avec succès', 'success');

    // Réinitialiser le formulaire
    description.value = '';
    amount.value = '';

    updateUI();  // Mettre à jour l'interface et le budget total
    setupChart();
});

// Basculer entre les thèmes clair et sombre
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.form-control, .btn').forEach(el => {
        el.classList.toggle('dark-mode');
    });
});

// Fonction pour afficher les messages d'alerte
function showMessage(message, type = 'success') {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.style.display = 'block';

    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}

// Configuration du graphique des dépenses avec Chart.js
function setupChart() {
    const ctx = document.getElementById('expensesChart').getContext('2d');

    // Détruire le graphique existant s'il y en a un
    if (expensesChart) {
        expensesChart.destroy();
    }

    const transactions = getTransactions();

    const categories = [...new Set(transactions.map(t => t.category))];
    const expenseData = categories.map(category => {
        return transactions
            .filter(t => t.category === category && t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    });

    const incomeData = categories.map(category => {
        return transactions
            .filter(t => t.category === category && t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    });

    expensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Dépenses',
                    data: expenseData,
                    backgroundColor: '#ff6384', // Rose pour les dépenses
                    stack: 'Stack 0'
                },
                {
                    label: 'Gains',
                    data: incomeData,
                    backgroundColor: '#36a2eb', // Bleu pour les gains
                    stack: 'Stack 1'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}
