import { setInputsDisabled, startLoadingMore } from "./utils.js";

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

  #ytcbk-status-text::after {
    content: "ready to search"
  }
  #ytcbk-status-text.disabled::after {
    content: "loading videos..."
  }
  #ytcbk-status-text.disabled.cleansing::after {
    content: "cleansing in progress, please wait..."
  }

  .deleting {
    animation: deleting 1s infinite;
    background: red;
  }

  @keyframes deleting {
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

const inputIDs = [
  "ytcbk-search-input",
  "ytcbk-search-button",
  "ytcbk-status-dot",
  "ytcbk-status-text",
];

const onLoadFinish = () => {
  console.log("LOADFINISH");
  setInputsDisabled(inputIDs, false);
  document.getElementById("ytcbk-status-text").classList.remove("cleansing");
};

function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

function deletionChecker(ms = 1000) {
  return new Promise((resolve) => {
    const checker = setInterval(() => {
      let checkResults = document.querySelectorAll(
        '[jsaction="click:.CLIENT"]'
      );
      console.log("checkresults", checkResults, "ms", ms);
      console.log(checkResults.length);
      if (checkResults.length > 0) {
        let filtered = Array.from(checkResults).filter((o) =>
          o.innerText.includes("item deleted")
        );
        console.log("filterlength", filtered.length);
        if (filtered.length > 0) {
          let toastEl = filtered[0];
          toastEl.remove();
          console.log("deletion confirmed");
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
  setInputsDisabled(inputIDs, true);
  document.getElementById("ytcbk-status-text").classList.add("cleansing");

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
  // console.log("found", filtered.length, "items");
  let i = 0;
  while (i < filtered.length) {
    let cardEl = filtered[i];
    let button = cardEl.querySelector("button");
    let string = button.getAttribute("aria-label").toLowerCase();
    if (string.includes(query)) {
      // console.log("deleting", i + 1, "out of", filtered.length);
      button.click();
      await deletionChecker();
      // console.log("going next..");
    }
    i++;
  }
  console.log("done");

  // let i = 0;
  // while (i < list.length) {
  //   let cardEl = list[i];
  //   let button = cardEl.querySelector("button");
  //   let string = button.getAttribute("aria-label").toLowerCase();
  //   if (string.includes(query)) {
  //     console.log("deleting", cardEl);
  //     button.click();
  //     await deletionChecker();
  //     console.log("going next..");
  //   }
  //   i++;
  // }
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
    // setInputsDisabled(inputIDs, true);
    clearInterval(waitForBuildCompletion);
    startLoadingMore(() => onLoadFinish);
  } else {
    console.log("building panel...");
  }
}, 500);

// Array.from(document.querySelectorAll("button")).filter(el => el.innerText === "Load more")

// Array.from(document.querySelectorAll("div")).filter(el => el.innerHTML === "Looks like you've reached the end")
