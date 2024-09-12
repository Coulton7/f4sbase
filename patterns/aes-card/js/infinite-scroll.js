document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelectorAll('.news-slider').length > 0){
        const cards = document.querySelectorAll(".infi-card");

        for (let n = 0; n < cards.length; n++){
            cards[n].classList.add("hide");
        }

        for(let c = 0; c <= 5; c++ ) {
            if(!cards[c].classList.contains("card-visible")) {
                cards[c].classList.add("card-visible");
                cards[c].classList.remove("hide");
            }
        }

        let grid = document.querySelector(".views-view-responsive-grid--horizontal");
        let visCards = grid.querySelectorAll(".card-visible");
        let hidCards = grid.querySelectorAll('.hide');
        let lastCard = visCards[visCards.length-1]

        document.addEventListener("scroll", function(e){
                revealDiv();
        });

        var revealDiv = function() {
            var lastDiv = lastCard;
            var lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
            var pageOffset = window.scrollY + window.innerHeight;

            if(pageOffset > lastDivOffset + 407) {
                for(let i = 0; i <= 5; i++) {
                    hidCards[i].classList.add("card-visible");
                    hidCards[i].classList.remove("hide");
                }
                visCards = grid.querySelectorAll('.card-visible');
                hidCards = grid.querySelectorAll('.hide');
                lastCard = visCards[visCards.length-1]
            }
        }
    };

});