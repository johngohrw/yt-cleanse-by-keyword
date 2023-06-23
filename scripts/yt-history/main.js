const panelStyleContent = `
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
`;

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
          textContent: "YT Cleanse By Keyword",
          style: "font-size: 24px; margin: 0;",
        },
      },
    },
    middlePart: {
      tag: "div",
      style: `
        padding: 1rem 0;
      `,
      children: {
        searchField: {
          tag: "div",
          style: "display: flex; flex-flow: row nowrap;",
          children: {
            searchInput: {
              tag: "input",
              style: `
                width: 100%;
                margin-right: .5rem;
              `,
              id: "ytcbk-search-input",
            },
            searchSubmit: {
              tag: "button",
              textContent: "Cleanse",
              style: "",
            },
          },
        },
      },
    },
  },
};

// reserved fields: tag, children, textContent. the rest is spread to attributes.
const reservedKeys = ["tag", "children", "textContent"];
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
    clearInterval(waitForBuildCompletion);
  } else {
    console.log("building panel...");
  }
}, 20);
