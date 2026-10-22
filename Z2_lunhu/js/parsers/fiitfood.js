
function parseMeal(element) {
    // Typ jedla: P., 1., 2., 3.
    const type = element.querySelector("span.brand:not(.price)")
        ?.textContent.trim() ?? "";

    // Cena
    const price = element.querySelector(".price")
        ?.textContent.trim() ?? "";

    // Získame iba text jedla, bez typu a ceny
    const text = Array.from(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    // Alergény, napríklad A:1,3,7
    const allergenMatch = text.match(/A:\s*([\d,\s]+)/);
    const allergens = allergenMatch
        ? allergenMatch[1].trim()
        : "";

    // Hmotnosť, napríklad 120g,100g,150g alebo 0,3l
    const weightMatch = text.match(
        /\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*,\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))*/i
    );
    const weight = weightMatch ? weightMatch[0] : "";

    // Odstránime alergény, hmotnosť a označenie (V)
    const name = text
        .replace(/A:\s*[\d,\s]+/g, "")
        .replace(/\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*,\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))*/gi, "")
        .replace(/\(V\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

    return {
        type,
        name,
        price,
        subsidizedPrice: "",
        allergens,
        weight
    };
}

export function parseFiitfood(doc) {
    const dayElements = doc.querySelectorAll(
        ".daily-offer > li"
    );

    const days = Array.from(dayElements).map(dayElement => {
        const title = dayElement.querySelector(".day-title")
            ?.textContent.trim() ?? "";

        const [dayName, date] = title.split(",").map(
            part => part.trim()
        );

        const meals = Array.from(
            dayElement.querySelectorAll(".day-offer > li")
        ).map(parseMeal);

        return {
            day: dayName,
            date: date ?? "",
            meals
        };
    });

    return {
        restaurant: "FIITFOOD",
        days
    };
}
