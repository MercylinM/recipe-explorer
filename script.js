function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(res => res.json())
        .then(data => {
            const catContainer = document.getElementById('categories-container');
            catContainer.innerHTML = '';
            data.categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.textContent = cat.strCategory;
                btn.onclick = () => fetchByCategory(cat.strCategory);
                catContainer.appendChild(btn);
            });
        });
}

function fetchByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(res => res.json())
        .then(data => {
            Promise.all(data.meals.map(meal =>
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                    .then(res => res.json())
                    .then(res => res.meals[0])
            )).then(fullMeals => displayMealsPaginated(fullMeals, true));
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMeals('chicken');
    fetchCategories();
});

