/* ============================================================
   RIVIERA MENU PARSER
   Extract business menus and daily lunch menus from HTML.
   ============================================================ */

export function parseRiviera(doc) {

    // Find the main HTML container containing the restaurant menu.
    const menu = doc.querySelector(".raw-menu-content");

    // Stop parsing if the menu container does not exist.
    if (!menu) {
        throw new Error("Riviera: menu nebolo nájdené.");
    }

    /* ========================================================
        BUSINESS MENU
        Extract the special business menu and its price.
       ======================================================== */

    // Find the heading identifying the Business Menu section.
    const businessHeading = Array.from(menu.querySelectorAll("strong"))
        .find(element =>
            element.textContent.trim().toUpperCase() === "BUSINESS MENU"
        );

    // Initialize the business menu as null if no section is found.
    let businessMenu = null;

    if (businessHeading) {
        // Extract the complete heading text, including the price.
        const headingText = businessHeading.parentElement.textContent.trim();

        // Extract the price after the "|" separator.
        const price = headingText.split("|")[1]?.trim() ?? "";

        // Locate the paragraphs containing soup and main meal details.
        const headingParagraph = businessHeading.closest("p");
        const soupParagraph = headingParagraph?.nextElementSibling?.nextElementSibling;
        const mealParagraph = soupParagraph?.nextElementSibling;

        // Find span elements containing the individual menu values.
        const soupSpans = soupParagraph?.querySelectorAll("span");
        const mealSpans = mealParagraph?.querySelectorAll("span");

        // Store the extracted Business Menu information.
        businessMenu = {
            price,
            soup: soupSpans?.[0]?.textContent.trim() ?? "",
            name: mealSpans?.[0]?.textContent.trim() ?? "",
            details: mealSpans?.[1]?.textContent.trim() ?? ""
        };
    }

    /* ========================================================
       DAILY MENU CONFIGURATION
       Define the weekdays supported by the parser.
       ======================================================== */

    // List of expected weekday headings in Slovak.
    const dayNames = [
        "PONDELOK",
        "UTOROK",
        "STREDA",
        "ŠTVRTOK",
        "PIATOK"
    ];

    // Find all strong elements that may contain weekday headings.
    const headings = Array.from(menu.querySelectorAll("strong"));

    /* ========================================================
       DAILY MENU PARSING
       Extract each day's date, price, soup, and main meals.
       ======================================================== */

    const days = headings

        // Keep only headings matching the supported weekdays.
        .filter(heading =>
            dayNames.includes(heading.textContent.trim().toUpperCase())
        )
        
        // Convert each weekday section into a structured menu object.
        .map(heading => {

            // Extract the name of the current day.
            const day = heading.textContent.trim();

            // Read the full heading text containing the date and price.
            const fullText = heading.parentElement.textContent.trim();

            // Split the heading into date and price sections.
            const parts = fullText.split("|");

            // Remove the weekday name to obtain the date.
            const date = parts[0]
                .replace(day, "")
                .trim();

            // Extract the daily menu price, if available.
            const price = parts[1]?.trim() ?? "";


            /* ------------------------------------------------
               SOUP PARSING
               Extract soup name and allergen information.
               ------------------------------------------------ */

            // Locate the paragraph containing the soup.
            const dayParagraph = heading.closest("p");
            const soupParagraph = dayParagraph?.nextElementSibling?.nextElementSibling;

            // Find span elements containing soup details.
            const soupSpans = soupParagraph?.querySelectorAll("span");

            // Extract the soup name and additional information.
            const soupName = soupSpans?.[0]?.textContent.trim() ?? "";
            const soupDetails = soupSpans?.[1]?.textContent.trim() ?? "";

            // Extract allergens from the text after the "|" separator.
            const allergens = soupDetails.split("|")[1]?.trim() ?? "";

            // Initialize the array of meals for the current day.
            const meals = [];

            // Add the soup only if its name is available.
            if (soupName) {
                meals.push({
                    type: "Polievka",
                    name: soupName,
                    price: "",
                    subsidizedPrice: "",
                    allergens
                });
            }

            /* ------------------------------------------------
                MAIN MEAL PARSING
                Extract meal names, weights, and allergens.
               ------------------------------------------------ */

            // Locate the paragraph containing the main meals.
            const mainMealsParagraph = soupParagraph?.nextElementSibling;

            // Convert meal span elements into an array.
            const mainMealSpans = mainMealsParagraph
                ? Array.from(mainMealsParagraph.querySelectorAll("span"))
                : [];

            // Process spans in pairs: meal name followed by details.
            for (let i = 0; i + 1 < mainMealSpans.length; i += 2) {

                // Extract the meal name and remove its numeric prefix.
                const name = mainMealSpans[i].textContent
                    .trim()
                    .replace(/^\d+\.\s*/, "");

                // Extract the text containing weight and allergens.
                const details = mainMealSpans[i + 1].textContent.trim();

                // Separate weight and allergen information.
                const [weight, allergenText] = details
                    .split("|")
                    .map(part => part.trim());

                // Skip meals without a valid name.
                if (!name) continue;

                // Add the parsed main meal to the current day's menu.
                meals.push({
                    type: "Hlavné jedlo",
                    name,
                    price: "",
                    subsidizedPrice: "",
                    allergens: allergenText ?? "",
                    weight: weight ?? ""
                });
            }

            /* ------------------------------------------------
               DAILY MENU RESULT
               Return the extracted information for one day.
               ------------------------------------------------ */

            return {
                day,
                date,
                price,
                meals
            };
        });

    /* ========================================================
       FINAL PARSER RESULT
       Return all extracted Riviera restaurant data.
       ======================================================== */

    return {
        restaurant: "Riviera",
        businessMenu,
        days
    };
}
