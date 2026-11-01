/* ============================================================
   FIITFOOD MENU PARSER
   Extract structured meal and daily menu data from HTML.
   ============================================================ */

function parseMeal(element) {
    
    // Extract the meal category or type from the heading.
    const type = element.querySelector("span.brand:not(.price)")
        ?.textContent.trim() ?? "";

    // Find the elements containing regular and subsidized prices.
    const price = element.querySelector(".price")
        ?.textContent.trim() ?? "";

    // Extract only direct text nodes to exclude nested HTML elements.
    const text = Array.from(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    // Extract allergen information and remove parentheses.
    const allergenMatch = text.match(/A:\s*([\d,\s]+)/);
    const allergens = allergenMatch
        ? allergenMatch[1].trim()
        : "";

    // Weight, for example 120g, 100g, 150g, or 0.3l
    const weightMatch = text.match(
        /\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*,\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))*/i
    );
    const weight = weightMatch ? weightMatch[0] : "";

    // We remove allergens, weight, and the (V) label
    const name = text
        .replace(/A:\s*[\d,\s]+/g, "")
        .replace(/\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*,\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))*/gi, "")
        .replace(/\(V\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

    // Return the extracted meal data as a structured object.
    return {
        type,
        name,
        price,
        subsidizedPrice: "",
        allergens,
        weight
    };
}

/* ============================================================
   DAILY MENU PARSER
   Extract all available days and their associated meals.
   ============================================================ */

export function parseFiitfood(doc) {

    // Find navigation links pointing to individual daily menus.
    const dayElements = doc.querySelectorAll(
        ".daily-offer > li"
    );

    // Process each day link and extract its corresponding meals.
    const days = Array.from(dayElements).map(dayElement => {

        // Extract the day name displayed in the navigation.
        const title = dayElement.querySelector(".day-title")
            ?.textContent.trim() ?? "";

        // Extract date from the title, if present, and split it into day name and date.
        const [dayName, date] = title.split(",").map(
            part => part.trim()
        );

        // Parse all meals belonging to the day, if the section exists.
        const meals = Array.from(
            dayElement.querySelectorAll(".day-offer > li")
        ).map(parseMeal);

        // Return the structured menu data for this day.
        return {
            day: dayName,
            date: date ?? "",
            meals
        };
    });

    // Return the complete restaurant menu.
    return {
        restaurant: "FIITFOOD",
        days
    };
}
