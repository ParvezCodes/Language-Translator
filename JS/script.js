const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("button");
const fromText = document.querySelector(".from__text");
const toText = document.querySelector(".to__text");
const exchangeIcon = document.querySelector(".exchange");
const icon = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    // select english and hindi as default language
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "hi-IN") {
      selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option); //adding option tag inside select tag
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  (fromText.value = toText.value), (selectTag[0].value = selectTag[1].value);
  (toText.value = tempText), (selectTag[1].value = tempLang);
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value,
    translateFrom = selectTag[0].value, //getting fromSelect tag value
    translateTo = selectTag[1].value; //getting toSelect tag value

  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});

// icon.forEach((icon) => {
//   icon.addEventListener("click", ({ target }) => {
//     if (target.classList.contains("fa-copy")) {
//       if (target.id == "from") {
//         navigator.clipboard.writeText(fromText.value);
//       } else {
//         navigator.clipboard.writeText(toText.value);
//       }
//     } else {
//       let voice;
//       if (target.id == "from") {
//         voice = new SpeechSynthesisUtterance(fromText.value);
//         voice.lang = selectTag[0].value;
//       } else {
//         voice = new SpeechSynthesisUtterance(toText.value);
//         voice.lang = selectTag[1].value;
//       }
//       speechSynthesis.speak(voice);
//     }
//   });
// });

// Assuming 'icon' is an array or NodeList of elements
icon.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("fa-copy")) {
      const textToCopy = target.id == "from" ? fromText.value : toText.value;

      // Check if the Clipboard API is available
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            console.log("Text copied to clipboard");
          })
          .catch((err) => {
            console.error("Unable to copy to clipboard", err);
          });
      } else {
        // Fallback for browsers that do not support the Clipboard API
        // You can prompt the user to copy manually or use a library like Clipboard.js
        console.warn("Clipboard API not supported");
      }
    } else {
      let voice;
      const textToSpeak = target.id == "from" ? fromText.value : toText.value;

      if ("speechSynthesis" in window) {
        voice = new SpeechSynthesisUtterance(textToSpeak);
        voice.lang =
          target.id == "from" ? selectTag[0].value : selectTag[1].value;

        speechSynthesis.speak(voice);
      } else {
        // Speech synthesis not supported
        console.warn("Speech synthesis not supported");
      }
    }
  });
});
