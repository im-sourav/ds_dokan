import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { get, getDatabase, ref } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";



goHome.on("click", () => {
  loginWindow.classList.toggle("active", false);
})
loginBtn.on("click", () => {
  loginWindow.classList.toggle("active", true);
})
let user = undefined;

const auth = getAuth();
// auth.signOut()
onAuthStateChanged(auth, (usr) => {
  if (usr) {
    const uid = usr.uid;
    user = usr;
    console.log("user");
  } else {
    console.log("no user");
  }
});

try {
  const dtls = JSON.parse(getCookie("DREAMOVA-SUPPLIERS-STORAGE"));
  myStatus = dtls;
  const db = getDatabase();
  const dbRef = ref(db, "datas");

  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const datas = snapshot.val();
      groups = datas.groups;
      historyLogs = datas.historyLogs;
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    // location.reload();
  });

} catch (err) {
  console.log(err);
}

console.log(myStatus);

// alert ids 
const alertWindow = I("alert-window");
const addContentWindow = I("add-content-window");
// const closeArt = I("close-art");
// const alertMessage = I("alert-message");
// const alertNo = I("alert-no");
// const alertYes = I("alert-yes");


// closeArt.on("click", () => {
//   alertWindow.classList.toggle("active", false);
// })
// alertNo.on("click", () => {
//   alertWindow.classList.toggle("active", false);
// })


// header ids
const menuOpenBtn = I("open-menu");
const menuWindow = I("menu-window");
const allGroups = I("all-groups");
const editGroup = I("edit-group");
const addNewGroupBtn = I("add-new-group");
const header = I("header");
const searchBar = I("search-bar");
const searchInput = I("search-input");

// found list ids
const foundItems = I("found-items");
const findWindow = I("find-window");
const backFWindow = I("back-f-window");

// Menu lest ids
const openHome = I("open-home")
const openGroups = I("open-groups")
const openHistorys = I("open-historys")
const openMembers = I("open-members")
const logoutWindow = I("logout-window")

// home ids
const homeWindow = I("home-window")

// Groups window ids
const groupSection = I("group-section");

// Items window ids
const insideGroupWindow = I("inside-group-window");
const itemGroupTitle = I("item-group-title");
const itemBackBtn = I("item-back-btn");
const addNewItem = I("add-new-item");
const editItem = I("edit-item");
const itemsSection = I("items-section");


// Member window ids
const memberWindow = I("member-window");
const addMember = I("add-member");
const allMembers = I("all-members");


// Histrys window ids
const historyWindow = I("history-window");
const preMonth = I("pre-month");
const postMonth = I("post-month");
const showMonth = I("show-month");
const showHistory = I("show-history");

let currentGroup = 0;
let _d = new Date;
let dates = {
  year: _d.getFullYear(),
  month: _d.getMonth()
}
let css = {
  menuW: 150
}


//  resize windwo 
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
const root = document.querySelector(":root");
root.style.setProperty("--winWidth", `${winWidth}px`);
root.style.setProperty("--winHeight", `${winHeight}px`);

window.addEventListener("resize", (e) => {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  root.style.setProperty("--winWidth", `${winWidth}px`);
  root.style.setProperty("--winHeight", `${winHeight}px`);
});

// hide all active window 
function hideWindow() {
  const all = [findWindow, homeWindow, groupSection, insideGroupWindow, memberWindow, historyWindow];
  all.forEach(a => {
    a.classList.remove("active");
  })
}

// push log array 
function logPush(mod, type, name) {
  let nDate = new Date;
  let mm = nDate.getMonth() + 1;
  let nmm = mm > 9 ? mm : `0${mm}`;
  let dt = `${nDate.getFullYear()}-${nmm}`;
  if (!historyLogs[dt]) {
    historyLogs[dt] = [];
  }
  historyLogs[dt].push({
    username: myStatus.username,
    time: getFormatTime(),
    mod: mod,
    type: type,
    name: name
  })
}

const createAlertBox = (message, yesObj, noObj, fun) => {
  console.log(yesObj, noObj);
  alertWindow.innerHTML = "";
  alertWindow.classList.toggle("active", true);
  const artBox = createEle("div", "alert-box", alertWindow);
  const artTitle = createEle("div", "alert-title", artBox);
  const spn = createEle("span", null, artTitle, `<i class="sb-alert"></i> Alert`);
  const i = createEle("i", "sb-close", artTitle);
  const artMsg = createEle("div", "alert-message", artBox, message);
  const artBtns = createEle("div", "a-btns", artBox);
  const p2 = createEle("p", "alert-no", artBtns, `<i class="sb-${noObj.cn}"></i>${noObj.nm}`);
  const p1 = createEle("p", "alert-yes", artBtns, `<i class="sb-${yesObj.cn}"></i>${yesObj.nm}`);

  const close = () => alertWindow.classList.toggle("active", false);
  p1.addEventListener("click", () => {
    fun();
    close();
  });
  p2.addEventListener("click", close);
  i.addEventListener("click", close);
  return p1;
}

function createAddDoc(titel, placeholderName, fun, done = "add") {
  addContentWindow.innerHTML = "";

  const abt = createEle("div", "add-box-tab", addContentWindow);
  const cgt = createEle("div", "create-group-title", abt);
  createEle("p", null, cgt, titel);
  const close = createEle("i", "sb-close", cgt);
  const span = createEle("span", null, abt);
  const inp = createEle("input", "name-input-group", span);
  inp.setAttribute("type", "text");
  inp.setAttribute("placeholder", placeholderName);
  const inline = createEle("div", "inline", abt);
  const add = createEle("div", "group-add-btn", inline, done);
  const cancle = createEle("div", "inline", inline, "cancle");

  const closeWin = () => addContentWindow.classList.toggle("active", false);
  close.on("click", closeWin);
  cancle.on("click", closeWin);

  add.on("click", () => {
    if (inp.value.length < 1) return;
    fun(inp.value, closeWin);
  })
}

let searchValue = "";
// search event
searchInput.on("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  const isBig = searchValue.length > 0;
  findWindow.classList.toggle("active", isBig)
  setupFoundItems();
});

// items append found window
function setupFoundItems() {
  foundItems.innerHTML = "";
  groups.forEach((group) => {
    group.items.forEach((item) => {
      item.name.toLowerCase().includes(searchValue) && setItem(group, item, foundItems);
    })
  })
}

backFWindow.on("click", () => {
  findWindow.classList.remove("active");
})

// header events 
searchInput.on("click", () => {
  header.classList.add("active");
})

searchInput.on("focusout", () => {
  searchInput.value = "";
  header.classList.remove("active");
})

/* -------- menu event -------- */
openHome.on("click", () => {
  hideWindow();
  homeWindow.classList.add("active")
  menuWindow.classList.remove("active")
})

I("close-menuz").on("click", () => {
  menuWindow.classList.remove("active")
})

menuOpenBtn.on("click", () => {
  menuWindow.classList.add("active")
})

openGroups.on("click", () => {
  hideWindow();
  setup();
  tuggle(groupSection);
  menuWindow.classList.remove("active")
})

openHistorys.on("click", () => {
  hideWindow();
  setupHistory();
  tuggle(historyWindow);
  menuWindow.classList.remove("active")
})

openMembers.on("click", () => {
  hideWindow();
  memberSetup();
  tuggle(memberWindow);
  menuWindow.classList.remove("active")
})



// groups events
function addGroup(data) {
  const grp = createEle("div", "group", allGroups);

  const ctn = createEle("div", "content", grp);
  const gName = createEle("div", "group-name", ctn, `<i class="sb-drawer"></i> ${data.name}`);
  const itm = createEle("div", "items", ctn, `<i class="sb-tags"></i> Items ${data.items.length}`);

  const edcnt = createEle("div", "editable-content", grp);
  const dlt = createEle("div", "group-delete-btn", edcnt, `<i class="sb-trash-1"></i> DELETE`);
  const grin = createEle("div", "group-input", edcnt);
  const inp = createEle("input", null, grin);
  inp.setAttribute("spellcheck", false);
  inp.setAttribute("type", "text");
  inp.value = data.name;
  inp.setAttribute("placeholder", "Group Name");
  const upd = createEle("div", "group-update", edcnt, `<i class="sb-back-to-top"></i> RENAME`);

  inp.addEventListener("click", () => {
    inp.select();
  })

  upd.on("click", () => {
    groups.forEach((g, i) => {
      if (g.id === data.id && inp.value !== g.name && inp.value.length > 0) {
        let oldNm = groups[i].name;
        createAlertBox(`Do you want to modify "${oldNm}" group to "${inp.value}"?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, () => {
          groups[i].name = inp.value;
          setup();
          tuggle(allGroups, "edit");
          logPush("modify", "group", `${oldNm} to ${inp.value}`);
          alertWindow.classList.toggle("active", false);
          console.log("update");
        });
      }
    })
  })

  dlt.on("click", () => {
    groups.forEach((g, i) => {
      if (g.id === data.id) {
        let groupNm = groups[i].name;

        createAlertBox(`Do you want to delete "${groupNm}" group?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, () => {
          groups = remove(groups, i);
          setup();
          tuggle(allGroups, "edit");
          logPush("delete", `group`, groupNm);
          alertWindow.classList.toggle("active", false);
          console.log("delete");
        });
      }
    })
  })

  ctn.on("click", () => {
    groups.forEach((gr, i) => {
      if (data === gr) {
        currentGroup = i;
      }
    })
    itemSetup(data);
    tuggle(insideGroupWindow);
  })
}

function itemSetup(data) {
  itemsSection.innerHTML = "";
  data.items.forEach((item, i) => {
    setItem(data, item);
  })
}

function setup() {
  allGroups.innerHTML = "";
  groups.forEach((group) => {
    addGroup(group);
  })
}

function setItem(data, item, parent = itemsSection) {
  if (parent === itemsSection) itemGroupTitle.innerHTML = `<i class="sb-drawer"></i> ${data.name}`;
  const itm = createEle("div", "item", parent);
  const aclCnt = createEle("div", "actiol-item", itm);
  const incnt = createEle("div", "in-content", aclCnt)
  const itmNm = createEle("div", "item-name", incnt, `<i class="sb-tag"></i> ${item.name}`);
  const itmQnt = createEle("div", "item-quantity", incnt, `Quantity: <x class="qun-num" >${item.quantity}</x>`);
  const spn = createEle("span", null, aclCnt);

  const qunInp = createEle("div", "quantity-input-fild", spn);
  const mins = createEle("div", "mins-1", qunInp, `<i></i>`);
  const _input_ = createEle("div", "_input_", qunInp);
  const it = createEle("input", null, _input_);
  it.setAttribute("spellcheck", false);
  it.setAttribute("type", "number");
  it.setAttribute("value", "0");
  const pls = createEle("div", "plus-1", qunInp, `<i></i>`);

  const itmUpdBtn = createEle("div", "item-update-btn", spn);
  const itmOut = createEle("div", "item-out", itmUpdBtn, `<p><i class="sb-box-remove"></i> OUT</p>`);
  const itmIn = createEle("div", "item-in", itmUpdBtn, `<p><i class="sb-box-add"></i> IN</p>`);

  if (parent === itemsSection) {
    const edtItm = createEle("div", "editable-items", itm);
    const dlt = createEle("div", "item-delete-btn", edtItm, `<i class="sb-trash-1"></i> DELETE`);
    const _inp = createEle("div", "item-input", edtItm);
    const iInp = createEle("input", null, _inp);
    iInp.setAttribute("spellcheck", false);
    iInp.setAttribute("type", "text");
    iInp.setAttribute("value", item.name);
    iInp.setAttribute("placeholder", `Item Name`);
    const updt = createEle("div", "item-update", edtItm, `<i class="sb-back-to-top"></i> RENAME`);

    updt.on("click", () => {
      groups[currentGroup].items.forEach((im, i) => {
        if (im.id === item.id && iInp.value !== im.name && iInp.value.length > 0) {
          let oldNm = groups[currentGroup].items[i].name;
          createAlertBox(`Do you want to modify "${oldNm}" item name to "${iInp.value}"?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, () => {
            groups[currentGroup].items[i].name = iInp.value;
            itemSetup(groups[currentGroup]);
            tuggle(itemsSection);
            logPush(
              "modify",
              `item`,
              `${oldNm} to ${groups[currentGroup].items[i].name}`
            )
          });
        }
      })
    })

    dlt.on("click", () => {
      groups[currentGroup].items.forEach((im, i) => {
        if (im.id === item.id) {
          let itmNm = groups[currentGroup].items[i].name;
          createAlertBox(`Do you want to delete "${itmNm}" item?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, () => {
            groups[currentGroup].items = remove(groups[currentGroup].items, i);
            itemSetup(groups[currentGroup]);
            tuggle(itemsSection);
            logPush("delete", "item", itmNm);
          });
        }
      })
    })
  }

  // when hold the plus button then incrige max quentity
  let mouseTimer;
  function mouseDown() {
    mouseUp();
    mouseTimer = window.setTimeout(execMouseDown, 500);
  }
  function mouseUp() {
    if (mouseTimer) window.clearTimeout(mouseTimer);
  }
  function execMouseDown() {
    if (item.quantity)
      it.value = Number(item.quantity - 1);
  }
  pls.addEventListener("mousedown", mouseDown);
  document.body.addEventListener("mouseup", mouseUp);
  pls.addEventListener("touchstart", mouseDown);
  document.body.addEventListener("touchend", mouseUp);


  it.addEventListener("input", () => {
    let intV = Number(it.value);
    it.value = intV;
    if (intV >= 100000) {
      it.value = 100000;
    } else if (intV <= 0) {
      it.value = 0;
    }
  });
  pls.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV < 100000) {
      it.value = ++intV;
    }
  });
  mins.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV > 0) {
      it.value = --intV;
    }
  });

  itmIn.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV >= 1) {
      groups[currentGroup].items.forEach((im, i) => {
        if (im.id === item.id) {
          let oldQ = Number(im.quantity);
          groups[currentGroup].items[i].quantity = Number(im.quantity) + intV;
          if (parent === itemsSection) {
            itemSetup(groups[currentGroup]);
          } else {
            setupFoundItems();
          }
          logPush(
            "update",
            `item`,
            `${groups[currentGroup].items[i].name} quantity <x class="c-feb">${oldQ}</x> to <x class="c-feb">${groups[currentGroup].items[i].quantity}</x>`
          )
        }
      })
    }
  })

  itmOut.addEventListener("click", () => {
    let intV = Number(it.value);
    if (intV >= 1 && Number(item.quantity) >= intV) {
      groups[currentGroup].items.forEach((im, i) => {
        if (im.id === item.id) {
          let oldQ = Number(im.quantity);
          groups[currentGroup].items[i].quantity = Number(im.quantity) - intV;
          if (parent === itemsSection) {
            itemSetup(groups[currentGroup]);
          } else {
            setupFoundItems();
          }
          logPush(
            "update",
            `item`,
            `${groups[currentGroup].items[i].name} quantity <x class="c-feb">${oldQ}</x> to <x class="c-feb">${groups[currentGroup].items[i].quantity}</x>`
          )
        }
      })
    }
  })
  return itm;
}

itemBackBtn.on("click", () => {
  setup();
  tuggle(insideGroupWindow);
});

editItem.on("click", () => {
  tuggle(itemsSection);
});

addNewItem.on("click", () => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Item", "Item Name", (e, fun) => {
    const is = groups[currentGroup].items.some(val => val.name == e);
    if (!is) {
      groups[currentGroup].items.push({
        name: e,
        id: Date.now(),
        quantity: 0
      });
      logPush("create", "item", e);
      itemSetup(groups[currentGroup]);
      fun();
    };
  });
});

editGroup.on("click", () => {
  tuggle(allGroups, "edit");
});

addNewGroupBtn.on("click", () => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New Group", "Group Name", (e, fun) => {
    const is = groups.some(val => val.name == e);
    if (!is) {
      groups.push({
        name: e,
        id: Date.now(),
        items: []
      });
      logPush("create", "group", e);
      setup();
      fun();
    }
  })

});


/* --------- members ----------- */
addMember.on("click", () => {
  addContentWindow.classList.toggle("active", true);
  createAddDoc("Create New User", "Enter User Name", (e, fun) => {
    const is = members.some(val => val.username == e);
    if (!is && e.length > 5) {
      members.push({
        username: e,
        uid: Date.now(),
        key: (Date.now() * (Math.floor(Math.random() * 999))).toString(36).toUpperCase()
      })
      logPush("modify", "member", "");
      memberSetup();
      fun();
    }
  })
})

function checkExp(exp) {
  return /^([a-zA-Z0-9\@\_]{6,16})+$/.test(exp);
}

function memberSetup() {
  allMembers.innerHTML = "";
  members.forEach(mem => {
    setMember(mem);
  })
}

function setMember(mem) {
  const mbr = createEle("div", "member", allMembers);
  createEle("div", "m-username", mbr, `<i class="sb-user"></i> <x><p>${mem.username}</p></x>`);
  createEle("div", "m-password", mbr, `<i class="sb-dice"></i> <x><p>${mem.key}</p></x>`);
  const usrE = createEle("div", "m-eidt", mbr, `<i class="sb-pen"></i>`);
  const dlt = createEle("div", "m-delete", mbr, `<i class="sb-user-minus"></i>`);

  usrE.addEventListener("click", () => {
    addContentWindow.classList.toggle("active", true);
    createAddDoc("Create New User", "Enter New User Name", (e, fun) => {
      const is = members.some(val => val.username == e);
      if (!is) {
        members.forEach((m, i) => {
          if (m.uid === mem.uid) {
            members[i].username = e;
          }
        })
        logPush("modify", "member", "");
        memberSetup();
        fun();
      }
    }, "continue");
  });

  dlt.addEventListener("click", () => {
    members.forEach((m, i) => {
      if (m.uid === mem.uid) {
        createAlertBox(`Do you want to delete "${mem.username}" account?`, { cn: "true", nm: "YES" }, { cn: "close", nm: "NO" }, () => {
          members = remove(members, i);
          memberSetup();
          logPush("modify", "member", "");
        });
      }
    })
  })
}

/* -------- Setup History --------- */

preMonth.on("click", () => {
  let yy = dates.year;
  let next = dates.month;
  if (next < 0) {
    --yy;
    next = 11;
  }
  let nm = next > 9 ? next : `0${next}`;
  let dt = `${yy}-${nm}`;
  if (historyLogs[dt]) {
    dates.year = yy;
    dates.month = next - 1;
    setupHistory();
  }
})
postMonth.on("click", () => {
  let yy = dates.year;
  let next = dates.month + 2;
  if (next > 11) {
    ++yy;
    next = 0;
  }
  let nm = next > 9 ? next : `0${next}`;
  let dt = `${yy}-${nm}`;
  if (historyLogs[dt]) {
    dates.year = yy;
    dates.month = next - 1;
    setupHistory();
  }
})
function setupHistory() {
  showHistory.innerHTML = "";
  let mm = dates.month + 1;
  let nmm = mm > 9 ? mm : `0${mm}`;
  let dt = `${dates.year}-${nmm}`;
  showMonth.innerText = dt;

  try {
    for (let i = historyLogs[dt].length - 1; i >= 0; i--) {
      hLog(historyLogs[dt][i]);
    }
  } catch (e) {
    console.log("History is empty! ");
  }
}

function hLog(l) {
  let unm = l.username === myStatus.username ? "you" : l.username;
  let mColor = unm === "you" ? "c-green" : "c-white";
  let isDC = l.mod === "delete" ? "c-red" : "c-white";
  let isx = l.type === "group" ? "c-cor1" : l.type === "item" ? "c-cor2" : mColor;
  const hL = createEle("div", "h-log", showHistory);
  const spn = createEle("span", "h-span", hL);
  createEle("div", "c-white", spn, l.time);
  createEle("div", mColor, spn, unm);
  createEle("div", isDC, spn, l.mod);
  createEle("div", isx, spn, l.type);
  createEle("div", "c-white", spn, l.name);
}