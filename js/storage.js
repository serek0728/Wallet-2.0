// Storage.js
const STORAGE_KEY = 'wallet-transactions'

export function getTransactionsFromStorage() {
	const storedTransactions = localStorage.getItem(STORAGE_KEY)

	if (!storedTransactions) {
		return []
	}

	try {
		return JSON.parse(storedTransactions)
	} catch (error) {
		console.error('Błąd podczas odczytu danych z localStorage:', error)
		return []
	}
}

export function saveTransactionsToStorage(transactions) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export function clearTransactionsFromStorage() {
	localStorage.removeItem(STORAGE_KEY)
}
