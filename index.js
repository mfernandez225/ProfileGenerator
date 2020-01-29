const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const pdf = require("html-pdf");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
    {
      type: "input",
      name: "github",
      message: "What is your Github username?"
    }
  ]);
}

function createHTML({
  color,
  github,
  name,
  avatar_url,
  location,
  public_repos,
  following
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" type="text/css" href="style.css">
  <link href="https://fonts.googleapis.com/css?family=Bowlby+One+SC|Roboto&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
  <script src="https://kit.fontawesome.com/1fd7449b08.js" crossorigin="anonymous"></script>
  <title>Profile Generator</title>
</head>
<body style="background-color: ${color}">
  <div id="profilePicture">
    <img src="${avatar_url}" width="200" height="200" alt="avatar" class="" />
    <h1 id="profileName">${name}</h1>
  </div>
  <div class="container">
    <div class="row">
      <div class="col">
        <ul class="">
          <li id="github" class="list-group-item">
            GitHub Username: ${github}
          </li>
          <li id="location" class="list-group-item">City: ${location}
          </li>
          </li>
          <li id="repos" class="list-group-item">Public Repositories: ${public_repos}
          </li>
          </li>
          <li id="Followers" class="list-group-item">Followers: ${following}
          </li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>

`;
}

promptUser().then(function(answers) {
  // What I need from Github
  // Profile Image
  // Username
  // Links to location, github profile, blog
  // Display user bio
  // Number of public repos
  // Number of Followers
  // Github Stars
  // Number of user following
  axios
    .get(`https://api.github.com/users/${answers.github}`)
    .then(
      ({
        data: {
          login,
          name,
          avatar_url,
          location,
          blog,
          public_repos,
          following
        }
      }) => {
        const html = createHTML({
          login,
          name,
          avatar_url,
          location,
          blog,
          public_repos,
          following,
          ...answers
        });
        pdf
          .create(html, {
            format: "Letter"
          })
          .toFile("./profile.pdf", function(err, res) {
            if (err) return console.log(err);
            console.log(res);
          });
        writeFileAsync("index.html", html).then(() => console.log("Success!"));
      }
    );
});
