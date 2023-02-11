const card = document.getElementById("meals");
const recipe = document.getElementById("recepi")
const btn = document.getElementById("mealsbtn")
const calories = document.querySelectorAll(".calories")
const ingre=document.getElementById("ingredients-tab");
const step=document.getElementById("step-tab");
const equ=document.getElementById("equipment-tab");
  ingre.style.color='#ee634e';
  step.style.color='#ee634e';
  equ.style.color='#ee634e';
var calorie;
var breakfastId, lunchId, dinnerId;
btn.addEventListener("click", calorieCal)

function calorieCal(e) {
    e.preventDefault(); 
    var bmr;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const age = document.getElementById("age").value;
    const activity = document.getElementById("activity").value;
    const gender = document.getElementById("gender").value;

  
    if(height!="" || weight!="" || age!="")
    {
      if (gender === "male") {
        bmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age)
      }
      else if (gender === "female"){
        bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
      }
      else
      return;
      if (activity === "light") {
        calorie = bmr * 1.375;
      }
      else if (activity === "moderate") {
        calorie = bmr * 1.55;
      }
      else if(activity === "active"){
        calorie = bmr * 1.725;
      }
      else
      return;
      console.log(bmr, calorie);
      getMealData();
       /*  setTimeout(() => {
        card.style.display = "block";
       }, 3000);
       */
  }
}


function getMealData(){
    fetch(
        `https://api.spoonacular.com/mealplanner/generate?apiKey=f227548f229649ffa3dcdb67c48c344e&timeFrame=day&targetCalories=${calorie}`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // e.stopPropagation();
            setMealData(data);
            card.style.display = "block";
        })
        .catch((error) => {
            console.log(error);
        });
}


function setMealData(data) {
    setBreakFastData(data.meals[0]);
    setLunchData(data.meals[1]);
    setDinnerData(data.meals[2]);
}


function setBreakFastData(data) {
    breakfastId = data.id;
    const img = document.getElementById("breakfast-image");
    img.src = "https://spoonacular.com/recipeImages/" + breakfastId + "-556x370." + data.imageType;
    document.getElementById("breakfast-name").innerHTML = data.title;
    calories[0].innerHTML = calorie.toFixed(2)
}

function setLunchData(data) {
    lunchId = data.id;
    const img = document.getElementById("lunch-image");
    img.src = "https://spoonacular.com/recipeImages/" + lunchId + "-556x370." + data.imageType;
    document.getElementById("lunch-name").innerHTML = data.title;
    calories[1].innerHTML = calorie.toFixed(2)
}

function setDinnerData(data) {
    dinnerId = data.id
    const img = document.getElementById("dinner-image");
    img.src = "https://spoonacular.com/recipeImages/" + dinnerId + "-556x370." + data.imageType;
    document.getElementById("dinner-name").innerHTML = data.title;
    calories[2].innerHTML = calorie.toFixed(2);
}

function breakFastRecipe(){
    dataFetch(breakfastId)
    recipe.style.display="block";
}

function lunchRecipe(){
    dataFetch(lunchId)
    recipe.style.display="block";
}

function dinnerRecipe(){
    dataFetch(dinnerId)
    recipe.style.display="block";
}

function dataFetch(id) {
    var equipment = [];
    fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=f227548f229649ffa3dcdb67c48c344e&includeNutrition=false`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            document.getElementById("steps").innerHTML = ""
            for (item of data.analyzedInstructions) {
                for (i of item.steps) {
                    stepShow(i.step);
                }
            }

            document.getElementById("list-of-ingredients").innerHTML = "";
            for (item of data.extendedIngredients) {
                var quantity = item.amount + " " + item.unit
                if (item.nameClean != null){
                    var name=item.nameClean.charAt(0).toUpperCase() + item.nameClean.slice(1);
                    ingredientsShow(name, quantity)
                }

                   
            }


            for (item of data.analyzedInstructions) {
                for (i of item.steps) {
                    for (j of i.equipment) {
                        if (!equipment.includes(j.name))
                            equipment.push(j.name);
                    }
                }
            }
            equipmentShow(equipment);

        })
        .catch((e) => {
            console.log(e);
        });
}

function ingredientsShow(name, quantity) {
    const ul = document.getElementById("list-of-ingredients");
    const li = document.createElement("li")
    li.innerText = name + " - " + quantity;
    ul.appendChild(li);
}


function stepShow(step) {
    const ol = document.getElementById("steps")
    const li = document.createElement("li");
    li.innerText = step;
    ol.appendChild(li);
}

function equipmentShow(equipment) {
    const ul = document.getElementById("equip")
    ul.innerHTML = ""
    for (i of equipment) {
        var temp=i.charAt(0).toUpperCase() + i.slice(1);;
        const li = document.createElement("li");
        li.innerText = temp;
        ul.appendChild(li);
    }
}
