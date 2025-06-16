
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


searchBtn.addEventListener('click', () => {
    const query = input.value.trim();
    const type = document.getElementById('search-type').value;
    if (query) {
        if (type === 'name') fetchMeals(query);
        else fetchByIngredient(query);
    }
 });
 
 function showMealDetails(meal) {
    const modal = document.createElement('div');
    modal.className = 'modal';


    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
            ingredients += `<li>${ing} - ${measure}</li>`;
        }
    }


    modal.innerHTML = `
      <div class="modal-content split-layout">
        <span class="close-btn">&times;</span>
        <div class="image-side">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <h2>${meal.strMeal}</h2>
        </div>
        <div class="content-side">
          <div class="tab-buttons">
            <button id="tab-ingredients" class="active-tab">Ingredients</button>
            <button id="tab-instructions">Instructions</button>
          </div>
          <div id="tab-content">
          <ul class="ingredients-list">${ingredients}</ul>
        </div>
        <button class='save-btn' onclick="saveToCookLater(${meal.idMeal})">📌 Save to Cook Later</button>
      </div>
    </div>
  `;


    document.body.appendChild(modal);


    modal.querySelector('.close-btn').onclick = () => modal.remove();


    const tabIngredients = document.getElementById('tab-ingredients');
    const tabInstructions = document.getElementById('tab-instructions');
    const tabContent = document.getElementById('tab-content');


    tabIngredients.onclick = () => {
        tabContent.innerHTML = `<ul class="ingredients-list">${ingredients}</ul>`;
        tabIngredients.classList.add('active-tab');
        tabInstructions.classList.remove('active-tab');
    };


    tabInstructions.onclick = () => {
        tabContent.innerHTML = `<p class="instructions-text">${meal.strInstructions}</p>`;
        tabInstructions.classList.add('active-tab');
        tabIngredients.classList.remove('active-tab');
    };
}

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

function fetchRandomMeal() {
   fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
       .then(res => res.json())
       .then(data => {
           displayMealsPaginated(data.meals, true); ;
       });
}


document.addEventListener('DOMContentLoaded', () => {
   fetchMeals('chicken')
})


randomBtn.addEventListener('click', () => {
   fetchRandomMeal();
});


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

