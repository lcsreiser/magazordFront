const body = document.querySelector("#container");
const userInfo = document.querySelector("#user-info")
const infos = document.querySelector("#infos-show-hidden")
const upDOwn = document.querySelector("#up-down")
const allRepos = document.querySelector("#all-repos")
const nRepos = document.querySelector("#n-repositories")
const nStars = document.querySelector("#n-stars")
const myRepos = document.querySelector("#my-repos")
const myStars = document.querySelector("#my-stars")
const buttons = document.querySelector("#type-language")
const modalType = document.querySelector("#modal-type");
const modalLanguage = document.querySelector("#modal-language");
const btnCloseType = document.querySelector("#close-type");
const btnCloseLanguage = document.querySelector("#close-language");
const checkboxes = document.querySelectorAll(".options input");
const valorInput = document.getElementById("input-search");

let json;
let arrRepos;
let arrStars

async function getApiGithub() {
    await fetch('https://api.github.com/users/lcsreiser')
        .then(async res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            json = await res.json()
        }).catch(e => console.log(e))

    await fetch('https://api.github.com/users/lcsreiser/repos')
        .then(async res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            arrRepos = await res.json()
        }).catch(e => console.log(e))

    await fetch('https://api.github.com/users/lcsreiser/starred')
        .then(async res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            arrStars = await res.json()
        }).catch(e => console.log(e))

    let { avatar_url, name, bio, company, location, blog, twitter_username } = json

    nRepos.innerHTML = arrRepos.length;
    nStars.innerHTML = arrStars.length;

    userInfo.children["user-image"].src = avatar_url;
    userInfo.children["user-name"].innerHTML = name;
    userInfo.children["user-description"].innerHTML = bio;

    infos.children["user-company"].children[1].innerHTML = company || "-"
    infos.children["user-location"].children[1].innerHTML = location || "-"
    infos.children["user-blog"].children[1].innerHTML = blog || "-"
    infos.children["user-twitter"].children[1].innerHTML = twitter_username || "-"

    upDOwn.addEventListener("click", hiddenShow);

    function hiddenShow() {
        if (infos.classList[2] === "hidden") {
            infos.classList.remove("hidden")
            userInfo.children[4].children["up-down"].src = "/assets/up.svg"
        } else {
            infos.classList.add("hidden")
            userInfo.children[4].children["up-down"].src = "/assets/down.svg"
        }
    }

    let turn;
    function reposAndStars(conditional, arr) {
        turn = conditional;
        allRepos.innerHTML = "";
        if (conditional) {
            myRepos.classList.add("clicked")
            myRepos.children[0].src = "/assets/repos-clicked.svg"
            myStars.classList.remove("clicked")
            myStars.children[0].src = "/assets/star.svg"

            arr.map(repo => {
                let li = document.createElement('li');
                let { name, description, stargazers_count, language, forks_count, default_branch, html_url } = repo

                li.innerHTML = `
                    <a href=${html_url}>
                    <div class="div-row"><h4 id="repo-name">${name} </h4> / <h4 id="repo-branch"> ${default_branch}</h4></div>
                    <div id="div-description">${description || "-"} </div>
                    <div class="div-row">
                        <img src="/assets/starBlack.svg"/>
                        <p>${stargazers_count}</p>
                        <img src="/assets/fork.svg"/>
                        <p>${forks_count}</p>
                    </div>
                    </a>
                    `
                allRepos.appendChild(li);
            })
        } else {
            myStars.classList.add("clicked")
            myStars.children[0].src = "/assets/star-clicked.svg"
            myRepos.classList.remove("clicked")
            myRepos.children[0].src = "/assets/repos.svg"

            arr.map(repo => {
                let li = document.createElement('li');
                let { name, description, stargazers_count, language, forks_count, default_branch, html_url } = repo

                li.innerHTML = `
                <a href=${html_url}>
                <div class="div-row"><h4 id="repo-name">${name} </h4> / <h4 id="repo-branch"> ${default_branch}</h4></div>
                <div id="div-description">${description || "sem descrição"} </div>
                <div class="div-row">
                    <p>${language || "-"}</p>
                    <img src="/assets/fork.svg"/>
                    <p>${forks_count}</p>
                </div>
                </a>
                `

                allRepos.appendChild(li);
            })
        }
    }
    reposAndStars(true, arrRepos);

    myRepos.addEventListener("click", () => reposAndStars(true, arrRepos));
    myStars.addEventListener("click", () => reposAndStars(false, arrStars));

    buttons.children[0].addEventListener('click', () => {
        modalType.style.display = 'block';
    });

    buttons.children[1].addEventListener('click', () => {
        modalLanguage.style.display = 'block';
    });

    btnCloseType.addEventListener('click', () => {
        modalType.style.display = 'none';
    });

    btnCloseLanguage.addEventListener('click', () => {
        modalLanguage.style.display = 'none';
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', handleCheckboxClick);
    });

    let checkboxLabel = []
    function handleCheckboxClick(event) {
        const checkboxId = event.target.id;
        let value = (document.querySelector(`label[for="${checkboxId}"]`)?.innerText)?.toLowerCase() || (event.target.value)?.toLowerCase()
        if (checkboxLabel.includes(value)) {
            checkboxLabel = checkboxLabel.filter(e => e !== value)
        } else {
            checkboxLabel.push(value);
        }
        if (checkboxLabel.length === 0 || checkboxLabel.includes("All") || checkboxLabel[0] === "") {
            if (turn) {
                reposAndStars(true, arrRepos)
            } else {
                reposAndStars(false, arrStars)
            }
        } else {
            if (turn) {
                let newArrRepos = arrRepos.filter(e => checkboxLabel.includes((e.language)?.toLowerCase()))
                reposAndStars(true, newArrRepos)
            } else {
                let newArrStars = arrStars.filter(e => checkboxLabel.includes((e.language)?.toLowerCase()))
                reposAndStars(false, newArrStars)
            }
        }
    }

    valorInput.onchange = function (event) {
        // console.log(event.target.value)
        handleCheckboxClick(event)
        checkboxLabel = []
    }

};

getApiGithub()