const fnChangePassword = (mail) => {
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
      fnCallApi(cpwd, mail);
    } else {
      document.querySelector("#matchError").style.display = "flex";
    }
  } else {
    document.querySelector("#error").style.display = "flex";
  }
};

const domain = "localhost";
const port = 80;
const fnCallApi = (password, email) => {
  fetch(`http://${domain}:${port}/change/user/password`, {
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
