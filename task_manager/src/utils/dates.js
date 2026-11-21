const dateFormatter = new Intl.DateTimeFormat('sk-SK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}