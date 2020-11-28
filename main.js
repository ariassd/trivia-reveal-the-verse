$(function () {
  let levelNumber = 0;
  let currentLevel = null;
  let text = "";
  let questions = [];
  let spans = [];
  let wordsByQuestion = 0;
  let current = { status: true };
  let points = 0;

  setInterval(() => {
    $(".points-text").text(`Points: ${points}`);
    $(".level-text").text(`Level: ${levelNumber + 1}`);
    //$(".level-text").attr(`data-level`, levelNumber);
  }, 200);

  function mapLevel(num) {
    levelNumber = num;
    if (levels.length <= levelNumber) {
      return;
    }
    currentLevel = levels[levelNumber];
    text = currentLevel.bibleVerse;
    questions = currentLevel.questions;
    spans = text.split(" ").map((i) => `<span>${i} </span>`);
    wordsByQuestion = Math.ceil(spans.length / questions.length);
    current = { status: true };
    $(".level-text").attr(`data-level`, levelNumber);
    $(".bible-text").text("");
    $(".bible-text").append(spans);
  }

  mapLevel(levelNumber);
  mapQuestion();
  $(".show-next").click(function () {
    if ($(".level-text").attr(`data-level`) != levelNumber) {
      mapLevel(levelNumber);
    }
    mapQuestion();
  });

  function showNext() {
    $(".bible-text span:hidden").slice(0, wordsByQuestion).delay(100).fadeIn();
  }

  function nextLevel() {
    setTimeout(() => {
      console.log($(".bible-text span:hidden").length);
      if ($(".bible-text span:hidden").length === 0) {
        console.log("YOU FINISHED THE LEVEL");
        playSound('level');
        $(".bible-text").append(`<div>${currentLevel.verse}</div>`);
        // $(".bible-text").css("background-color", "green");
        levelNumber++;
        if (levelNumber >= levels.length) {
          console.log("YOU WIN");
          playSound('win')
          // $(".bible-text").css("background-color", "green");
          $(".card-bible-text").addClass("bg-success text-white");
        }
      }
    }, 200);
  }

  function mapQuestion() {
    $(".answer").unbind("click");
    if (!current?.status) return;
    current = questions.find((i) => !i.read);
    $(".answer").removeClass("right-answer");
    $(".answer").removeClass("wrong-answer");
    // bind wrong answer to all answers
    $(".answer")
      .unbind("click")
      .bind("click", function () {
        if (points > 0) points--;
        console.log("wrong");
        playSound('wrong');
        $(this).addClass("wrong-answer");
      });
    if (current) {
      current.read = true;
      Object.keys(current).map((k, i) => {
        $(`.${k}`).text(current[k]);
      });

      // override answer to right answer
      $(`.${current.right}`)
        .unbind("click")
        .bind("click", function () {
          current.status = true;
          points++;
          $(this).addClass("right-answer");
          playSound('right');
          showNext();
          // gameOver();
          nextLevel();
          $(".answer").unbind("click");
        });
    }
  }

  function playSound(sound) {
    var audio = new Audio(`./assets/sounds/${sound}.mp3`);
    if (audio) audio.play();
  }

});
