const fnPwdValidate = (e) => {
  const { id, value } = e?.target;
  let pwd = document.getElementsByName("password")[0].value;
  let cpwd = document.getElementsByName("confirmPassword")[0].value;

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
    spChar(value) &&
    upperCaseChar(value) &&
    lowerCaseChar(value) &&
    numChar(value) &&
    reqLength(value)
  ) {
    if (pwd === cpwd) {
      document.querySelector("#matchError").style.display = "none";
      document.querySelector("#error").style.display = "none";
    } else {
      document.querySelector("#matchError").style.display = "flex";
    }
  } else {
    document.querySelector("#error").style.display = "flex";
  }
};
