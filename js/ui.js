// UI.js
import { formatCurrency, formatDate } from './utils.js'

export const DOM = {
	balanceValue: document.querySelector('#balanceAmount'),
	incomeValue: document.querySelector('#incomeAmount'),
	expenseValue: document.querySelector('#expenseAmount'),
	transactionsList: document.querySelector('#transactionsList'),
	emptyState: document.querySelector('#emptyState'),
	transactionForm: document.querySelector('#transactionForm'),
	transactionModal: document.querySelector('#modalOverlay'),
	openModalButton: document.querySelector('#openAddTransactionModal'),
	closeModalButton: document.querySelector('#closeModal'),
	cancelTransactionButton: document.querySelector('#cancelTransaction'),
	transactionDateInput: document.querySelector('#transactionDate'),
	transactionsCount: document.querySelector('#transactionsCount'),
}

export function renderSummary(summary) {
	DOM.balanceValue.textContent = formatCurrency(summary.balance)
	DOM.incomeValue.textContent = formatCurrency(summary.income)
	DOM.expenseValue.textContent = formatCurrency(summary.expense)
}

export function renderTransactions(transactions) {
	DOM.transactionsList.innerHTML = ''

	if (!transactions.length) {
		showEmptyState()
		updateTransactionsCount(0)
		return
	}

	hideEmptyState()
	updateTransactionsCount(transactions.length)

	transactions.forEach(transaction => {
		const transactionElement = createTransactionElement(transaction)
		DOM.transactionsList.appendChild(transactionElement)
	})
}

export function createTransactionElement(transaction) {
	const transactionItem = document.createElement('div')
	transactionItem.classList.add('transaction-item')
	transactionItem.dataset.id = transaction.id
	transactionItem.dataset.type = transaction.type

	transactionItem.innerHTML = `
    <div class="transaction-item__left">
      <div class="transaction-item__icon">
        <i class="fas ${transaction.type === 'income' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
      </div>

      <div class="transaction-item__content">
        <h3 class="transaction-item__title">${transaction.title}</h3>
        <p class="transaction-item__meta">
          <span>${transaction.category}</span>
          <span>•</span>
          <span>${formatDate(transaction.date)}</span>
        </p>
      </div>
    </div>

    <div class="transaction-item__right">
      <p class="transaction-item__amount ${transaction.type === 'income' ? 'is-income' : 'is-expense'}">
        ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
      </p>

      <button class="transaction-item__delete" data-delete-transaction data-id="${transaction.id}" aria-label="Usuń transakcję">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `

	return transactionItem
}

export function showEmptyState() {
	DOM.emptyState.classList.remove('hidden')
}

export function hideEmptyState() {
	DOM.emptyState.classList.add('hidden')
}

export function updateTransactionsCount(count) {
	DOM.transactionsCount.textContent = `${count} ${count === 1 ? 'transakcja' : count < 5 ? 'transakcje' : 'transakcji'}`
}

export function resetTransactionForm() {
	DOM.transactionForm.reset()
	setDefaultTransactionDate()
}

export function openTransactionModal() {
	DOM.transactionModal.classList.remove('hidden')
	document.body.classList.add('modal-open')
}

export function closeTransactionModal() {
	DOM.transactionModal.classList.add('hidden')
	document.body.classList.remove('modal-open')
}

export function setDefaultTransactionDate() {
	if (!DOM.transactionDateInput) return

	const today = new Date().toISOString().split('T')[0]
	DOM.transactionDateInput.value = today
}

export function populateCategoryOptions() {
	const categorySelect = document.querySelector('#transactionCategory')
	const typeSelect = document.querySelector('#transactionType')

	if (!categorySelect || !typeSelect) return

	const categories = {
		income: ['Wynagrodzenie', 'Freelance', 'Premia', 'Zwrot', 'Sprzedaż', 'Inne'],
		expense: ['Jedzenie', 'Transport', 'Mieszkanie', 'Rozrywka', 'Zdrowie', 'Zakupy', 'Subskrypcje', 'Inne'],
	}

	function renderOptions(type) {
		categorySelect.innerHTML = '<option value="">Wybierz kategorię</option>'

		if (!categories[type]) return

		categories[type].forEach(category => {
			const option = document.createElement('option')
			option.value = category
			option.textContent = category
			categorySelect.appendChild(option)
		})
	}

	typeSelect.addEventListener('change', () => {
		renderOptions(typeSelect.value)
	})

	renderOptions(typeSelect.value)
}

export const THEME_KEY = 'wallet-theme'

export function applyTheme(theme) {
	const themeIcon = document.querySelector('.theme-toggle i')

	if (theme === 'dark') {
		document.body.classList.add('dark-mode')

		if (themeIcon) {
			themeIcon.classList.remove('fa-moon')
			themeIcon.classList.add('fa-sun')
		}
	} else {
		document.body.classList.remove('dark-mode')

		if (themeIcon) {
			themeIcon.classList.remove('fa-sun')
			themeIcon.classList.add('fa-moon')
		}
	}
}

export function getSavedTheme() {
	return localStorage.getItem(THEME_KEY) || 'light'
}

export function saveTheme(theme) {
	localStorage.setItem(THEME_KEY, theme)
}

export function toggleTheme() {
	const isDark = document.body.classList.contains('dark-mode')
	const newTheme = isDark ? 'light' : 'dark'

	applyTheme(newTheme)
	saveTheme(newTheme)
}
