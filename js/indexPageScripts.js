$("#submitN").click(function () {
  let number = parseInt($("#numberN").val());
  if (Number.isInteger(number)) {
    let prim = findPrimitive(number);
    $("#nOutput").text(
      "Smallest primitive root of " +
        number +
        " is " +
        (prim != -1 ? prim : "none")
    );
  } else {
    alert("Input is not a correct number");
  }
});
