const enterButton =
    document.getElementById("enterButton");

const closeButton =
    document.getElementById("closeButton");

const passwordScreen =
    document.getElementById("passwordScreen");

const passwordForm =
    document.getElementById("passwordForm");

const passwordInput =
    document.getElementById("passwordInput");

const errorMessage =
    document.getElementById("errorMessage");

const landing =
    document.getElementById("landing");

const story =
    document.getElementById("story");

const starsContainer =
    document.getElementById("stars");

const leavesContainer =
    document.getElementById("leaves");


/* =========================
   TEMPORARY PASSWORD
========================= */

const PASSWORD = "october";


/* =========================
   OPEN PASSWORD
========================= */

enterButton.addEventListener("click", () => {

    passwordScreen.classList.add("active");

    setTimeout(() => {
        passwordInput.focus();
    }, 700);

});


/* =========================
   CLOSE PASSWORD
========================= */

closeButton.addEventListener("click", () => {

    passwordScreen.classList.remove("active");

    passwordInput.value = "";

    errorMessage.classList.remove("show");

});


/* =========================
   CHECK PASSWORD
========================= */

passwordForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const enteredPassword =
        passwordInput.value.trim();

    if (enteredPassword === PASSWORD) {

        unlockSite();

    } else {

        showError();

    }

});


/* =========================
   UNLOCK SITE
========================= */

function unlockSite() {

    errorMessage.classList.remove("show");
    passwordInput.value = "";

    passwordScreen.classList.remove("active");

    setTimeout(() => {

        landing.style.opacity = "0";
        landing.style.transform = "scale(0.97)";

    }, 300);

    setTimeout(() => {

        landing.style.display = "none";

        story.classList.add("visible");

        window.scrollTo(0, 0);

        initializeStory();

    }, 1500);

}


/* =========================
   WRONG PASSWORD
========================= */

function showError() {

    errorMessage.classList.remove("show");

    void errorMessage.offsetWidth;

    errorMessage.classList.add("show");

    passwordInput.value = "";

    passwordInput.focus();

}


/* =========================
   STORY ANIMATIONS
========================= */

function initializeStory() {

    const sections =
        document.querySelectorAll(".story-content");

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    sections.forEach((section) => {

        observer.observe(section);

    });

}


/* =========================
   CREATE STARS
========================= */

function createStars() {

    const numberOfStars =
        window.innerWidth < 700
            ? 70
            : 130;


    for (let i = 0; i < numberOfStars; i++) {

        const star =
            document.createElement("span");

        star.classList.add("star");

        const size =
            Math.random() * 2 + 1;

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.animationDuration =
            `${2 + Math.random() * 5}s`;

        star.style.animationDelay =
            `${Math.random() * 5}s`;

        starsContainer.appendChild(star);

    }

}


/* =========================
   CREATE LEAVES
========================= */

function createLeaves() {

    const numberOfLeaves =
        window.innerWidth < 700
            ? 8
            : 14;


    for (let i = 0; i < numberOfLeaves; i++) {

        const leaf =
            document.createElement("span");

        leaf.classList.add("leaf");

        leaf.style.left =
            `${Math.random() * 100}%`;

        leaf.style.animationDuration =
            `${8 + Math.random() * 10}s`;

        leaf.style.animationDelay =
            `${Math.random() * 12}s`;

        leaf.style.opacity =
            `${0.2 + Math.random() * 0.4}`;

        leavesContainer.appendChild(leaf);

    }

}


/* =========================
   INITIALIZE
========================= */

createStars();

createLeaves();