function saveToCookLater(idMeal) {
    let savedMeals = JSON.parse(localStorage.getItem('cookLater')) || [];
    if (!savedMeals.includes(idMeal)) {
        savedMeals.push(idMeal);
        localStorage.setItem('cookLater', JSON.stringify(savedMeals));
        alert('Meal saved!');
    } else {
        alert('Already in your list.');
    }
}


function fetchMeals(query) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            displayMealsPaginated(data.meals, true);;
        });
}
  
function displayMeals(meals) {
   container.innerHTML = '';
   if (!meals || meals.length === 0) {
       container.innerHTML = '<p>No meals found.</p>';
       return;
   }


   meals.forEach(meal => {
       const card = document.createElement('div');
       card.className = 'recipe-card';
       card.innerHTML = `
     <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
     <h3>${meal.strMeal}</h3>
     <p><button>View Recipe</button></p>
   `;
       card.querySelector('button').addEventListener('click', () => showMealDetails(meal));
       container.appendChild(card);
   });
}


function fetchByIngredient(ingredient) {
   fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
       .then(res => res.json())
       .then(data => {
           if (!data.meals) {
               container.innerHTML = '<p>No meals found.</p>';
               return;
           }


           Promise.all(data.meals.map(meal =>
               fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                   .then(res => res.json())
                   .then(res => res.meals[0])
           )).then(fullMeals => displayMealsPaginated(fullMeals, true));
       });
}

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

