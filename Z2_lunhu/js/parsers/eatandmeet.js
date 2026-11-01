/* ============================================================
   EAT & MEET MENU PARSER
   Extract structured meal and daily menu data from HTML.
   ============================================================ */

function parseMeal(menu) {

    // Extract the meal category or type from the heading.
    const type = menu.querySelector("h4")?.textContent.trim() ?? "";

    // Find the elements containing regular and subsidized prices.
    const priceElement = menu.querySelector(".price");
    const subsidizedElement = priceElement?.querySelector("span");

    // Extract the regular price before the "/" separator.
    const price = priceElement?.firstChild?.textContent
        .split("/")[0].trim() ?? "";

    // Extract the subsidized price from the nested span element.
    const subsidizedPrice =
        subsidizedElement?.textContent.trim() ?? "";

    // Find the element containing the meal description.
    const description = menu.querySelector(".desc");

    // Extract only direct text nodes to exclude nested HTML elements.
    const name = Array.from(description?.childNodes ?? [])
        .filter(node => node.nodeType === 3)
        .map(node => node.textContent.trim())
        .join(" ");

    // Extract allergen information and remove parentheses.
    const allergens = description?.querySelector("span")
        ?.textContent.replace(/[()]/g, "").trim() ?? "";

    // Return the extracted meal data as a structured object.
    return {
        type,
        name,
        price,
        subsidizedPrice,
        allergens
    };
}


/* ============================================================
   DAILY MENU PARSER
   Extract all available days and their associated meals.
   ============================================================ */

export function parseEatAndMeet(doc) {

    // Find navigation links pointing to individual daily menus.
    const dayLinks = doc.querySelectorAll(
        ".tabs-link a[href^='#day-']"
    );

    // Process each day link and extract its corresponding meals.
    const days = Array.from(dayLinks).map(link => {

        // Extract the day name displayed in the navigation.
        const dayName = link.textContent.trim();

        // Extract the target element ID without the "#" character.
        const dayId = link.getAttribute("href").slice(1);

        // Find the HTML section containing the selected day's menu.
        const dayElement = doc.getElementById(dayId);

        // Parse all meals belonging to the day, if the section exists.
        const meals = dayElement
            ? Array.from(
                dayElement.querySelectorAll(".menu-details")
              ).map(parseMeal)
            : [];

        // Return the structured menu data for this day.
        return {
            day: dayName,
            dayId,
            meals
        };
    });

    // Return the complete restaurant menu.
    return {
        restaurant: "Eat & Meet",
        days
    };
}
