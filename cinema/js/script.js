const SOURCE_URL = "source/kino-hviezda.html";

async function loadCinemaHtml() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Stránku kina sa nepodarilo načítať (HTTP ${response.status}).`);
  }
  return response.text();
}

function parseHtml(html) {
  return new DOMParser().parseFromString(html, "text/html");
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}




function parseCinema(doc) {
  const days = [];
  for (const section of doc.querySelectorAll(".den")) {
    const heading = section.querySelector("h2");
    const screenings = [];
    for (const film of section.querySelectorAll(".film")) {
      screenings.push({
        time: cleanText(film.querySelector(".cas").textContent),
        title: cleanText(film.querySelector(".nazov").textContent),
        hall: cleanText(film.querySelector(".sala").textContent),
        price: parsePrice(film.querySelector(".cena")?.textContent),
      });
    }
    days.push({
      day: cleanText(heading.firstChild.textContent),
      date: cleanText(heading.querySelector("small").textContent),
      screenings,
    });
  }

  console.table(parseCinema(doc)[0].screenings)

  return days;
}

function parsePrice(text) {
  if (!text) {
    return null;
  }
  const price = parseFloat(text.replace(",", "."));
  return Number.isNaN(price) ? null : price;
}




async function main() {
    const html = await loadCinemaHtml();
    console.log(html.length);

    const doc = parseHtml(html);
    console.log(doc.title, doc.querySelectorAll(".den").length);

    console.log(parseCinema(doc));
}

}

main();