let sasJs;

let client = "";
let secret = "";
let authcode = "";

function login() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  sasJs.logIn(username, password).then((response) => {
    if (response.login === false) {
    } else {
        const loginForm = document.querySelector("#login-form");
        const generateTokenButton = document.querySelector('#generate-token');

        loginForm.style.display = 'none';
        generateTokenButton.style.display = '';
    }
  });
}

function generateToken() {
    const generateTokenButton = document.querySelector('#generate-token');
    generateTokenButton.style = 'opacity: 0.3; pointer-events: none;';
    generateTokenButton.innerText = 'Generating...';

    sasJs.request("admin/getapptoken", null, null, (loginRequired) => {
        if (loginRequired) {
            const loginForm = document.querySelector("#login-form");
            loginForm.style.display = '';
            generateTokenButton.style.display = 'none';
        }
      }).then(res => {
        client = res.clientinfo[0].CLIENT;
        secret = res.clientinfo[0].SECRET;

        goToAuthPage();
    });
}

function goToAuthPage() {
    let authUrl = `/SASLogon/oauth/authorize?client_id=${client}&response_type=code`;
    
    fetch(location.origin + authUrl)
    .then(response => response.text())
    .then(response => {
        let authorizeUrl = location.origin + '/SASLogon/oauth/authorize';
        let params = {};
        
        let responseBody = response.split("<body>")[1].split("</body>")[0];
        let bodyElement = document.createElement("div");
        bodyElement.innerHTML = responseBody;

        let form = bodyElement.querySelector("#application_authorization");
    
        let inputs = form.querySelectorAll("input");
    
        for (let input of inputs) {
          if (input.name === "user_oauth_approval") {
            input.value = "true";
          }
    
          params[input.name] = input.value;
        }
    
        let formData = new FormData();
    
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            formData.append(key, params[key]);
          }
        }

        fetch(authorizeUrl, {
            method: "POST",
            credentials: "include",
            body: formData,
            referrerPolicy: "same-origin"
        }).then(response => response.text())
        .then(response => {
            let responseBody = response.split("<body>")[1].split("</body>")[0];
            let bodyElement = document.createElement("div");
            bodyElement.innerHTML = responseBody;

            authcode = bodyElement.querySelector('.infobox h4').innerText;

            let data = {
                'fromjs': [
                    {
                        client: client,
                        secret: secret,
                        authcode: authcode
                    }
                ]
            }
            sasJs.request('common/getrefreshtoken', data).then(res => {
                const generateTokenButton = document.querySelector('#generate-token');
                generateTokenButton.style.display = 'none';

                let tokenInfo = JSON.stringify(res.tokeninfo[0], null, 2)
                  .replace("ACCESS_TOKEN", "access_token")
                  .replace("CLIENT", "client")
                  .replace("SECRET", "secret")
                  .replace("AUTHCODE", "authcode")
                  .replace("REFRESH_TOKEN", "refresh_token");

                let tokenInfoEnv = `access_token=${res.tokenInfo[0].ACCESS_TOKEN}\nclient=${res.tokenInfo[0].CLIENT}\nsecret=${res.tokenInfo[0].SECRET}\nauthcode=${res.tokenInfo[0].AUTHCODE}\nrefresh_token=${res.tokenInfo[0].REFRESH_TOKEN}`;

                let access_token_macro = chunkString(res.tokeninfo[0].ACCESS_TOKEN, 240).join('%trim(\r\n)');
                let refresh_token_macro = chunkString(res.tokeninfo[0].REFRESH_TOKEN, 240).join('%trim(\r\n)');

                let tokenInfoMacro = `%let client=${res.tokeninfo[0].CLIENT};<br/>%let secret=${res.tokeninfo[0].SECRET};<br/>%let access_token=${access_token_macro};<br/>%let refresh_token=${refresh_token_macro};<br/>`;

                let tokenInfoP = document.querySelector('#token-info');
                let tokenInfoMacroP = document.querySelector('#token-info-macro');
                let tokenInfoEnvP = document.querySelector('#token-info-env');

                tokenInfoP.innerHTML = tokenInfo;
                tokenInfoP.style = '';

                tokenInfoMacroP.innerHTML = tokenInfoMacro;
                tokenInfoEnvP.innerHTML = tokenInfoEnv;
                let divs=document.getElementsByClassName('secHide')
                function _removeClasses() {
                  divs[0].classList.remove('secHide')
                  if (divs[0]) _removeClasses()
                }
                _removeClasses()
            })
        });
    });
}

function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
}