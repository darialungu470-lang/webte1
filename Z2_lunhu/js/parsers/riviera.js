
export function parseRiviera(doc) {
    const menu = doc.querySelector(".raw-menu-content");

    if (!menu) {
        throw new Error("Riviera: menu nebolo nájdené.");
    }


    const businessHeading = Array.from(menu.querySelectorAll("strong"))
        .find(element =>
            element.textContent.trim().toUpperCase() === "BUSINESS MENU"
        );

    let businessMenu = null;

    if (businessHeading) {
        const headingText = businessHeading.parentElement.textContent.trim();

        const price = headingText.split("|")[1]?.trim() ?? "";

        const headingParagraph = businessHeading.closest("p");
        const soupParagraph = headingParagraph?.nextElementSibling?.nextElementSibling;
        const mealParagraph = soupParagraph?.nextElementSibling;

        const soupSpans = soupParagraph?.querySelectorAll("span");
        const mealSpans = mealParagraph?.querySelectorAll("span");

        businessMenu = {
            price,
            soup: soupSpans?.[0]?.textContent.trim() ?? "",
            name: mealSpans?.[0]?.textContent.trim() ?? "",
            details: mealSpans?.[1]?.textContent.trim() ?? ""
        };
    }


    const dayNames = [
        "PONDELOK",
        "UTOROK",
        "STREDA",
        "ŠTVRTOK",
        "PIATOK"
    ];

    const headings = Array.from(menu.querySelectorAll("strong"));

    const days = headings
        .filter(heading =>
            dayNames.includes(heading.textContent.trim().toUpperCase())
        )
        
        .map(heading => {
            const day = heading.textContent.trim();

            const fullText = heading.parentElement.textContent.trim();

            const parts = fullText.split("|");

            const date = parts[0]
                .replace(day, "")
                .trim();

            const price = parts[1]?.trim() ?? "";


            const dayParagraph = heading.closest("p");
            const soupParagraph = dayParagraph?.nextElementSibling?.nextElementSibling;

            const soupSpans = soupParagraph?.querySelectorAll("span");

            const soupName = soupSpans?.[0]?.textContent.trim() ?? "";
            const soupDetails = soupSpans?.[1]?.textContent.trim() ?? "";

            const allergens = soupDetails.split("|")[1]?.trim() ?? "";

            const meals = [];

            if (soupName) {
                meals.push({
                    type: "Polievka",
                    name: soupName,
                    price: "",
                    subsidizedPrice: "",
                    allergens
                });
            }


            const mainMealsParagraph = soupParagraph?.nextElementSibling;

            const mainMealSpans = mainMealsParagraph
                ? Array.from(mainMealsParagraph.querySelectorAll("span"))
                : [];

            for (let i = 0; i + 1 < mainMealSpans.length; i += 2) {
                const name = mainMealSpans[i].textContent
                    .trim()
                    .replace(/^\d+\.\s*/, "");

                const details = mainMealSpans[i + 1].textContent.trim();

                const [weight, allergenText] = details
                    .split("|")
                    .map(part => part.trim());

                if (!name) continue;

                meals.push({
                    type: "Hlavné jedlo",
                    name,
                    price: "",
                    subsidizedPrice: "",
                    allergens: allergenText ?? "",
                    weight: weight ?? ""
                });
            }



            return {
                day,
                date,
                price,
                meals
            };
        });


    return {
        restaurant: "Riviera",
        businessMenu,
        days
    };
}
