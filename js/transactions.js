// transactions.js
import { generateID, isValidAmount, sanitizeText } from './utils.js'

export function createTransaction(transactionData) {
	const type = transactionData.type
	const amount = Number(transactionData.amount)
	const category = sanitizeText(transactionData.category)
	const title = sanitizeText(transactionData.title)
	const date = transactionData.date
	const note = sanitizeText(transactionData.note || '')

	if (!type || !isValidAmount(amount) || !category || !title || !date) {
		return null
	}

	return {
		id: generateID(),
		type,
		amount,
		category,
		title,
		date,
		note,
		createdAt: new Date().toISOString(),
	}
}

export function addTransaction(transactions, newTransaction) {
	return [newTransaction, ...transactions]
}

export function deleteTransaction(transactions, transactionId) {
	return transactions.filter(transaction => transaction.id !== transactionId)
}

export function clearAllTransactions() {
	return []
}

export function calculateSummary(transactions) {
	const income = transactions
		.filter(transaction => transaction.type === 'income')
		.reduce((sum, transaction) => sum + transaction.amount, 0)

	const expense = transactions
		.filter(transaction => transaction.type === 'expense')
		.reduce((sum, transaction) => sum + transaction.amount, 0)

	const balance = income - expense

	return {
		balance,
		income,
		expense,
	}
}
