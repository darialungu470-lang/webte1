<template>
  <footer class="app-footer">
    <details>
      <summary>O projekte</summary>

      <p>
        Môj TODO List je webová aplikácia na správu osobných úloh
        a ich plánovanie v kalendári.
      </p>

      <p>
        Použité technológie: HTML, CSS, JavaScript, Vue 3, Vite,
        FullCalendar a Fetch API.
      </p>

      <a href="https://wt1zadanie.iolab.sk/docs">Dokumentácia REST API</a>
    </details>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: 1rem 2rem;
  background: var(--color-yellow);
}

summary {
  cursor: pointer;
  font-weight: 700;
}
</style>