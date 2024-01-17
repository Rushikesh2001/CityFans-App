// let achievement = document.getElementsByClassName("achievement");

// // setInterval(() => {
// //   console.log(window.scrollY);
// // }, 1000);
// window.addEventListener("scroll", () => {
//   if (window.scrollY === 701) {
//     var x = 0;
//     setInterval(trophies, 500);
//     console.log(x);
//     function trophies() {
//       if (x < 5) {
//         achievement[0].innerHTML = x;
//         x += 1;
//       } else {
//         const intervalID = setInterval(trophies, 500);
//         clearInterval(intervalID);
//       }
//     }
//   }
// });

/*window.addEventListener("scroll", () => {
  if (window.scrollY >= 155 && window.scrollY <= 1144) {
    let st19 = document.styleSheets[0].cssRules[19];
    let value = st19.style.backgroundPositionY;
    let newValue = "";
    for (let i = 0; i < 4; i++) {
      newValue += value[i];
    }
    newValue = parseInt(newValue);
    updateValue = newValue - 1;
    st19.style.backgroundPositionY = `${updateValue}px`;
  }
});*/

let socialIcon = document.getElementsByClassName("fab");

let divIcon = document.getElementsByClassName("icons");

len = Array.from(divIcon).length;

for (let i = 0; i < len; i++) {
  divIcon[i].addEventListener("mouseover", () => {
    divIcon[i].style.backgroundColor = "lightblue";
    socialIcon[i].style.color = "black";
  });
}

for (let i = 0; i < len; i++) {
  divIcon[i].addEventListener("mouseout", () => {
    divIcon[i].style.backgroundColor = "#1b0b20";
    socialIcon[i].style.color = "lightblue";
  });
}

//Making Image slider
window.addEventListener("DOMContentLoaded", () => {
  let i = 1;
  let slides = document.querySelectorAll(".contentBox");

  setInterval(() => {
    if (i == slides.length) {
      slides[i - 1].className = "contentBox fadeOut";
      slides[0].className = "contentBox fadeIn";
      i = 0;
    } else {
      slides[i - 1].className = "contentBox fadeOut";
      slides[i].className = "contentBox fadeIn";
    }

    i++;
  }, 5000);
});

//Loading news into template
var loadNewsBoard = (link, imgLink, title) => {
  document.querySelector(
    "#newsBoard"
  ).style.backgroundImage = `url(${imgLink})`;
  document.querySelector("#newsHeadLine").innerText = title;
  document.querySelector("#articleLink").setAttribute("href", `${link}`);
};

//Display mobile menu
let right = parseInt(getComputedStyle(document.getElementById("menu")).right);
const showMobileMenu = () => {
  let nav = document.getElementById("menu");
  let ct = parseInt(getComputedStyle(document.getElementById("menu")).right);
  nav.style.transform = `translateX(${right}px)`;
  right = right >= 0 ? ct : 0;
};
