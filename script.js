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
  