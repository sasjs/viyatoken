let sasJs;

let client = "";
let secret = "";
let authcode = "";

function appInit() {
  sasJs.request('common/appinit', null, null, (loginRequired) => {
    if (loginRequired) {
        const loginForm = document.querySelector("#login-form");
        loginForm.style.display = '';
    }
  }).then(res => {
    if (res.groups) {
      groups = res.groups;

      if (res.groups.length > 0) {
        document.querySelector('#nogroups').style.display = 'none';
        let requiredUserGroupsContainer = document.querySelector('#requiredUserGroupsContainer');

        for (let group of groups) {
          let optionWrapper = document.createElement('div');
          let optionHtml = `
            <input type="checkbox" id="required_user_groups-${group.ID}" value="${group.ID}" class="user-group-input">
            <label for="required_user_groups-${group.ID}"> ${group.NAME} </label><br>
          `;

          optionWrapper.innerHTML = optionHtml;

          requiredUserGroupsContainer.append(optionWrapper);
        }

        document.querySelector('.lds-ring').style.display = 'none';
        document.querySelector('.client-settings').style.display = '';
      }
    }
  });
}

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

function getClientSettings() {
  let name = document.querySelector('#name').value;

  let authorization_code = document.querySelector('#authorized_grant_types-authorization_code').checked ? 'authorization_code' : "";
  let implicit = document.querySelector('#authorized_grant_types-implicit').checked ? 'implicit' : "";
  let client_credentials = document.querySelector('#authorized_grant_types-client_credentials').checked ? 'client_credentials' : "";
  let authorization_grant_types = `${authorization_code ? authorization_code : ''} ${implicit ? implicit : ''} ${client_credentials ? client_credentials : ''}`;
  if (!authorization_code && !implicit && !client_credentials) authorization_grant_types = "";

  let scope = document.querySelector('#scope').value;
  let access_token_validity = document.querySelector('#access_token_validity').value;
  access_token_validity = access_token_validity.length > 0 ? parseInt(access_token_validity) : null;

  let refresh_token_validity = document.querySelector('#refresh_token_validity').value;
  refresh_token_validity = refresh_token_validity.length > 0 ? parseInt(refresh_token_validity) : null;

  let autoapprove = document.querySelector('#autoapprove').checked ? 'true' : 'false';
  let usesession = document.querySelector('#use_session').checked ? 'true' : 'false';

  let required_user_groups = "";
  let user_group_inputs = document.querySelectorAll('.user-group-input');

  for (let group_input of user_group_inputs) {
    if (group_input.checked) {
      if (required_user_groups.length > 0) {
        required_user_groups += ' ';
      }

      required_user_groups += group_input.value;
    }
  }

  return {
    name: name,
    authorization_grant_types: authorization_grant_types,
    scope: scope,
    access_token_validity: access_token_validity,
    refresh_token_validity: refresh_token_validity,
    required_user_groups: required_user_groups,
    autoapprove: autoapprove,
    use_session: usesession
  }
}

function generateToken() {
    const generateTokenButton = document.querySelector('#generate-token');
    const clientSettingsContainer = document.querySelector('.client-settings');
    generateTokenButton.style = 'opacity: 0.3; pointer-events: none;';
    generateTokenButton.innerText = 'Generating...';

    let clientSettings = getClientSettings();

    let data = {'clientsettings': [clientSettings]};

    sasJs.request("admin/getapptoken", data, null, (loginRequired) => {
        if (loginRequired) {
            const loginForm = document.querySelector("#login-form");
            loginForm.style.display = '';
        }
      }).then(res => {
        client = res.clientinfo[0].CLIENT;
        secret = res.clientinfo[0].SECRET;

        clientSettingsContainer.style.display = 'none';

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

                let tokenInfoEnv = `access_token=${res.tokeninfo[0].ACCESS_TOKEN}\nclient=${res.tokeninfo[0].CLIENT}\nsecret=${res.tokeninfo[0].SECRET}\nrefresh_token=${res.tokeninfo[0].REFRESH_TOKEN}`;

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

function refreshPage() {
  if (location.href.includes('/files/files')) {
    const origin = window.location.origin
      ? window.location.origin
      : `${window.location.protocol}//${window.location.hostname}${(window.location.port ? ':' + window.location.port : '')}`;
  
    window.location = `${origin}/SASJobExecution?_PROGRAM=${sasJs.appLoc}/clickme`;
  }

  window.location.reload();
}

function copyText(id) {
  const element = document.getElementById(id);
  const range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(element);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  alert("Your config has been copied to the clipboard.");
}