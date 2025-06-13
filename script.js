function addRecommendation() {
  // Get the message of the new recommendation
  let recommendation = document.getElementById("new_recommendation");
  // If the user has left a recommendation, display a pop-up
  if (recommendation.value != null && recommendation.value.trim() != "") {
    console.log("New recommendation added");
    //Call showPopup here
    showPopup(true);

    // Create a new 'recommendation' element and set it's value to the user's message
    var element = document.createElement("div");
    element.setAttribute("class","recommendation");
    element.innerHTML = "\<span\>&#8220;\</span\>" + recommendation.value + "\<span\>&#8221;\</span\>";
    // Add this element to the end of the list of recommendations
    document.getElementById("all_recommendations").appendChild(element); 
    
    // Reset the value of the textarea
    recommendation.value = "";
  }
}

function showPopup(bool) {
  if (bool) {
    document.getElementById('popup').style.visibility = 'visible'
  } else {
    document.getElementById('popup').style.visibility = 'hidden'
  }
}

fetch('https://viewcounter-9336b-default-rtdb.europe-west1.firebasedatabase.app/views.json')
  .then(response => response.json())
  .then(data => {
    let count = data.count || 0;
    document.querySelector("#visits").textContent = count;

    // Increment the count
    fetch('https://viewcounter-9336b-default-rtdb.europe-west1.firebasedatabase.app/views.json', {
      method: 'PATCH',
      body: JSON.stringify({ count: count + 1 }),
      headers: { 'Content-Type': 'application/json' }
    });
  });


