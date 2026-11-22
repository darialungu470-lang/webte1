<template>
  <footer class="app-footer">
    <details class ="footer-desc">
      <summary>O projekte</summary>

      <div class="footer-content">
        <p>
          Môj TODO List je webová aplikácia na správu osobných úloh
          a ich plánovanie v kalendári.
        </p>

        <p>
          Použité technológie: HTML, CSS, JavaScript, Vue 3, Vite,
          FullCalendar a Fetch API.
        </p>

        <a href="https://wt1zadanie.iolab.sk/docs">Dokumentácia REST API</a>
      </div>
    </details>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: 0.85rem clamp(0.75rem, 3vw, 2rem);
  border-top: 1px solid #e8cd7b;
  background: var(--color-yellow, #ffe59a);
  color: #34242c;
}

.app-footer summary {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
}

.app-footer summary::-webkit-details-marker {
  display: none;
}

.app-footer summary::before {
  content: "";
  width: 0.45rem;
  height: 0.45rem;
  margin-inline: 0.25rem;
  border-right: 2px solid #b51766;
  border-bottom: 2px solid #b51766;
  transform: rotate(-45deg);
}

.app-footer details[open] summary::before {
  transform: rotate(45deg);
}

.footer-desc{
  display: flex;
  align-items: flex-start;
  gap: 3rem;

}

@media(max-width: 56rem){
  .footer-desc{
    display: block;
  }
}

.footer-content {
  display: grid;
  justify-items: start;
  gap: 0.65rem;
  max-width: 46rem;
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 65%);
  line-height: 1.5;
}

.footer-content p {
  margin: 0;
}

.footer-content a {
  color: #72123b;
  font-weight: 600;
  text-underline-offset: 0.2em;
}

.footer-content a:hover {
  color: #b51766;
}

.app-footer summary:focus-visible,
.footer-content a:focus-visible {
  outline: 2px solid #72123b;
  outline-offset: 3px;
}
</style>