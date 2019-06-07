function debug () {

  // Retrieve error code input by user
  var code = document.getElementById("code").value;

  /*
  //Check bit 63 (validity of code)

  if(code.startsWith("F")) {
    document.getElementById("errorMeaning").innerHTML = "Test";
  }
  else document.getElementById("errorMeaning").innerHTML = "failed";
  */


  // Convert code to binary
  var codeBin = hex2bin(code);

  // Create var for simple error check to break for loop
  var simpleErrorChk = 0;

  // Clear previous error code
  document.getElementById("errorMeaning").innerHTML = "";

  // Display beginning of error code meaning section
  document.getElementById("errorMeaning").innerHTML += "<strong>ERROR MEANING:</strong><br><br>";

  // Display Error in Formatted Binary
  document.getElementById("errorMeaning").innerHTML +=
  "CODE = " + codeBin[0] + codeBin[1] + codeBin[2] + codeBin[3] + " "
  + codeBin[4] + codeBin[5] + codeBin[6] + codeBin[7] + " "
  + codeBin[8] + codeBin[9] + codeBin[10] + codeBin[11] + " "
  + codeBin[12] + codeBin[13] + codeBin[14] + codeBin[15] + "<br><br>";


// CHECK ERROR CODE

  // Check for Simple Errors
  simpleErrorChk = simpleErrors(codeBin, simpleErrorChk);
  // Check for Compound Errors

  /* Combound Error Table
  000F 0000 0000 11LL - Generic Cache Hierarchy error.
  000F 0000 0001 TTLL - {TT}TLB{LL}_ERR. TLB errors.
  000F 0000 1MMM CCCC - {MMM}_Channel{CCCC}_ERR - Memory controller errors.
  000F 0001 RRRR TTLL - {TT}CACHE{LL}_{RRRR}_ERR - Cache Hierarchy errors.
  000F 1PPT RRRR IILL - BUS{LL}_{PP}_{RRRR}_{II}_T_ERR - Bus and Interconnect errors.
  */

  // Begin For Loop to check Error Code Bits
  for (var i=0; i<codeBin.length; i++) {

    // check for simple error to stop loop
    if (simpleErrorChk==1) break;

    // Confirm first 3 bits are zeroes
    else if (i<3 && codeBin[i]!=0) {
      document.getElementById("errorMeaning").innerHTML += "ERROR, BIT " + i + " - UNKNOWN ERROR CODE. REFER TO ERROR TABLE.<br>";
      break;
    }

    // Check F - Form Flag by checking 4th bit
    else if (i==3) {
      f(codeBin);
    }

    // Check for Bus and Interconnect errors
    else if (i==4 && codeBin[i]=="1") {

      // Check PP Bits
      pp(codeBin);

      // Check T (Time-out) Bit, 1 = Request timed out.
      if (codeBin[7]=="1") {
        document.getElementById("errorMeaning").innerHTML += "Request timed out.<br>";
      }

      // Check RRRR Bits - Action Type Associated with the Error
      rrrr(codeBin);

      // Check II (Memory or I/O) Bits
      ii(codeBin);

      // Check LL Bits - level in the memory hierarchy where the error occurred.
      ll(codeBin);
      break;
    }

    // Confirm bits 5 and 6 are zeroes if bit 4 is zero
    else if (codeBin[4]==0 && ((i==5 | i==6) && codeBin[i]!=0)) {
      document.getElementById("errorMeaning").innerHTML += "ERROR, BIT " + i + " - UNKNOWN ERROR CODE. REFER TO ERROR TABLE.<br>";
      break;
    }

    // Check bit 7 to indicate Cache Hierarchy Error
    else if (i==7 && codeBin[i]!=0) {
      rrrr(codeBin);
      tt(codeBin);

      // Check LL Bits - level in the memory hierarchy where the error occurred.
      ll(codeBin);
      break;
    }

    // Check for Memory Controller Error
    else if (i==8 && codeBin[i]!=0) {
      mmm(codeBin);
      cccc(codeBin);
      break;
    }

    // Confirm bits 9 and 10 are zeroes if bits 4, 7, and 8 are zero
    else if ((codeBin[4]==0 && codeBin[7]==0 && codeBin[8]==0) && ((i==9 | i==10) && codeBin[i]!=0)) {
      document.getElementById("errorMeaning").innerHTML += "ERROR, BIT " + i + " - UNKNOWN ERROR CODE. REFER TO ERROR TABLE.<br>";
      break;
    }

    // Check for TLB Error
    else if (i==11 && codeBin[i]!=0) {
      tt(codeBin);
      ll(codeBin);
      break;
    }

    // Check for Generic Cache Hierarchy Error
    else if (codeBin[12]!=0 && codeBin[13]!=0) {
      ll(codeBin);
      break;
    }

  }

}



// Function to check F - Form Flag by checking 4th bit
function f(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "FILTER TYPE: ";
  if (!codeBin[3]) document.getElementById("errorMeaning").innerHTML += "Normal Filtering<br>";
  else document.getElementById("errorMeaning").innerHTML += "Corrected Filtering<br>";
}

// Function to check for Simple Errors
function simpleErrors(codeBin, simpleErrorChk) {
  if (codeBin == 0000000000000000) {
    document.getElementById("errorMeaning").innerHTML += "No Error reported to this bank of error-reporting registers.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000001) {
    document.getElementById("errorMeaning").innerHTML += "Unclassified - Error has not been classified.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000010) {
    document.getElementById("errorMeaning").innerHTML += "Parity error in internal microcode ROM.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000011) {
    document.getElementById("errorMeaning").innerHTML += "External error-BINIT# from another processor caused this processor MCE. Happens only if BINIT# observation enabled during power on.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000100) {
    document.getElementById("errorMeaning").innerHTML += "Functional redundancy check master/slave error.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000101) {
    document.getElementById("errorMeaning").innerHTML += "Internal parity error.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000000000000110) {
    document.getElementById("errorMeaning").innerHTML += "SMM handler tried to execute outside the ranges specified by SMRR.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000010000000000) {
    document.getElementById("errorMeaning").innerHTML += "Internal timer error.<br>";
    simpleErrorChk++;
  }
  else if (codeBin == 0000111000001011) {
    document.getElementById("errorMeaning").innerHTML += "I/O error.<br>";
    simpleErrorChk++;
  }
  else if (unclassified(codeBin)) {
    document.getElementById("errorMeaning").innerHTML += "Internal unclassified error.<br>";
    simpleErrorChk++;
  }
  return simpleErrorChk;
}
// Function to determine PP (Participation) - Describes the role of the local processor in the error.
function pp(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "PROCESSOR ROLE: ";
  // Create var with PP bits
  var ppBits = codeBin[5] + codeBin[6];
  // Compare bits to determine role of local processor in the error
  switch (ppBits) {
    case "00":
      document.getElementById("errorMeaning").innerHTML += "SRC - Local processor originated request<br>";
      break;
    case "01":
      document.getElementById("errorMeaning").innerHTML += "RES - Local processor responded to request<br>";
      break;
    case "10":
      document.getElementById("errorMeaning").innerHTML += "OBS - Local processor observed error as third party<br>";
      break;
    case "11":
      document.getElementById("errorMeaning").innerHTML += "Generic<br>";
      break;
  }
}
// Function to determine MMM - Memory Error Type.
function mmm(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "MEMORY ERROR TYPE: ";
  // Create var with MMM bits
  var mmmBits = codeBin[9] + codeBin[10] + codeBin[11];

  // Compare bits to determine memory error type
  switch (mmmBits) {
    case "000":
      document.getElementById("errorMeaning").innerHTML += "GEN - Generic undefined request<br>";
      break;
    case "001":
      document.getElementById("errorMeaning").innerHTML += "RD - Memory read error<br>";
      break;
    case "010":
      document.getElementById("errorMeaning").innerHTML += "WR - Memory write error<br>";
      break;
    case "011":
      document.getElementById("errorMeaning").innerHTML += "AC - Address/Command error<br>";
      break;
    case "100":
      document.getElementById("errorMeaning").innerHTML += "MS - Memory Scrubbing error<br>";
      break;
    case "101":
      document.getElementById("errorMeaning").innerHTML += "Reserved<br>";
      break;
    case "110":
      document.getElementById("errorMeaning").innerHTML += "Reserved<br>";
      break;
    case "111":
      document.getElementById("errorMeaning").innerHTML += "Reserved<br>";
      break;
    default:
      document.getElementById("errorMeaning").innerHTML += "ERROR - UNKNOWN MEMORY ERROR TYPE<br>";
      break;
  }
}

// Function to determine CCCC - Memory channel # with the error.
function cccc(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "MEMORY CHANNEL: ";
  // Create var with CCCC bits
  var ccccBits = codeBin[12] + codeBin[13] + codeBin[14] + codeBin[15];

  // Check for unspecified channel
  if (ccccBits=="1111") document.getElementById("errorMeaning").innerHTML += "Channel not specified<br>";
  else {
    // Convert channel # from binary to decimal
    var channel = parseInt(ccccBits, 2);

    // Display memory channel #
    document.getElementById("errorMeaning").innerHTML += channel + " (decimal)<br>";
  }
}

// Function to determine II - (Memory or I/O) Bits
function ii(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "TRANSACTION TYPE: ";
  // Check II (Memory or I/O) Bits
  // Create var with II bits
  var iiBits =codeBin[12] + codeBin[13];
  switch (iiBits) {
    case "00":
      document.getElementById("errorMeaning").innerHTML += "M - Memory Access<br>";
      break;
    case "01":
      document.getElementById("errorMeaning").innerHTML += "IO - I/O<br>";
      break;
    case "10":
      document.getElementById("errorMeaning").innerHTML += "Reserved<br>";
      break;
    case "11":
      document.getElementById("errorMeaning").innerHTML += "Other transaction<br>";
      break;
  }
}
// Function to determine RRRR - Indicates type of action associated with the error.
function rrrr(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "ACTION TYPE: ";
  // Create var with RRRR bits
  var rrrrBits = codeBin[8] + codeBin[9] + codeBin[10] + codeBin[11];

  // Compare bits to determine action type
  switch (rrrrBits) {
    case "0000":
      document.getElementById("errorMeaning").innerHTML += "Generic Error - ERR<br>";
      break;
    case "0001":
      document.getElementById("errorMeaning").innerHTML += "Generic Read - RD<br>";
      break;
    case "0010":
      document.getElementById("errorMeaning").innerHTML += "Generic Write - WR<br>";
      break;
    case "0011":
      document.getElementById("errorMeaning").innerHTML += "Data Read - DRD<br>";
      break;
    case "0100":
      document.getElementById("errorMeaning").innerHTML += "Data Write - DWR<br>";
      break;
    case "0101":
      document.getElementById("errorMeaning").innerHTML += "Instruction Fetch - IRD<br>";
      break;
    case "0110":
      document.getElementById("errorMeaning").innerHTML += "Prefetch - PREFETCH<br>";
      break;
    case "0111":
      document.getElementById("errorMeaning").innerHTML += "Eviction - EVICT<br>";
      break;
    case "1000":
      document.getElementById("errorMeaning").innerHTML += "Snoop - SNOOP<br>";
      break;
    default:
      document.getElementById("errorMeaning").innerHTML += "ERROR - UNKNOWN ACTION TYPE<br>";
      break;
  }
}

// Function to determine Transaction Type (TT)
function tt(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "TRANSACTION TYPE: ";
  // Create var with TT bits
  var ttBits =codeBin[12] + codeBin[13];
  switch (ttBits) {
    case "00":
      document.getElementById("errorMeaning").innerHTML += "Instruction<br>";
      break;
    case "01":
      document.getElementById("errorMeaning").innerHTML += "Data<br>";
      break;
    case "10":
      document.getElementById("errorMeaning").innerHTML += "Generic<br>";
      break;
    case "11":
      document.getElementById("errorMeaning").innerHTML += "ERROR<br>";
      break;
  }
}

// Function to determine Level in Memory Where the Error Occurred (LL)
function ll(codeBin) {
  document.getElementById("errorMeaning").innerHTML += "MEMORY LEVEL: ";
  // Create var with LL bits
  var llBits =codeBin[14] + codeBin[15];
  switch (llBits) {
    case "00":
      document.getElementById("errorMeaning").innerHTML += "Level 0 - L0<br>";
      break;
    case "01":
      document.getElementById("errorMeaning").innerHTML += "Level 1 - L1<br>";
      break;
    case "10":
      document.getElementById("errorMeaning").innerHTML += "Level 2 - L2<br>";
      break;
    case "11":
      document.getElementById("errorMeaning").innerHTML += "Generic – LG (It is shown only when processor cannot determine the hierarchy level)<br>";
      break;
  }
}

// Function to convert a base 16 Hex number to a base 2 binary number
function hex2bin(hex){

  // Build string with leading zeros if any
  var zeroString = "";
  for(var i = 0; i < hex.length; i++) {
    if(hex[i]=="0"){
      zeroString += '0000';
    }
    else break
  };

  // Return full status code in binary
  return (zeroString + parseInt(hex, 16).toString(2)).padStart(16, '0');
}


// Function to check if error is unclassified.
function unclassified(codeBin) {
  for (var i=0; i < codeBin.length; i++) {
    if(i<5 && codeBin[i] != "0" ) return false;
    else if (i==5 && codeBin[i] != "1" ) return false;
    else if (i>5 && codeBin[i] == "1") return true;
  }
  return false
}
