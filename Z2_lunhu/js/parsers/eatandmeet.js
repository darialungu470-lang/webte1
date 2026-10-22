
function parseMeal(menu) {
    const type = menu.querySelector("h4")?.textContent.trim() ?? "";

    const priceElement = menu.querySelector(".price");
    const subsidizedElement = priceElement?.querySelector("span");

    const price = priceElement?.firstChild?.textContent
        .split("/")[0].trim() ?? "";

    const subsidizedPrice =
        subsidizedElement?.textContent.trim() ?? "";

    const description = menu.querySelector(".desc");

    const name = Array.from(description?.childNodes ?? [])
        .filter(node => node.nodeType === 3)
        .map(node => node.textContent.trim())
        .join(" ");

    const allergens = description?.querySelector("span")
        ?.textContent.replace(/[()]/g, "").trim() ?? "";

    return {
        type,
        name,
        price,
        subsidizedPrice,
        allergens
    };
}

export function parseEatAndMeet(doc) {
    const dayLinks = doc.querySelectorAll(
        ".tabs-link a[href^='#day-']"
    );

    const days = Array.from(dayLinks).map(link => {
        const dayName = link.textContent.trim();
        const dayId = link.getAttribute("href").slice(1);

        const dayElement = doc.getElementById(dayId);

        const meals = dayElement
            ? Array.from(
                dayElement.querySelectorAll(".menu-details")
              ).map(parseMeal)
            : [];

        return {
            day: dayName,
            dayId,
            meals
        };
    });

    return {
        restaurant: "Eat & Meet",
        days
    };
}
