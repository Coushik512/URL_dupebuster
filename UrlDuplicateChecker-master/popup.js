
// function highlight_current(tabs)
// {
//   for(var i=0;i<tabs.length;i++){

//     if(tabs[i].active==true)
//   {
//     const curr_tab_id= tabs[i].id;
//     var tabColor = '#00FFFF'; // Desired tab color

//     var code = 'document.querySelector("title").style.backgroundColor = "' + tabColor + '";';
//     chrome.tabs(curr_tab_id, { code: code });
   
//   }
//   }
// }
  function changeTabColor() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabId = tabs[0].id;
      var tabColor = '#00FFFF'; // Desired tab color
  
      var code = 'document.querySelector("template").style.backgroundColor = "' + tabColor + '";';
      chrome.tabs.insertCSS(tabId, { code: code });
    });
  }
  
//function gets all tabs
function tab_ref(x)
  {
  x.addEventListener("click", async () => {
    chrome.windows.getCurrent({populate: true}, function(window) {
      var tabs = window.tabs;
   

   const template = document.getElementById('li_template');
  
   const elements = new Set();
   console.log(tabs);
   for (const tab of tabs) {
     const element = template.content.firstElementChild.cloneNode(true);
   console.log(element);
     const title = tab.title.split('-')[0].trim();
     console.log(title);
     const pathname = new URL(tab.url).pathname.slice('://'.length);
   console.log(pathname)
     element.querySelector('.title').textContent = title;
     element.querySelector('.pathname').textContent = pathname;
     element.querySelector('a').addEventListener('click', async () => {
       // need to focus window as well as the active tab
       await chrome.tabs.update(tab.id, { active: true });
       await chrome.windows.update(tab.windowId, { focused: true });
     });
     
   
     elements.add(element);
     
   }
changeTabColor();
   document.querySelector('ul').append(...elements);
   organize.addEventListener('click', async () => {
    chrome.windows.getCurrent({populate: true}, function(window)  {
      var tabs = window.tabs;
    const tabIds = tabs.map(({ title }) => title);
    if (tabIds.length) {
      const group =  chrome.tabs.group({ tabIds });
      console.log(group);
       chrome.tabGroups.update(group, { title: tabs.title });
    }
  });
  
});
   
  });
});
  }

//deletes dupes
  var remove_dupe=document.getElementById("remove-all-dupes-btn");

remove_dupe.addEventListener("click", function() {
    chrome.tabs.query({url: "*://*/*"}, function(tabs) {
      var urlMap = {};
      for (var i = 0; i < tabs.length; i++) {
        if (urlMap.hasOwnProperty(tabs[i].url)) {
          chrome.tabs.remove(tabs[i].id);
        } else {
          urlMap[tabs[i].url] = true;
        }
      }
      
    });
  });
  //tab organizing
 var organize=document.getElementById("organize-by-domain-btn");
tab_ref(organize);



  
 