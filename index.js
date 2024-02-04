"use-strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://endorsement-5a073-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

import { set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementInDB = ref(database, "Endorsements");

const button = document.getElementById("btn");

const msg = document.getElementById("msg");

const ulEl = document.getElementById("list");

const from = document.getElementById("from");

const to = document.getElementById("to");

function clearInput() {
  msg.value = "";
  from.value = "";
  to.value = "";
}

window.onscroll = function () {
  myFunction();
};

let header = document.getElementById("header");
let sticky = header.offsetTop;

function myFunction() {
  if (window.scrollY > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

button.addEventListener("click", function () {
  let msgValue = msg.value;
  let fromValue = `From ${from.value}`;
  let toValue = `To ${to.value}`;
  let span2Value = `🖤`;
  let randomID = `id-${Math.random()
    .toString(36)
    .substr(2, 16)}${Date.now().toString(36)}`;

  if (msgValue !== "") {
    push(endorsementInDB, {
      message: msgValue,
      from: fromValue,
      to: toValue,
      likes: span2Value,
      randomid: randomID,
    });

    clearInput();
  }
});

function clearEndorsements() {
  ulEl.innerHTML = "";
}

onValue(endorsementInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());

    console.log(itemArray);

    clearEndorsements();

    for (let i = 0; i < itemArray.length; i++) {
      let item = itemArray[i];
      let itemID = item[0];
      let itemMsg = item[1].message;
      let itemFrom = item[1].from;
      let itemTo = item[1].to;
      let itemLikes = item[1].likes;
      let itemRandomID = item[1].randomid;
      render(itemID, itemMsg, itemFrom, itemTo, itemLikes, itemRandomID);
    }
  } else clearEndorsements();
});

function render(itemid, msg, from, to, likes, RandomID) {
  const newElLi = document.createElement("li");
  const newElfrom = document.createElement("div");
  const newElto = document.createElement("div");

  const newElMsg = document.createElement("div");

  const span1 = document.createElement("span");
  const span2 = document.createElement("span");

  newElfrom.className = "ul-div-from";
  newElto.className = "ul-div-to";
  newElMsg.className = "ul-div-msg";
  span2.className = "span2";

  newElfrom.appendChild(span1);
  newElfrom.appendChild(span2);

  newElMsg.textContent = msg;

  span1.textContent = from;
  span2.textContent = likes;

  newElto.textContent = to;

  newElLi.append(newElto);
  newElLi.append(newElMsg);
  newElLi.append(newElfrom);
  ulEl.append(newElLi);

  span2.id = itemid;

  localStorage.setItem(RandomID, "done");

  span2.addEventListener("click", function () {
    let currentLikesString = span2.textContent.trim().substring(2);
    let currentLikes = currentLikesString ? parseInt(currentLikesString) : 0;

    if (currentLikes === 0 && !localStorage.getItem(itemid)) {
      currentLikes++;

      const likesRef = ref(database, `Endorsements/${itemid}/likes`);

      set(likesRef, `🖤 ${currentLikes}`);

      span2.textContent = `🖤 ${currentLikes}`;

      localStorage.setItem(itemid, "liked");
    } else if (currentLikes === 1 && localStorage.getItem(itemid)) {
      currentLikes--;
      const likesRef = ref(database, `Endorsements/${itemid}/likes`);

      set(likesRef, `🖤`);
      span2.textContent = `🖤`;

      localStorage.removeItem(itemid);
    } else if (currentLikes === 1 && !localStorage.getItem(itemid)) {
      currentLikes++;
      const likesRef = ref(database, `Endorsements/${itemid}/likes`);

      set(likesRef, `🖤 ${currentLikes}`);

      span2.textContent = `🖤 ${currentLikes}`;

      localStorage.setItem(itemid, "liked");
    } else if (currentLikes > 1 && localStorage.getItem(itemid)) {
      currentLikes--;
      const likesRef = ref(database, `Endorsements/${itemid}/likes`);

      set(likesRef, `🖤 ${currentLikes}`);

      span2.textContent = `🖤 ${currentLikes}`;
    } else if (currentLikes > 1 && !localStorage.getItem(itemid)) {
      currentLikes++;
      const likesRef = ref(database, `Endorsements/${itemid}/likes`);

      set(likesRef, `🖤 ${currentLikes}`);

      span2.textContent = `🖤 ${currentLikes}`;
    }

    console.log(itemid);
  });

  newElMsg.addEventListener("dblclick", function () {
    console.log("hekrjek");
    if (localStorage.getItem(RandomID)) {
      let exactLocation = ref(database, `Endorsements/${itemid}`);

      remove(exactLocation);
      console.log("hel");
      localStorage.removeItem(RandomID);
    }
  });
}