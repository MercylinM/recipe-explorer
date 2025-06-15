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
     