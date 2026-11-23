// Reuse one formatter for Slovak dates and times in the browser's local time zone.
const dateFormatter = new Intl.DateTimeFormat('sk-SK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

// Convert the API's date string to a Date and format it for display.
export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}