const fnChangePassword = (mail, id) => {
  let pwd = document.getElementsByName("pwd")[0].value;
  let cpwd = document.getElementsByName("cpwd")[0].value;

  function spChar(str) {
    for (let ind in str) {
      let code = str.charCodeAt(ind);
      if (
        33 <= code <= 47 ||
        58 <= code <= 64 ||
        91 <= code <= 96 ||
        123 <= code <= 126
      ) {
        return true;
      }
    }
    return false;
  }

  function upperCaseChar(str) {
    for (let ind in str) {
      let code = str.charCodeAt(ind);
      if (65 <= code <= 90) {
        return true;
      }
    }
    return false;
  }

  function lowerCaseChar(str) {
    for (let ind in str) {
      let code = str.charCodeAt(ind);
      if (97 <= code <= 122) {
        return true;
      }
    }
    return false;
  }

  function numChar(str) {
    for (let ind in str) {
      let code = str.charCodeAt(ind);
      if (48 <= code <= 57) {
        return true;
      }
    }
    return false;
  }

  function reqLength(str) {
    if (str.length >= 8) {
      return true;
    }
    return false;
  }

  if (
    spChar(cpwd) &&
    upperCaseChar(cpwd) &&
    lowerCaseChar(cpwd) &&
    numChar(cpwd) &&
    reqLength(cpwd)
  ) {
    if (pwd === cpwd) {
      fnCallApi(cpwd, mail, id);
    } else {
      document.querySelector("#matchError").style.display = "flex";
    }
  } else {
    document.querySelector("#error").style.display = "flex";
  }
};

const hostName = window.location.hostname;
const protocol = window.location.protocol;
const appUrl = `${protocol}//${hostName}`;
const fnCallApi = (password, email, id) => {
  fetch(`${appUrl}/change/user/password?id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pwd: password,
      mail: email,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      window.location = "/reset-success";
    })
    .catch((err) => {
      console.log(err);
    });
};
