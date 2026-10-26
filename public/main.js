const trash = document.getElementsByClassName("fa-trash-o");
const heart = document.getElementsByClassName("fa-heart");
const heartOutline = document.getElementsByClassName("fa-heart-o");




document.getElementById("search").addEventListener("input", (element) => {
  const searchInput = element.target.value.toLowerCase();
  document.querySelectorAll(".recipe").forEach((recipe) => {
    recipe.style.display = recipe.textContent.toLowerCase().includes(searchInput) ? "" : "none";
});

});



Array.from(heart).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = this.closest('li');
        const id = li.dataset.id;
        fetch('/recipes/' + id, {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'favorite': false
          })
        })
        .then(response => {
          if (response.ok) 
            return response.json()

        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(heartOutline).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = this.closest('li');
        const id = li.dataset.id;
        fetch('/recipes/' + id, {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'favorite': true
          })
        })
        .then(response => {
          if (response.ok) 
            return response.json()

        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});



Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = this.closest('li');
        const id = li.dataset.id;
        fetch('/recipes/' + id, {
          method: 'delete'})
          .then(function (response) {
          window.location.reload()
        })
      });
});
