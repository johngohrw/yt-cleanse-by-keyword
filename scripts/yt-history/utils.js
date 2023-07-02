export const setInputsDisabled = (inputIDs, disabled) => {
  inputIDs.forEach((id) => {
    if (disabled) {
      document.getElementById(id).setAttribute("disabled", "");
      document.getElementById(id).classList.add("disabled");
    } else {
      document.getElementById(id).removeAttribute("disabled");
      document.getElementById(id).classList.remove("disabled");
    }
  });
};

export const startLoadingMore = (callback) => {
  let count = 0;
  const modulo = 2;
  const loadMoreClicker = setInterval(() => {
    Array.from(document.querySelectorAll("button"))
      .filter((el) => el.innerText === "Load more")[0]
      .click();

    if (count % modulo === 0) {
      let idx = document.body.innerText.indexOf(
        "Looks like you've reached the end"
      );
      if (idx >= 0) {
        clearInterval(loadMoreClicker);
        console.log("done loading all videos!");
        callback()();
      }
    }
  }, 500);
};
