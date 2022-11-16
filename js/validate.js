function validateEncode() {
  if (!document.getElementById("data").value) {
    document.getElementById("modal-content-result").innerHTML =
      "Bạn chưa nhập chuỗi!";
    document.querySelector(".modal-content").style.border = "4px solid #ff3c3c";
    modal.style.display = "block";
    return false;
  } else {
    document.querySelector(".modal-content").style.border = "4px solid #14cd14";
  }
  return true;
}

function validateDecode(string) {
  if (!document.getElementById("data").value || !string) {
    document.getElementById("modal-content-result").innerHTML =
      "Bạn chưa nhập chuỗi hoặc chuỗi đã nhập không chính xác!";
    document.querySelector(".modal-content").style.border = "4px solid #ff3c3c";
    modal.style.display = "block";
    return false;
  } else {
    document.querySelector(".modal-content").style.border = "4px solid #14cd14";
  }
  return true;
}

function isBinary(str) {
  let isBinary = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "0" || str[i] == "1") {
      isBinary = true;
    } else {
      isBinary = false;
    }
  }
  console.log({isBinary})
}

function inputInvalid(array) {
  if (Math.max(...array) > 4095) {
    document.getElementById("modal-content-result").innerHTML =
      "Chuỗi đã nhập quá dài!";
    document.querySelector(".modal-content").style.border = "4px solid #ff3c3c";
    modal.style.display = "block";
    console.log(array);
    return false;
  } else {
    document.querySelector(".modal-content").style.border = "4px solid #14cd14";
  }
  return true;
}