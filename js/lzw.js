// LZW-compress a string
function lzw_encode() {
  if (!validateEncode()) return;
  var uncompressed = document.getElementById("data").value;
  uncompressed = uncompressed.replace(/\s/g, "");
  let dictionary = {};
  for (let i = 0; i < 258; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }

  let word = "";
  let result = [];
  let dictSize = 258;
  let tableResult = [];
  for (let i = 0, len = uncompressed.length; i < len; i++) {
    let curChar = uncompressed[i];
    let joinedWord = word + curChar;
    let preWord = word;

    // Do not use dictionary[joinedWord] because javascript objects
    // will return values for myObject['toString']
    if (dictionary.hasOwnProperty(joinedWord)) {
      word = joinedWord;

      if (preWord) {
        tableResult.push({
          input: curChar,
          previousChar: preWord,
          joinedWord: joinedWord,
          code: "",
          output: "",
        });
      } else {
        tableResult.push({
          input: curChar,
          previousChar: preWord,
          joinedWord: joinedWord,
          code: dictionary[joinedWord],
          output: "",
        });
      }
    } else {
      result.push(dictionary[word]);
      // Add wc to the dictionary.
      dictionary[joinedWord] = dictSize++;
      word = curChar;
      tableResult.push({
        input: curChar,
        previousChar: preWord,
        joinedWord: joinedWord,
        code: dictionary[joinedWord],
        output: dictionary[preWord],
      });
    }
  }
  if (word !== "") {
    result.push(dictionary[word]);
    tableResult.push({
      input: "EOI",
      previousChar: word,
      joinedWord: `${word}+EOI`,
      code: "",
      output: dictionary[word],
    });
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

  console.log({ tableResult });
  console.log({ result });
  document.getElementById("table-body").innerHTML = "";
  var table = document.getElementById("table-body");
  tableResult.forEach((obj) => {
    var tds = "";
    tds = `<td class='column-in'>${obj.input}</td>
    <td class='column-pre'>${obj.previousChar}</td>
    <td class='column_preAndIn'>${obj.joinedWord}</td>
    <td class='column_code'>${obj.code}</td>
    <td class='column_out'>${obj.output}</td>
  `;
    var objTr = `<tr>${tds}</tr>`;
    table.innerHTML += objTr;
  });

  document.getElementById("modal-content-result").innerHTML =
    "K????t qua?? cu??a ma?? ho??a chu????i??? " +
    uncompressed +
    " ???la??:<br>" +
    result.join(" ") +
    "<br>Ti?? l???? ne??n: " +
    getRatio(
      uncompressed.length,
      typeData === "binary"
        ? result.map((item) => {
            return parseInt(item, 2);
          })
        : result
    ) +
    "<br>?????? d?? th????a: " +
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
  let arrayOutput = [];
  let tableResult = [
    {
      input: word,
      previousChar: "",
      joinedWord: word,
      code: compressed[0],
      output: "",
    },
  ];

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

      arrayOutput.push(curNumber);
      result += " " + entry;

      // Add word + entry[0] to dictionary
      dictionary[dictSize++] = word + entry[0];
      tableResult.push({
        input: entry[0],
        previousChar: word,
        joinedWord: word + entry[0],
        code: dictSize - 1,
        output: word,
      });
      if (Object.values(dictionary).includes(entry) && entry.length > 1) {
        tableResult.push({
          input: word,
          previousChar: entry[0],
          joinedWord: entry,
          code: "",
          output: "",
        });
      }
      word = entry;
    }
    tableResult.push({
      input: "EOI",
      previousChar: word,
      joinedWord: `${word}+EOI`,
      code: "",
      output: word,
    });
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

  console.log({ tableResult });
  console.log({ result });
  document.getElementById("table-body").innerHTML = "";
  var table = document.getElementById("table-body");
  tableResult.forEach((obj) => {
    var tds = "";
    tds = `<td class='column-in'>${obj.input}</td>
    <td class='column-pre'>${obj.previousChar}</td>
    <td class='column_preAndIn'>${obj.joinedWord}</td>
    <td class='column_code'>${obj.code}</td>
    <td class='column_out'>${obj.output}</td>
  `;
    var objTr = `<tr>${tds}</tr>`;
    table.innerHTML += objTr;
  });

  document.getElementById("modal-content-result").innerHTML =
    "K????t qua?? cu??a gia??i ma?? chu????i???" +
    compressed.join(" ") +
    "???la??:<br>" +
    result +
    "<br>Ti?? l???? ne??n: " +
    getRatio(result.replace(/\s/g, "").length, result, true) +
    "<br>?????? d?? th????a: " +
    getRedundancy(getRatio(result.replace(/\s/g, "").length, result, true)) +
    " %";
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

function getRatio(inputLength, arrayResult, isDecode = false) {
  if (!isDecode) {
    let bitInput = inputLength * 8;
    let bitResult = 0;
    arrayResult.map((item) => {
      bitResult += getBit(item);
    });
    return bitInput / bitResult;
  } else {
    var uncompressed = arrayResult.replace(/\s/g, "");
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
    return getRatio(uncompressed.length, result);
  }
}

function getRedundancy(ratio) {
  return (1 - 1 / ratio) * 100;
}
