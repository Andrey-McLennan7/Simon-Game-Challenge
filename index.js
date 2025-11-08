const soundMap = {
    green: "green",
    red: "red",
    yellow: "yellow",
    blue: "blue",
    wrong: "wrong"
};

// Pre-load all audio files
const sounds = {};
for (const [key, file] of Object.entries(soundMap)) {
    sounds[key] = new Audio("./sounds/" + file + ".mp3");
}

// Play pre-loaded sound effect
function playSound(key) {
    const audio = sounds[key];

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// Animate button when pressed
function animatePress(currentColour) {
    currentColour.addClass("pressed");
    setTimeout(() => currentColour.removeClass("pressed"), FLASH_SPEED);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//-------------------------------------------------------------------------------------------------

const buttonColours = ["green", "red", "yellow", "blue"];

var level = 0;

var started = false;
var clickable = false;

var gamePattern = [];
var userClickedPattern = [];

const FLASH_SPEED = 100;

const $btn = $(".btn");
const $h1 = $("h1");

$(document).on("keypress", () => {
    if (!started) {

        $h1.text("Level " + level);
        clickable = true;
        nextSequence();
        started = true;
    }
});

$btn.on("click", function() { 
    if (!clickable) {

        return;
    }

    const $this = $(this);

    let userChosenColour = $this.attr("id");

    playSound(userChosenColour);
    animatePress($this);

    userClickedPattern.push(userChosenColour);

    checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(() => nextSequence(), FLASH_SPEED * 10)
        }
    }
    else {
        playSound("wrong");

        const $body = $("body");

        $body.addClass("game-over");
        setTimeout(() => $body.removeClass("game-over"), FLASH_SPEED * 2);

        $h1.text("Game Over, Press Any Key to Restart");

        startOver();
    }
}

async function nextSequence() {
    // Clear user entered pattern
    userClickedPattern = [];

    // Increase level
    $h1.text("Level " + ++level);

    // Randomly select a colour
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColours[randomNumber];

    // Generate pattern
    gamePattern.push(randomChosenColour);

    clickable = false;

    for (const colour of gamePattern) {

        const button = $("." + colour);

        // Output button's Visual and Sound effects
        button.fadeIn(FLASH_SPEED).fadeOut(FLASH_SPEED).fadeIn(FLASH_SPEED);
        playSound(colour);

        await delay(500);
    }

    clickable = true;
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    clickable = false;
}