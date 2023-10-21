"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();

  AllStoriesHTML();
}

$body.on("click", "#nav-all", navAllStories);

function submitOnClick(evt) {
  console.debug("submitOnClick", evt);
  $allStoriesList.show();
  $submitStoryForm.slideDown("slow");
}

function submitStory(evt) {
  console.debug("submitStory", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}
$navSubmit.on("click", submitStory);

function showFavs(evt) {
  console.debug("showFavs", evt);
  hidePageComponents();
  favStoryHTML();
}
$body.on("click", "#nav-favorites", showFavs);

function showMyStories(evt) {
  console.debug("showMyStories", evt);
  hidePageComponents();
  myStoriesHTML();
}

$body.on("click", "#nav-my-stories", showMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
