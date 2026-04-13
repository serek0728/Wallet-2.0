// utils.js
export function generateID() {
	return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

export function sanitizeText(value) {
	if (typeof value !== 'string') return ''
	return value.trim()
}

export function isValidAmount(amount) {
	return typeof amount === 'number' && !Number.isNaN(amount) && amount > 0
}

export function formatCurrency(amount) {
	return new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
	}).format(amount)
}

export function formatDate(dateString) {
	const date = new Date(dateString)

	return new Intl.DateTimeFormat('pl-PL', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date)
}
