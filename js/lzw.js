// LZW-compress a string
function lzw_encode() {
  if (!validateEncode()) return;
  var uncompressed = document.getElementById("data").value;
  let dictionary = {};
  for (let i = 0; i < 258; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }

  let word = "";
  let result = [];
  let dictSize = 258;

  for (let i = 0, len = uncompressed.length; i < len; i++) {
    let curChar = uncompressed[i];
    let joinedWord = word + curChar;

    // Do not use dictionary[joinedWord] because javascript objects
    // will return values for myObject['toString']
    if (dictionary.hasOwnProperty(joinedWord)) {
      word = joinedWord;
    } else {
      result.push(dictionary[word]);
      // Add wc to the dictionary.
      dictionary[joinedWord] = dictSize++;
      word = curChar;
    }
  }

  if (word !== "") {
    result.push(dictionary[word]);
  }

  // validate bigger than 4095
  if (!inputInvalid(result)) {
    return;
  }

  var typeData = document.getElementById("type-data").value;
  if (typeData === "binary") {
    result = result.map((item) => {
      return Number(item).toString(2);
    });
  }

  console.log(result);
  document.getElementById("modal-content-result").innerHTML =
    "Kết quả của mã hóa chuỗi「 " +
    uncompressed +
    " 」là:<br>" +
    result.join(" ") +
    "<br>Tỉ lệ nén: " +
    getRatio(
      uncompressed.length,
      typeData === "binary"
        ? result.map((item) => {
            return parseInt(item, 2);
          })
        : result
    ) +
    "<br>Độ dư thừa: " +
    getRedundancy(
      getRatio(
        uncompressed.length,
        typeData === "binary"
          ? result.map((item) => {
              return parseInt(item, 2);
            })
          : result
      )
    ) +
    " %";
  modal.style.display = "block";
  return result;
}

// Decompress an LZW-encoded string
function lzw_decode() {
  var compressed = document.getElementById("data").value;
  if (compressed.includes(" ")) {
    compressed = compressed.split(" ");
  } else {
    compressed = [compressed.toString()];
  }

  var typeData = document.getElementById("type-data").value;
  if (typeData === "binary") {
    compressed = compressed.map((item) => {
      return parseInt(item, 2);
    });
  }

  // validate bigger than 4095
  if (!inputInvalid(compressed)) {
    return;
  }

  // Initialize Dictionary (inverse of compress)
  let dictionary = {};
  for (let i = 0; i < 258; i++) {
    dictionary[i] = String.fromCharCode(i);
  }

  let word = String.fromCharCode(compressed[0]);
  let result = word;
  let entry = "";
  let dictSize = 258;

  try {
    for (let i = 1, len = compressed.length; i < len; i++) {
      let curNumber = compressed[i];

      if (dictionary[curNumber] !== undefined) {
        entry = dictionary[curNumber];
      } else {
        if (curNumber === dictSize) {
          entry = word + word[0];
        } else {
          throw "Error in processing";
        }
      }

      result += entry;

      // Add word + entry[0] to dictionary
      dictionary[dictSize++] = word + entry[0];

      word = entry;
    }
  } catch (error) {
    result = "";
  }

  if (typeData === "decimal") {
    // check data input is binary
    if (compressed[0].toString().length > 3) {
      result = "";
    }
  }
  if (!validateDecode(result)) return;

  console.log(result);
  document.getElementById("modal-content-result").innerHTML =
    "Kết quả của giải mã chuỗi「" + compressed.join(" ") + "」là:<br>" + result;
  modal.style.display = "block";
  return result;
}

function getBit(number) {
  if (number <= 4095) {
    if (number >= 2048) {
      return 12;
    }
    if (number >= 1023) {
      return 11;
    }
    if (number >= 512) {
      return 10;
    }
    if (number >= 258) {
      return 9;
    }
  }
  return 8;
}

function getRatio(inputLength, arrayResult) {
  let bitInput = inputLength * 8;
  let bitResult = 0;
  arrayResult.map((item) => {
    bitResult += getBit(item);
  });
  return bitInput / bitResult;
}

function getRedundancy(ratio) {
  return (1 - 1 / ratio) * 100;
}
