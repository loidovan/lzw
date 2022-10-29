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
