import {
  setInputsDisabled,
  startLoadingMore,
  setState,
  buildElement,
  deletionChecker,
} from "./utils.js";

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
          textContent: "YouTube History Cleanser",
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

const panel = buildElement(panelStruct);
const waitForBuildCompletion = setInterval(() => {
  if (panel) {
    console.log("YTCBK: panel has done building!");
    document.body.appendChild(panel);
    setState("VIDEO_FETCH");
    startLoadingMore(() => onVideoFetchFinish);
    clearInterval(waitForBuildCompletion);
  } else {
    console.log("YTCBK: building panel...");
  }
}, 500);
