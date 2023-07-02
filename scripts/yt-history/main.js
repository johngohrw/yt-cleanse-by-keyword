import { setInputsDisabled, startLoadingMore } from "./utils.js";

const inputIDs = [
  "ytcbk-search-input",
  "ytcbk-search-button",
  "ytcbk-status-dot",
  "ytcbk-status-text",
];

const states = {
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

const setState = (stateID) => {
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

const panelStyleContent = /*css*/ `
  :root {
    --panel-bg-color: #222940;
    --panel-border-color: #5e6366;
  }
  .ytcbk-panel {
    background: var(--panel-bg-color);
    border: 1px solid var(--panel-border-color);
    border-radius: 4px;    
    z-index: 1000;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    color: white;
    width: 320px;
  }
  

  .ytbck-title { 
    font-size: 1rem; 
    margin: 0;
  }

  .ytbck-midsection {
    padding: .5rem 0;
  }

  .ytbck-search-field {
    display: flex;
    flex-flow: row nowrap;
  }

  #ytcbk-status-dot {
    width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    background: green;
    margin-right: .5rem
  }

  #ytcbk-status-dot.disabled {
    background: orange;
    animation: blink 1s infinite;  
  }

  #ytcbk-status-additional {
    display: none
  }
  #ytcbk-status-additional.shown {
    display: block
  }
  #ytcbk-status-text-additional {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 11px;
    color: grey;
  }
  
  
  @keyframes blink {
    from {
      opacity: 1
    }
  
    50% {
      opacity: 0.2
    }
  
    to {
      opacity: 1
    }
  }
`;

const onVideoFetchFinish = () => {
  setState("READY");
};

function deletionChecker(ms = 1000) {
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

const handleSearch = async (e) => {
  const inputVal = document.getElementById("ytcbk-search-input").value;
  if (inputVal.length < 1) {
    alert("please enter a keyword");
    return;
  }
  setState("CLEANSING");

  // start clickin on those x-es
  let query = inputVal.toLowerCase();
  let list = document.querySelectorAll(
    '[aria-label="Card showing an activity from YouTube"]'
  );

  let filtered = Array.from(list).filter((item) =>
    item
      .querySelector("button")
      .getAttribute("aria-label")
      .toLowerCase()
      .includes(query)
  );
  let i = 0;
  while (i < filtered.length) {
    let cardEl = filtered[i];
    let button = cardEl.querySelector("button");
    let string = button.getAttribute("aria-label").toLowerCase();
    if (string.includes(query)) {
      let split = string.split("delete activity item ");
      document.getElementById("ytcbk-status-text-additional").textContent =
        split[split.length - 1];
      document.getElementById("ytcbk-status-text").textContent = `cleansing ${
        i + 1
      } out of ${filtered.length}`;
      button.click();
      await deletionChecker(300);
    }
    i++;
  }
  setState("POST_CLEANSE");
};

const panelStruct = {
  tag: "div",
  class: "ytcbk-panel",
  children: {
    style: {
      tag: "style",
      textContent: panelStyleContent,
    },
    topPart: {
      tag: "div",
      // style: "border: 1px solid black;",
      children: {
        title: {
          tag: "h1",
          textContent: "YouTube Cleanse By Keyword",
          class: "ytbck-title",
        },
      },
    },
    midSection: {
      tag: "div",
      class: "ytbck-midsection",
      children: {
        searchField: {
          tag: "div",
          class: "ytbck-search-field",
          children: {
            searchInput: {
              tag: "input",
              placeholder: "comma-separated keywords",
              style: `
                width: 100%;
                min-width: 200px;
                margin-right: .5rem;
              `,
              id: "ytcbk-search-input",
            },
            searchSubmit: {
              tag: "button",
              textContent: "Cleanse",
              style: "",
              id: "ytcbk-search-button",
              bind: {
                on: "click",
                event: handleSearch,
              },
            },
          },
        },
        statusBar: {
          tag: "div",
          style: "display: flex; align-items: center; margin: .5rem 0",
          id: "ytcbk-status",
          children: {
            statusDot: {
              tag: "div",
              disabled: "true",
              id: "ytcbk-status-dot",
            },
            statusText: {
              tag: "div",
              id: "ytcbk-status-text",
              style: "font-size: 11px",
              textContent: "loading...",
            },
          },
        },
        statusBarDeletionStatus: {
          tag: "div",
          style: "align-items: center; margin: .5rem 0 0",
          id: "ytcbk-status-additional",
          children: {
            statusText: {
              tag: "div",
              id: "ytcbk-status-text-additional",
              style: "font-size: 11px",
              textContent: "additional",
            },
          },
        },
      },
    },
  },
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

const panel = buildElement(panelStruct);
const waitForBuildCompletion = setInterval(() => {
  if (panel) {
    console.log("panel has done building!");
    document.body.appendChild(panel);
    setState("VIDEO_FETCH");
    startLoadingMore(() => onVideoFetchFinish);
    clearInterval(waitForBuildCompletion);
  } else {
    console.log("building panel...");
  }
}, 500);

// Array.from(document.querySelectorAll("button")).filter(el => el.innerText === "Load more")

// Array.from(document.querySelectorAll("div")).filter(el => el.innerHTML === "Looks like you've reached the end")
