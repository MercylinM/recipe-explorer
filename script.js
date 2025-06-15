const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const input = document.getElementById('search-input');
const container = document.getElementById('recipes-container');








let currentMeals = [];
let currentIndex = 0;


function displayMealsPaginated(meals, reset = false) {
   if (reset) {
       currentMeals = meals;
       currentIndex = 0;
       container.innerHTML = '';
   }


   const nextMeals = currentMeals.slice(currentIndex, currentIndex + 10);
   nextMeals.forEach(meal => {
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


   currentIndex += 10;


   document.getElementById('load-more-btn').style.display = currentIndex < currentMeals.length ? 'inline-block' : 'none';
}


document.getElementById('load-more-btn').addEventListener('click', () => {
   displayMealsPaginated(currentMeals);
});


function fetchSavedMeals(usePaginated = false) {
   const saved = JSON.parse(localStorage.getItem('cookLater')) || [];
   if (!saved.length) {
       container.innerHTML = '<p>Your “Cook Later” list is empty.</p>';
       document.getElementById('load-more-btn').style.display = 'none';
       return;
   }


   Promise.all(
       saved.map(id =>
           fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
               .then(res => res.json())
               .then(data => data.meals[0])
       )
   ).then(data => {
       if (usePaginated) displayMealsPaginated(data, true);
       else displayMealsPaginated(fullMeals, true);;
   });
}


document.getElementById('cook-later-btn').addEventListener('click', () => {
   fetchSavedMeals(true);
});


document.getElementById('home-btn').addEventListener('click', () => {
   fetchMeals('chicken');
});






searchBtn.addEventListener('click', () => {
   const query = input.value.trim();
   const type = document.getElementById('search-type').value;
   if (query) {
       if (type === 'name') fetchMeals(query);
       else fetchByIngredient(query);
   }
});
