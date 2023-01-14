"use strict";

class Idea {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(title, text) {
    this.title = title;
    this.text = text;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    /*  this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`; */
    this.description = `${this.title[0].toUpperCase()}${this.title.slice(
      1
    )} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()} ${this.date.getFullYear()}`;
  }
}

class Cat1 extends Idea {
  type = "cat1";

  constructor(title, text) {
    super(title, text);
    this._setDescription();
  }
}

class Cat2 extends Idea {
  type = "cat2";

  constructor(title, text) {
    super(title, text);
    this._setDescription();
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector(".form");
const containerIdeas = document.querySelector(".ideas");
const inputType = document.querySelector(".form__input--type");
const subButton = document.querySelector(".form__btn");
const inputTitle = document.querySelector(".form__input--title");
const inputText = document.querySelector(".form__input--text");
const pinboard = document.querySelector(".pinboard");
const pinboardBut = document.querySelector(".pinboard__button");
const pinboardHead = document.querySelector(".pinboard__heading");
const pinboardText = document.querySelector(".pinboard__text");

class App {
  #ideasArr = [];

  constructor() {
    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newIdea.bind(this));
    pinboardBut.addEventListener("click", this._showForm);
    // pinboardBut.addEventListener("click", function () {
    //   console.log("click click click");
    // });

    // Attach on container so that it works for clicks on all the ideas (as event bubbles up)
    containerIdeas.addEventListener("click", this._showPinboard.bind(this));
  }

  _newIdea(e) {
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    console.log("value is " + type);
    const title = inputTitle.value;
    const text = inputText.value;
    let idea;

    // If cat1
    if (type === "cat1") {
      // Check if data is valid
      if (title == "" || text == "")
        return alert("Inputs have to be filled in");

      idea = new Cat1(title, text);
    }

    // If cat2
    if (type === "cat2") {
      if (title == "" || text == "")
        return alert("Inputs have to be filled in");

      idea = new Cat2(title, text);
    }

    // Add new object to ideas array
    this.#ideasArr.push(idea);
    console.log("array: " + this.#ideasArr[0]);

    // Render workout on list
    this._renderIdea(idea);

    // Set local storage to all workouts
    this._setLocalStorage();

    // Clear input fields
    inputType.value = "cat1";
    inputTitle.value = "";
    inputText.value = "";

    //Go to the new idea so that it is visible
    const firstIdea = containerIdeas.firstChild;
    firstIdea.firstElementChild.scrollIntoView();
  }

  _renderIdea(idea) {
    let html = `<li class="idea idea--${idea.type}" data-id="${idea.id}">
    <h2 class="idea__title">${idea.description}</h2></li>`;

    containerIdeas.insertAdjacentHTML("afterbegin", html);
  }
  _hideForm() {
    // Empty inputs
    inputType.value = "cat1";
    inputTitle.value = "";
    inputText.value = "";
    // form.style.display = "none";
    form.classList.add("hidden");
    // setTimeout(() => (form.style.display = "grid"), 1000);
  }
  _showForm(e) {
    console.log("in Form");
    // Hide the pinboard
    pinboard.classList.add("hidden");

    // Show Form
    form.classList.remove("hidden");
    inputTitle.focus();
  }
  _showPinboard(e) {
    console.log("in showPinboard");

    // Hide the form
    this._hideForm();

    const ideaElement = e.target.closest(".idea");

    if (!ideaElement) return;

    const ideaToDisplay = this.#ideasArr.find(
      (idea) => idea.id === ideaElement.dataset.id
    );
    console.log(`the idea is display is ${JSON.stringify(ideaToDisplay)}`);

    pinboardHead.innerHTML = ideaToDisplay.description;
    pinboardText.innerHTML = ideaToDisplay.text;
    // Show Pinboard
    pinboard.classList.remove("hidden");
  }

  _setLocalStorage() {
    localStorage.setItem("ideas", JSON.stringify(this.#ideasArr));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("ideas"));

    if (!data) return;

    this.#ideasArr = data;

    this.#ideasArr.forEach((idea) => {
      this._renderIdea(idea);
    });
  }

  reset() {
    console.log("in reset");
    localStorage.removeItem("ideas");
    location.reload();
  }
}
const app = new App();
