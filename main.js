if (localStorage.ChallengerArr) {
  localStorage.setItem("ChallengerArr", localStorage.ChallengerArr);
  let MainArr = JSON.parse(localStorage.getItem("ChallengerArr"));
  // Call The scores dives
  let AllScores = document.querySelector(".scores .users");

  // the Scores Object
  let scoresObj = MainArr;
  CreateChallengersDives(scoresObj, AllScores);
} else {
  localStorage.setItem("ChallengerArr", JSON.stringify({}));
}
let UName,
  UScore = 0;
document.querySelector(".control-buttons span").onclick = () => {
  let YourName = prompt("Please Enter Your Name .");
  if (YourName === "" || YourName == null) {
    document.querySelector(".name span").innerHTML = "Un Known";
    UName = "Un Known";
  } else {
    document.querySelector(".name span").innerHTML = YourName;
    UName = YourName;
  }
  HelpMe(5000);
  document.querySelector(".control-buttons").remove();
  countDown(300);
};

// Call Reload Button
function ReloadPage() {
  let ReloadButt = document.querySelector(".reload");
  ReloadButt.style.display = "block";
  ReloadButt.addEventListener("click", () => {
    location.reload();
  });
}

// Select blocks container
let blocksContainer = document.querySelector(".memory-blocks-container");
CreateImage();
CreateImage();
// Set The Duration time
let duration = 1000;
let countDownInterval;
let countDownElement = document.querySelector(".count-down");

let rightAnswers = 0;
// select the blocks in the container and but it in Array
let blocks = Array.from(blocksContainer.children);
// Create order range
// let orderRange = [...Array(blocks.length).keys()];
let orderRange = Array.from(Array(blocks.length).keys());
// call Help Button
let MyHelp = document.querySelector(".help-me");
MyHelp.addEventListener("click", () => HelpMe(3000, true));
// Shuffle the array
Shuffle(orderRange);
blocks.forEach((block, index) => {
  // Add order css property to game block
  block.style.order = orderRange[index];
  // Add Clock event
  block.addEventListener("click", (ele) => {
    flipBlock(ele.currentTarget);
    // Collect all flipped blocks
    let allFlippedBlocks = blocks.filter((flippedBlock) =>
      flippedBlock.classList.contains("flipped")
    );
    // If there Is Two Selected Blocks
    if (allFlippedBlocks.length === 2) {
      // Stop Clicking Function
      stopClicking();
      // Check matched blocks
      checkMatched(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
  });
});

// Check matched Block
function checkMatched(firstBlock, secondBlock) {
  let triesEle = document.querySelector(".tries span");
  if (firstBlock.dataset.content === secondBlock.dataset.content) {
    // Remove fLipped class from the first and second blocks
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
    // Add Class matched to the first and second blocks
    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");
    if (rightAnswers < Math.floor(blocks.length / 2)) {
      document.getElementById("success").play();
    }
    rightAnswers++;
    if (rightAnswers === Math.floor(blocks.length / 2)) {
      clearInterval(countDownInterval);
      ReloadPage();
      document.getElementById("win").play();
      let winMsg = document.createElement("div");
      winMsg.innerHTML = `
      <span class="wins">Victory</span>
      `;
      document.querySelector("body").appendChild(winMsg);
      window.localStorage.setItem("challengerName", UName);
      if (JSON.parse(localStorage.getItem("ChallengerArr"))[UName]) {
        let Old = parseInt(
          JSON.parse(localStorage.getItem("ChallengerArr"))[UName]
        );
        console.log(Old);
        console.log(UScore);
        if (isNaN(Old)) {
          let TObj = JSON.parse(localStorage.getItem("ChallengerArr"));
          TObj[UName] = UScore;
          console.log(TObj);

          window.localStorage.setItem("challengerScore", UScore);
        } else {
          window.localStorage.setItem("challengerScore", UScore);
          let New = parseInt(localStorage.challengerScore);
          window.localStorage.setItem(
            "challengerScore",
            New /* < Old ? New : Old*/
          );
          console.log("found");
        }
      } else {
        console.log("un found");
        window.localStorage.setItem("challengerScore", UScore);
      }
    }
    AddToLocal();
  } else {
    triesEle.innerHTML = parseInt(triesEle.innerHTML) + 1;
    UScore = triesEle.innerHTML;
    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}
// stop Clicking function
function stopClicking() {
  // Add Class No Clicking in main  Container
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    // Remove Class No Clicking After the Duration
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}
// Flip Block function
function flipBlock(selectedBlock) {
  // Add Class Flipped
  selectedBlock.classList.add("flipped");
}
// Shuffle Function
function Shuffle(arr) {
  // Setting Vars
  let current = arr.length,
    temp,
    random;
  while (current > 0) {
    // Get random Number
    random = Math.floor(Math.random() * current);
    // Decrease length By One
    current--;
    // save Current Element In The Stash
    temp = arr[current];
    // Current Element = Random Element
    arr[current] = arr[random];
    // Random Element = Get Element from The stash
    arr[random] = temp;
  }
  return arr;
}

function HelpMe(Times, stop = false) {
  Array.from(document.querySelectorAll(".game-block")).forEach((block) =>
    block.classList.add("helped")
  );
  setTimeout(() => {
    Array.from(document.querySelectorAll(".game-block")).forEach((block) =>
      block.classList.remove("helped")
    );
    if (stop === true) {
      MyHelp.classList.add("stopped");
    }
  }, Times);
}

// function AddToLocal() {
//   let userArr = [localStorage.challengerName, localStorage.challengerScore];
//   localStorage.setItem("ChallengerArr", [].toString());
//   let localArr = Array.from(localStorage.getItem("ChallengerArr").split(","));
//   localArr.push(userArr);
//   localStorage.setItem("ChallengerArr", localArr.toString());
//   let MainArr = Array.from(localStorage.getItem("ChallengerArr").split(","));
//   console.log(MainArr);
// }
// AddToLocal();
function AddToLocal() {
  let localArr = JSON.parse(localStorage.getItem("ChallengerArr"));
  localArr[localStorage.challengerName] = localStorage.challengerScore;
  localStorage.setItem("ChallengerArr", JSON.stringify(localArr));
}

function CreateChallengersDives(scoresObj, AllScores) {
  const sortedObject = Object.entries(scoresObj).sort((x, y) => x[1] - y[1]);
  const sortObjectByValues = Object.fromEntries(sortedObject);
  Object.keys(sortObjectByValues).forEach((name, index) => {
    // create the challengers Main Div
    let MainBoss = document.createElement("div");
    MainBoss.classList.add("challenger");
    // Create the rank div
    let MyRank = document.createElement("div");
    MyRank.classList.add("rank");
    if (index === 0) {
      MyRank.classList.add("one");
    } else if (index === 1) {
      MyRank.classList.add("two");
    } else if (index === 2) {
      MyRank.classList.add("three");
    }
    // create the text node
    let rankText = document.createTextNode(`${index + 1}`);
    MyRank.appendChild(rankText);
    // create the name Node
    let MyName = document.createElement("div");
    MyName.classList.add("name");
    MyName.innerHTML = name;
    // Create the Score Node
    let MyScore = document.createElement("div");
    MyScore.classList.add("score");
    MyScore.innerHTML = sortObjectByValues[name];
    // append Dives to the Main Boss
    MainBoss.append(MyRank);
    MainBoss.append(MyName);
    MainBoss.append(MyScore);
    // Append Main Boss the scores Div
    AllScores.appendChild(MainBoss);
  });
}
function countDown(durationTime) {
  let minutes, seconds;
  countDownInterval = setInterval(function () {
    minutes = parseInt(durationTime / 60);
    seconds = parseInt(durationTime % 60);
    countDownElement.innerHTML = `
      <span class="minutes">${
        minutes < 10 ? `0${minutes}` : minutes
      }</span> : <span class="seconds">${
      seconds < 10 ? `0${seconds}` : seconds
    }</span>
      `;
    if (--durationTime < 0) {
      clearInterval(countDownInterval);
      Array.from(document.querySelectorAll(".game-block")).forEach((block) =>
        block.classList.add("ended")
      );
      blocksContainer.classList.add("no-clicking");
      MyHelp.classList.add("stopped");
      let loseMsg = document.createElement("div");
      loseMsg.innerHTML = `
      <span class="lose">Game Over</span>
      `;
      document.getElementById("fail").play();
      document.querySelector("body").appendChild(loseMsg);
      ReloadPage();
    }
  }, 1000);
}

// Create Image Function
function CreateImage() {
  let Images = [
    "./iamges/image1.jpg",
    "./iamges/image2.png",
    "./iamges/image3.webp",
    "./iamges/image4.jpg",
    "./iamges/image5.jpg",
    "./iamges/image6.jpg",
    "./iamges/image7.png",
    "./iamges/image8.jpg",
    "./iamges/image9.jpg",
    "./iamges/image10.jpg",
    "./iamges/image11.jpg",
    "./iamges/image12.jpg",
    "./iamges/image13.jpg",
    "./iamges/image14.jpg",
    "./iamges/image15.jpg",
    "./iamges/image16.jpg",
    "./iamges/image17.jpg",
    "./iamges/image18.jpg",
    "./iamges/image19.jpg",
    "./iamges/image20.jpg",
    // "./iamges/image21.jpg",
    // "./iamges/image22.jpg",
    // "./iamges/image23.jpg",
  ];
  Images.forEach((img, index) => {
    let mainBl = document.createElement("div");
    mainBl.classList.add("game-block");
    mainBl.setAttribute("data-content", `image${index + 1}`);
    let theFront = document.createElement("div");
    theFront.classList.add("face");
    theFront.classList.add("front");
    let theBack = document.createElement("div");
    let theImg = document.createElement("img");
    theImg.setAttribute("src", img);
    theBack.classList.add("face");
    theBack.classList.add("back");
    theBack.appendChild(theImg);
    mainBl.appendChild(theFront);
    mainBl.appendChild(theBack);
    blocksContainer.appendChild(mainBl);
  });
}
