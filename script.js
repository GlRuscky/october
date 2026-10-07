const enterButton = document.getElementById("enterButton");
const closeButton = document.getElementById("closeButton");
const passwordScreen = document.getElementById("passwordScreen");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
const landing = document.getElementById("landing");
const story = document.getElementById("story");
const starsContainer = document.getElementById("stars");
const leavesContainer = document.getElementById("leaves");

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

    const enteredPassword = passwordInput.value.trim();

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
    const sections = document.querySelectorAll(".story-content");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0,
            rootMargin: "0px 0px -12% 0px"
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
    const numberOfStars = window.innerWidth < 700 ? 70 : 130;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("span");
        star.classList.add("star");

        const size = Math.random() * 2 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${2 + Math.random() * 5}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        starsContainer.appendChild(star);
    }
}

/* =========================
   CREATE LEAVES
========================= */

function createLeaves() {
    const numberOfLeaves = window.innerWidth < 700 ? 8 : 14;

    for (let i = 0; i < numberOfLeaves; i++) {
        const leaf = document.createElement("span");
        leaf.classList.add("leaf");

        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDuration = `${8 + Math.random() * 10}s`;
        leaf.style.animationDelay = `${Math.random() * 12}s`;
        leaf.style.opacity = `${0.2 + Math.random() * 0.4}`;

        leavesContainer.appendChild(leaf);
    }
}

/* =========================
   SONG PLAYER
========================= */

/*
   Os áudios ficam em assets/music/audio/ e têm o MESMO nome
   da capa, só que em .mp3.

   Exemplo:
   covers/01-i-wait-for-you.png
   ->
   audio/01-i-wait-for-you.mp3

   Se o arquivo não existir, o botão de play simplesmente não aparece.
*/

const AUDIO_FOLDER = "assets/music/audio/";
const AUDIO_EXTENSION = ".mp3";
const MAX_SECONDS = 30;
const FADE_OUT_SECONDS = 2;

let currentTrack = null;
let progressFrame = null;

function setupSongPlayers() {
    document.querySelectorAll(".song-card").forEach((card) => {
        const cover = card.querySelector(".song-cover");
        const image = card.querySelector(".song-cover img");

        if (!cover || !image) return;

        const fileName = image
            .getAttribute("src")
            .split("/")
            .pop()
            .replace(/\.[^.]+$/, "");

        const audio = new Audio();

        audio.preload = "metadata";
        audio.src = AUDIO_FOLDER + fileName + AUDIO_EXTENSION;

        const title =
            card.querySelector("h3")?.textContent.trim() || "música";

        const button = document.createElement("button");

        button.className = "song-play";
        button.type = "button";
        button.setAttribute("aria-label", `Ouvir ${title}`);

        button.innerHTML = `
            <span class="song-play-icon">
                <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z"/>
                </svg>

                <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>
                </svg>
            </span>
        `;

        const bar = document.createElement("div");
        bar.className = "song-progress";

        cover.appendChild(button);
        cover.appendChild(bar);

        const track = {
            card,
            audio,
            bar
        };

        audio.addEventListener("error", () => {
            card.classList.add("no-audio");
        });

        audio.addEventListener("ended", () => {
            finishTrack(track);
        });

        button.addEventListener("click", () => {
            toggleTrack(track);
        });
    });
}

function toggleTrack(track) {
    if (currentTrack === track && !track.audio.paused) {
        pauseTrack(track);
        return;
    }

    if (currentTrack && currentTrack !== track) {
        finishTrack(currentTrack);
    }

    currentTrack = track;
    track.audio.volume = 0;

    track.audio
        .play()
        .then(() => {
            track.card.classList.add("playing");
            progressFrame = requestAnimationFrame(updateProgress);
        })
        .catch(() => {
            track.card.classList.add("no-audio");
        });
}

function pauseTrack(track) {
    track.audio.pause();
    track.card.classList.remove("playing");
    cancelAnimationFrame(progressFrame);
}

function finishTrack(track) {
    track.audio.pause();
    track.audio.currentTime = 0;
    track.audio.volume = 0;

    track.bar.style.transform = "scaleX(0)";
    track.card.classList.remove("playing");

    cancelAnimationFrame(progressFrame);

    if (currentTrack === track) {
        currentTrack = null;
    }
}

function updateProgress() {
    if (!currentTrack) return;

    const { audio, bar } = currentTrack;
    const time = audio.currentTime;

    const limit = Math.min(
        MAX_SECONDS,
        audio.duration || MAX_SECONDS
    );

    const fadeIn = Math.min(1, time / 0.8);

    const fadeOut = Math.min(
        1,
        Math.max(0, (limit - time) / FADE_OUT_SECONDS)
    );

    audio.volume = Math.max(
        0,
        Math.min(1, fadeIn * fadeOut)
    );

    bar.style.transform =
        `scaleX(${Math.min(1, time / limit)})`;

    if (time >= limit) {
        finishTrack(currentTrack);
        return;
    }

    progressFrame = requestAnimationFrame(updateProgress);
}

/* =========================
   SONG AUTO PAUSE
========================= */

function setupSongAutoPause() {
    const section = document.querySelector(".songs-section");

    if (section) {
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && currentTrack) {
                        finishTrack(currentTrack);
                    }
                });
            },
            {
                threshold: 0
            }
        ).observe(section);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && currentTrack) {
            pauseTrack(currentTrack);
        }
    });
}

/* =========================
   CONSTELLATION
========================= */

/*
   Cada estrela é uma lembrança.

   x e y são posições em % dentro do céu (0 a 100).

   Para adicionar uma estrela, é só colocar mais uma linha aqui
   e, se quiser ligá-la a outra, adicionar um par em LINKS.
*/

const MEMORIES = [
    {
        x: 12,
        y: 68,
        title: "Carinho",
        text: "O cafuné que eu amava fazer em você."
    },

    {
        x: 27,
        y: 36,
        title: "Os vídeos",
        text: "Os vídeos que a gente mandava um para o outro para ver quando estivéssemos juntos."
    },

    {
        x: 44,
        y: 58,
        title: "Histórias",
        text: "As histórias das suas personagens preferidas do lol que eu contava para você."
    },

    {
        x: 50,
        y: 20,
        title: "Ataque carinhoso",
        text: "Os ataques de beijos que eu dava em você."
    },

    {
        x: 68,
        y: 42,
        title: "Amor aconchegante",
        text: "Você batendo na cama, dizendo sem palavras: “vem, fica aqui”."
    },

    {
        x: 85,
        y: 22,
        title: "Batimentos",
        text: "As vezes em que eu deitava e o abraçava com meu rosto em seu peito para eu ouvir os batimentos do seu coração S2."
    },

    {
        x: 81,
        y: 74,
        title: "Músicas declaradas",
        text: "Quando a gente ouvia as músicas que você pedia para eu ouvir com você."
    }
];

// Pares de estrelas ligadas por uma linha.
// A posição começa em 0.
const LINKS = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [4, 5],
    [4, 6]
];

function createConstellation() {
    const sky = document.getElementById("constellationSky");
    const lines = document.getElementById("constellationLines");
    const caption = document.getElementById("constellationCaption");

    if (!sky || !lines || !caption) return;

    const memorySymbol =
        caption.querySelector(".constellation-memory-symbol");

    const memoryTitle =
        caption.querySelector(".constellation-memory-title");

    const memoryText =
        caption.querySelector(".constellation-memory-text");

    let activeStar = null;

    // As estrelas aparecem quando o céu entra na tela.
    new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    sky.parentElement.classList.add("in-view");
                    observer.disconnect();
                }
            });
        },
        {
            threshold: 0.35
        }
    ).observe(sky);

    // Linhas.
    LINKS.forEach(([from, to], index) => {
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", MEMORIES[from].x);
        line.setAttribute("y1", MEMORIES[from].y);
        line.setAttribute("x2", MEMORIES[to].x);
        line.setAttribute("y2", MEMORIES[to].y);

        line.setAttribute(
            "vector-effect",
            "non-scaling-stroke"
        );

        line.classList.add("constellation-line");

        line.style.transitionDelay =
            `${0.4 + index * 0.35}s`;

        lines.appendChild(line);
    });

    // Estrelas.
    MEMORIES.forEach((memory, index) => {
        const star = document.createElement("button");

        star.type = "button";
        star.className = "constellation-star";
        star.setAttribute("aria-label", memory.title);

        star.style.left = `${memory.x}%`;
        star.style.top = `${memory.y}%`;

        star.style.transitionDelay =
            `${index * 0.25}s`;

        star.addEventListener("click", () => {
            // Clicar na estrela aberta fecha.
            if (activeStar === star) {
                star.classList.remove("active");
                caption.classList.remove("has-memory");
                activeStar = null;
                return;
            }

            if (activeStar) {
                activeStar.classList.remove("active");
            }

            star.classList.add("active", "visited");
            activeStar = star;

            // Troca o texto com uma pequena pausa para o fade.
            caption.classList.remove("has-memory");

            setTimeout(() => {
                if (activeStar !== star) return;

                memorySymbol.textContent = "✦";
                memoryTitle.textContent = memory.title;
                memoryText.textContent = memory.text;

                caption.classList.add("has-memory");
            }, 350);
        });

        sky.appendChild(star);
    });
}

/* =========================
   POLAROIDS
========================= */

/*
   As fotos ficam em assets/photos/ :

   gata-1.jpg
   gata-2.jpg
   gata-3.jpg

   presente-1.jpg
   presente-2.jpg
   presente-3.jpg

   Polaroid sem foto fica escondida.
   Se nenhuma foto existir, a seção inteira some.
*/

function setupPolaroids() {
    const section = document.getElementById("keepsakes");

    if (!section) return;

    const polaroids = Array.from(
        section.querySelectorAll(".polaroid")
    );

    let pending = polaroids.length;

    function checkIfEmpty() {
        pending--;

        if (
            pending === 0 &&
            polaroids.every((p) =>
                p.classList.contains("no-photo")
            )
        ) {
            section.classList.add("empty");
        }
    }

    polaroids.forEach((polaroid, index) => {
        const image = polaroid.querySelector("img");

        if (!image) {
            polaroid.classList.add("no-photo");
            checkIfEmpty();
            return;
        }

        polaroid.style.transitionDelay =
            `${(index % 3) * 0.15}s`;

        const onError = () => {
            polaroid.classList.add("no-photo");
            checkIfEmpty();
        };

        image.addEventListener("error", onError);
        image.addEventListener("load", checkIfEmpty);

        // A imagem já pode ter terminado de carregar antes daqui.
        if (image.complete) {
            if (image.naturalWidth === 0) {
                onError();
            } else {
                checkIfEmpty();
            }
        }
    });

    // Cada polaroid aparece quando chega na tela.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    target.classList.add("in-view");
                    observer.unobserve(target);

                    // Depois de aparecer,
                    // tira o atraso para o hover responder rápido.
                    setTimeout(() => {
                        target.style.transitionDelay = "0s";
                    }, 1800);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    polaroids.forEach((polaroid) => {
        observer.observe(polaroid);
    });
}

/* =========================
   ENDING
========================= */

function setupEnding() {
    const ending = document.getElementById("ending");

    if (!ending) return;

    new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                document.body.classList.toggle(
                    "ending",
                    entry.isIntersecting
                );
            });
        },
        {
            threshold: 0.45
        }
    ).observe(ending);
}

/* =========================
   INITIALIZE
========================= */

createStars();
createLeaves();

setupPolaroids();
setupEnding();

setupSongPlayers();
setupSongAutoPause();
createConstellation();
