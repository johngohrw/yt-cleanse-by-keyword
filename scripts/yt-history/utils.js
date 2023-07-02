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
        callback()();
      }
    }
  }, 500);
};

export const inputIDs = [
  "ytcbk-search-input",
  "ytcbk-search-button",
  "ytcbk-status-dot",
  "ytcbk-status-text",
];

export const states = {
  INITIAL_LOAD: {
    status_text: "loading...",
    inputs_disabled: true,
    show_additional_status: false,
  },
  VIDEO_FETCH: {
    status_text: "fetching all videos...",
    inputs_disabled: true,
    show_additional_status: false,
  },
  READY: {
    status_text: "ready to search",
    inputs_disabled: false,
    show_additional_status: false,
  },
  CLEANSING: {
    status_text: "cleansing in progress...",
    inputs_disabled: true,
    show_additional_status: true,
  },
  POST_CLEANSE: {
    status_text: "cleansing finished!",
    inputs_disabled: false,
    show_additional_status: false,
  },
};

export const setState = (stateID) => {
  const { status_text, inputs_disabled, show_additional_status } =
    states[stateID];
  setInputsDisabled(inputIDs, inputs_disabled);
  document.getElementById("ytcbk-status-text").textContent = status_text;
  if (show_additional_status) {
    document.getElementById("ytcbk-status-additional").classList.add("shown");
  } else {
    document
      .getElementById("ytcbk-status-additional")
      .classList.remove("shown");
  }
};

// reserved fields. the rest is spread to attributes.
const reservedKeys = ["tag", "children", "textContent", "bind"];
export const buildElement = (struct) => {
  // switch to typescript please
  if (!struct?.tag) {
    console.error("struct", struct, "has no tag");
    return null;
  }
  let el = document.createElement(struct.tag);

  // process textcontent
  if (Object.prototype.hasOwnProperty.call(struct, "textContent")) {
    el.textContent = struct.textContent;
  }

  // process children
  if (Object.prototype.hasOwnProperty.call(struct, "children")) {
    Object.entries(struct.children).forEach(([_name, _struct]) => {
      let _el = buildElement(_struct);
      _el.setAttribute("name", _name);
      el.appendChild(_el);
    });
  }

  // bind events
  if (Object.prototype.hasOwnProperty.call(struct, "bind")) {
    el.addEventListener(struct.bind.on, struct.bind.event);
  }

  // spreading other values as attributes
  Object.entries(struct)
    .filter(([key, _]) => !reservedKeys.includes(key))
    .forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  return el;
};

export function deletionChecker(ms = 1000) {
  return new Promise((resolve) => {
    const checker = setInterval(() => {
      let checkResults = document.querySelectorAll(
        '[jsaction="click:.CLIENT"]'
      );
      if (checkResults.length > 0) {
        let filtered = Array.from(checkResults).filter((o) =>
          o.innerText.includes("item deleted")
        );
        if (filtered.length > 0) {
          let toastEl = filtered[0];
          toastEl.remove();
          resolve(clearInterval(checker));
        }
      }
    }, ms);
  });
}
