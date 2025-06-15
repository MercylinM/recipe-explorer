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
