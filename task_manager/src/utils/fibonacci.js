// Return the nth Fibonacci number, starting with F(0) = 0 and F(1) = 1.
export function fibonacci(n) {
  let previous = 0
  let current = 1

  for (let i = 0; i < n; i++) {
    // Add the two consecutive terms to get the next one.
    const next = previous + current

    // Move both variables one position forward in the sequence.
    previous = current
    current = next
  }

  // After n steps, previous holds F(n).
  return previous
}