// main.js
import { getTransactionsFromStorage, saveTransactionsToStorage, clearTransactionsFromStorage } from './storage.js'

import {
	createTransaction,
	addTransaction,
	deleteTransaction,
	clearAllTransactions,
	calculateSummary,
} from './transactions.js'

import {
	DOM,
	renderSummary,
	renderTransactions,
	resetTransactionForm,
	openTransactionModal,
	closeTransactionModal,
	setDefaultTransactionDate,
	populateCategoryOptions,
	applyTheme,
	getSavedTheme,
	toggleTheme,
} from './ui.js'

let transactions = getTransactionsFromStorage()

function refreshApp() {
	const summary = calculateSummary(transactions)

	renderSummary(summary)
	renderTransactions(transactions)
	saveTransactionsToStorage(transactions)
}

function handleAddTransaction(event) {
	event.preventDefault()

	const formData = new FormData(DOM.transactionForm)

	const transactionData = {
		type: formData.get('transactionType'),
		amount: formData.get('transactionAmount'),
		category: formData.get('transactionCategory'),
		title: formData.get('transactionTitle'),
		date: formData.get('transactionDate'),
		note: formData.get('transactionNote'),
	}

	const newTransaction = createTransaction(transactionData)

	if (!newTransaction) {
		alert('Uzupełnij poprawnie wszystkie pola formularza.')
		return
	}

	transactions = addTransaction(transactions, newTransaction)

	refreshApp()
	resetTransactionForm()
	closeTransactionModal()
}

function handleDeleteTransaction(event) {
	const deleteButton = event.target.closest('[data-delete-transaction]')

	if (!deleteButton) return

	const transactionId = deleteButton.dataset.id

	transactions = deleteTransaction(transactions, transactionId)
	refreshApp()
}

function handleClearAll() {
	const confirmClear = confirm('Czy na pewno chcesz usunąć wszystkie transakcje?')

	if (!confirmClear) return

	transactions = clearAllTransactions()
	clearTransactionsFromStorage()
	refreshApp()
}

function handleOpenModal() {
	openTransactionModal()
}

function handleCloseModal() {
	closeTransactionModal()
}

function handleOverlayClick(event) {
	if (event.target === DOM.transactionModal) {
		closeTransactionModal()
	}
}

function handleThemeToggle() {
	toggleTheme()
}

function bindEvents() {
	DOM.transactionForm.addEventListener('submit', handleAddTransaction)

	DOM.transactionsList.addEventListener('click', handleDeleteTransaction)

	DOM.openModalButton.addEventListener('click', handleOpenModal)
	DOM.closeModalButton.addEventListener('click', handleCloseModal)
	DOM.cancelTransactionButton.addEventListener('click', handleCloseModal)

	DOM.transactionModal.addEventListener('click', handleOverlayClick)

	const clearAllButton = document.querySelector('#deleteAllTransactions')
	if (clearAllButton) {
		clearAllButton.addEventListener('click', handleClearAll)
	}
	const themeToggleButton = document.querySelector('.theme-toggle')

	if (themeToggleButton) {
		themeToggleButton.addEventListener('click', handleThemeToggle)
	}
}

function initApp() {
	const savedTheme = getSavedTheme()
	applyTheme(savedTheme)

	setDefaultTransactionDate()
	populateCategoryOptions()
	bindEvents()
	refreshApp()
}

initApp()
