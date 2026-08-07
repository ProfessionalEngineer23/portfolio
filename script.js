// Start Firebase using the compat SDK.
// firebaseConfig comes from config.js.
firebase.initializeApp(firebaseConfig);

// Connect to Firebase Realtime Database.
const database = firebase.database();
const recommendationsRef = database.ref("recommendations");

// Save a recommendation to Firebase.
function addRecommendation() {
  const nameInput = document.getElementById("recommendation_name");
  const recommendationInput = document.getElementById("new_recommendation");

  const name = nameInput.value.trim() || "Anonymous";
  const message = recommendationInput.value.trim();

  if (message === "") {
    alert("Please enter a recommendation before submitting.");
    return;
  }

  if (message.length > 500) {
    alert("Recommendation must be 500 characters or less.");
    return;
  }

  recommendationsRef.push({
    name: name,
    message: message,
    createdAt: Date.now()
  })
  .then(() => {
    console.log("Recommendation saved successfully");

    showPopup(true);

    nameInput.value = "";
    recommendationInput.value = "";
    updateCharacterCounter();
  })
  .catch((error) => {
    console.error("Error saving recommendation:", error);
    alert("Sorry, your recommendation could not be saved. Check the console for details.");
  });
}

// Display one recommendation card on the page.
function displayRecommendation(name, message) {
  const element = document.createElement("div");
  element.className = "recommendation";

  const quote = document.createElement("p");
  quote.textContent = `“${message}”`;

  const author = document.createElement("strong");
  author.textContent = `- ${name}`;

  element.appendChild(quote);
  element.appendChild(author);

  document.getElementById("all_recommendations").appendChild(element);
}

// Load all recommendations from Firebase.
recommendationsRef.on("value", (snapshot) => {
  const recommendationsContainer = document.getElementById("all_recommendations");

  if (!recommendationsContainer) {
    return;
  }

  recommendationsContainer.innerHTML = "";

  if (!snapshot.exists()) {
    const emptyMessage = document.createElement("p");
    emptyMessage.id = "no_recommendations_message";
    emptyMessage.textContent = "No recommendations yet. Be the first to leave one!";
    recommendationsContainer.appendChild(emptyMessage);
    return;
  }

  const recommendations = [];

  snapshot.forEach((childSnapshot) => {
    recommendations.push(childSnapshot.val());
  });

  recommendations.sort((a, b) => b.createdAt - a.createdAt);

  recommendations.forEach((recommendation) => {
    displayRecommendation(recommendation.name, recommendation.message);
  });
});

// Show or hide the confirmation popup.
function showPopup(bool) {
  const popup = document.getElementById("popup");

  if (!popup) {
    return;
  }

  if (bool) {
    popup.style.visibility = "visible";
  } else {
    popup.style.visibility = "hidden";
  }
}

// Update the recommendation character counter.
function updateCharacterCounter() {
  const recommendationInput = document.getElementById("new_recommendation");
  const counter = document.getElementById("recommendation_counter");

  if (recommendationInput && counter) {
    counter.textContent = `${recommendationInput.value.length} / 500 characters`;
  }
}

// Connect textarea to character counter after the page loads.
document.addEventListener("DOMContentLoaded", () => {
  const recommendationInput = document.getElementById("new_recommendation");

  if (recommendationInput) {
    recommendationInput.addEventListener("input", updateCharacterCounter);
    updateCharacterCounter();
  }
});
const countedKey = "portfolio_counted_this_session"; // Session flag to mark a visit as counted

fetch(viewCounterUrl)
  .then(response => response.json())
  .then(data => {
    const viewsData = data || {};
    const count = viewsData.count || 0;

    const visitsElement = document.querySelector("#visits");

    // Only count when the sessionStorage flag is not set
    if (!sessionStorage.getItem(countedKey)) {
      sessionStorage.setItem(countedKey, "true");

      const newCount = count + 1;

      if (visitsElement) {
        visitsElement.textContent = newCount;
      }

      return fetch(viewCounterUrl, {
        method: "PATCH",
        body: JSON.stringify({ count: newCount }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    if (visitsElement) {
      visitsElement.textContent = count;
    }
  })
  .catch((error) => {
    console.error("Error updating visit counter:", error);

    const visitsElement = document.querySelector("#visits");

    if (visitsElement) {
      visitsElement.textContent = "many";
    }
  });