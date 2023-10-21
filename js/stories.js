"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  AllStoriesHTML();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // don't understand showDeleteBTN parameter {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  // don't quite understand
  return $(`
      <li id="${story.storyId}">
     <div class="story-info">
     <div class=first-line>
     ${showDeleteBtn ? getDeleteBtnHTML() : ""}
     ${showStar ? getStarHTML(story, currentUser) : ""}
      
        <a href="${story.url}" target="a_blank" class="story-link" >
          ${story.title}
        </a>
        <small class="story-hostname ">(${hostName}) </small>
        </div>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <div>
      </li>
      
    `);
}

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<span class="star"><i class="${starType} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function AllStoriesHTML() {
  console.debug("AllStoriesHTML");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function myStoriesHTML() {
  console.debug("myStoriesHTML");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h5>Add Stories Here!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await myStoriesHTML();
}

$myStoriesList.on("click", ".trash-can", deleteStory);

async function newStoryHTML(evt) {
  evt.preventDefault();
  console.debug("newStoryHTML", evt);

  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const newStory = { title, author, url, username };

  let story = await storyList.addStory(currentUser, newStory);
  let storyMarkup = generateStoryMarkup(story);
  $submitStoryForm.trigger("reset");
  $submitStoryForm.slideUp("slow");

  $allStoriesList.prepend(storyMarkup);
}

$submitStoryForm.on("submit", newStoryHTML);

function favStoryHTML() {
  $favStoriesList.empty();
  if (currentUser.favorites.length === 0) {
    $favStoriesList.append("<h5> Add to List!<h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStoriesList.append($story);
    }
  }
  $favStoriesList.show();
}

// add to favorite and remove from favorite
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");
  const $targetEl = $(evt.target);
  const $closestLi = $targetEl.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);
  if ($targetEl.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $targetEl.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $targetEl.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorite);

// async function toggleStoryFavorite(evt) {
//   console.debug("toggleStoryFavorite");

//   const $tgt = $(evt.target);
//   const $closestLi = $tgt.closest("li");
//   const storyId = $closestLi.attr("id");
//   const story = storyList.stories.find((s) => s.storyId === storyId);

//   // see if the item is already favorited (checking by presence of star)
//   if ($tgt.hasClass("fas")) {
//     // currently a favorite: remove from user's fav list and change star
//     await currentUser.removeFavorite(story);
//     $tgt.closest("i").toggleClass("fas far");
//   } else {
//     // currently not a favorite: do the opposite
//     await currentUser.addFavorite(story);
//     $tgt.closest("i").toggleClass("fas far");
//   }
// }

// $storiesLists.on("click", ".star", toggleStoryFavorite);

// function generateStoryMarkup(story, showDeleteBtn = false) {
//   // console.debug("generateStoryMarkup", story);

//   const hostName = story.getHostName();

//   // if a user is logged in, show favorite/not-favorite star
//   const showStar = Boolean(currentUser);

//   return $(`
//       <li id="${story.storyId}">
//         <div>
//         ${showDeleteBtn ? getDeleteBtnHTML() : ""}
//         ${showStar ? getStarHTML(story, currentUser) : ""}
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <div class="story-author">by ${story.author}</div>
//         <div class="story-user">posted by ${story.username}</div>
//         </div>
//       </li>
//     `);
// }

// /** Make delete button HTML for story */

// function getDeleteBtnHTML() {
//   return `
//       <span class="trash-can">
//         <i class="fas fa-trash-alt"></i>
//       </span>`;
// }

// /** Make favorite/not-favorite star for story */

// function getStarHTML(story, user) {
//   const isFavorite = user.isFavorite(story);
//   const starType = isFavorite ? "fas" : "far";
//   return `
//       <span class="star">
//         <i class="${starType} fa-star"></i>
//       </span>`;
// }
