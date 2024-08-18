var intervalId = setInterval(update, 0);

var panels = []

var menus = [] 
var startmenu = false

var mouseX = 0
var mouseY = 0

var oldmouseX = 0
var oldmouseY = 0

selectedwindow = 0
var resizing = false
var startX, startY, startWidth, startHeight

var seldrop

function GetWindow(width,height,id) {
    return `
    <div class="window" id="window${id}" onmouseover="selectwindow(${id})" style="width=${width}}";height="${height}}">
    <div class="topwinbar" id="window${id}header" ondblclick="applications[${id}].togglemaximize()">
        <button style="right: 0; top: 50%;padding-right: 10px;" class="winbutton"><img src=/images/-.png></button>
        <button style="right: 0; top: 50%;padding-right: 10px;" class="winbutton" onclick="applications[${id}].togglemaximize()"><img src=/images/[].png></button>
        <button style="right: 0; top: 50%;padding-right: 10px; background-color: brown;" class="winbutton" onclick="applications[${id}].destroy()"><img src=/images/x.png></button>
    </div>
    
    <div style="background-color: grey; color: black;" class="program">
        <iframe src="http://goof.69.mu" title="Example" width="100%" height="100%"></iframe>
    </div>

    <div class="bottomwinbar">
        <img src="/images/drag.png" id="window${id}drag" draggable="false">
    </div>
    
    </div>
    `
}


function closesel() {
    applications[selectedwindow].destroy()
}

class Panel {
    constructor() {

    }
}

class Application {
    constructor(width,height,id) {
        this.width = width
        this.height = height
        this.id = id
        this.oldX, this.oldY, this.oldWidth, this.oldHeight = 200
        this.maximized = false
        console.log(document.getElementById("applications"))
        document.getElementById("applications").innerHTML += GetWindow(this.width,this.height,this.id)
    }
    togglemaximize() {
        var win = document.getElementById("window"+this.id)
        this.maximized = !this.maximized
        if (this.maximized) {
            this.oldX = win.style.left
            this.oldY = win.style.top
            this.oldWidth = win.style.width
            this.oldHeight = win.style.height
            win.style.transformStyle = "200ms"
            win.style.width = "100%"
            win.style.height = "calc(100% - 45px)"
            win.style.top = "0px"
            win.style.left = "0px"
        } else {
            win.style.left = this.oldX
            win.style.top = this.oldY
            win.style.width = this.oldWidth
            win.style.height = this.oldHeight
        }
    }

    forcemaximizeoff() {
        if (this.maximized) {
            var win = document.getElementById("window"+this.id)
            this.maximized = false
            win.style.left = (mouseX) +"px"
            win.style.top = mouseY+"px"
            win.style.width = this.oldWidth
            win.style.height = this.oldHeight
        }

        
    }

    forcemaximizeon() {
        if (this.maximized) {
            var win = document.getElementById("window"+this.id)
            this.maximized = true
            win.style.width = "100%"
            win.style.height = "calc(100% - 45px)"
            win.style.top = "0px"
            win.style.left = "0px"
        }

        
    }

    maximizeleft() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "calc(100% - 45px)"
        win.style.top = "0px"
        win.style.left = "0px"
    }
    maximizeright() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "calc(100% - 45px)"
        win.style.top = "0%"
        win.style.left = "50%"
    }

    maximizeupright() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "50%"
        win.style.top = "0%"
        win.style.left = "50%"
    }

    maximizeupleft() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "50%"
        win.style.top = "0px"
        win.style.left = "0px"
    }

    maximizedownright() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "50%"
        win.style.top = "50%"
        win.style.left = "50%"
    }

    maximizedownleft() {
        var win = document.getElementById("window"+this.id)
        this.maximized = true
        win.style.width = "50%"
        win.style.height = "50%"
        win.style.top = "50%"
        win.style.left = "0px"
    }
    createwindow() {
        
    }

    destroy() {
        let WindowElement = document.getElementById("window"+this.id)
        WindowElement.parentNode.removeChild(WindowElement)
        applications.pop(this.id)
    }
}
var applications = []
class interactable {
    constructor(object,names,mappings) {
        this.object = object
        this.names = names
        this.mappings = mappings
        this.menu = document.getElementById("contextmenu")
    }

    makemappings() {
        this.menu.innerHTML = ""
        for (var i=0;i<this.names.length;i++) {
            this.menu.innerHTML += "<button onclick='"+this.mappings[i]+"'>"+this.names[i]+"</button><hr>"
        }
    }
    getobject() {
        return this.object
    }
}
document.addEventListener("DOMContentLoaded", function(){
    
    document.getElementById("desktop").style.backgroundImage = "url(/images/wallpaper2.png)"
    document.getElementById("startmenu").style.display = "none"
    document.getElementById("contextmenu").style.display = "none"
    menus[0] = new interactable(document.getElementById("desktop"),["new file","new folder","start"],["newfile()","newfolder()","togglestart()"])
    menus[1] = new interactable(document.getElementById("applications"),["select","copy","paste","close"],["select()","copy()","paste()","closesel()"])
    document.getElementById("contextmenu").addEventListener('mouseleave', function() {
        
    });
    document.addEventListener('click', function(event) {
        var contextmenu = document.getElementById("contextmenu");
        var startmenu2 = document.getElementById("startmenu");
        if (!contextmenu.contains(event.target)) {
          contextmenu.style.display = "none"
        }
    });
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    document.getElementById("contextmenu").style.display = "block"
    document.getElementById("contextmenu").style.left = mouseX +"px"
    document.getElementById("contextmenu").style.top = (mouseY-125) +"px"
    for (var i = 0;i<menus.length;i++) {
        if (menus[i].getobject().contains(event.target)) {
            menus[i].makemappings()
            break
        }
    }
});

document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function makeapp(width,height) {
    applications[applications.length] = new Application(width,height,applications.length)
}

function update() {
}

function togglestart() {
    startmenu = !startmenu
    document.getElementById("startmenu").style.display = startmenu ? "block" : "none"
}

function selectwindow(win) {
    selectedwindow = win
    dragElement("window"+selectedwindow)
    document.getElementById("window"+selectedwindow).style.zIndex = "10"
    for (var i=0;i<applications.length;i++) {
        if (i != selectedwindow) {
            document.getElementById("window"+i).style.zIndex = "1"
        }
    }
}





document.addEventListener('mousedown', function(event) {
    if (event.target.id === "window"+selectedwindow+"drag") {
      resizing = true;
      startX = event.clientX;
      startY = event.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(document.getElementById("window"+selectedwindow)).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(document.getElementById("window"+selectedwindow)).height, 10);
      
    }
  });
  
  document.addEventListener('mousemove', function(event) {
    if (resizing) {
        
      var deltaX = event.clientX - startX;
      var deltaY = event.clientY - startY;
      document.getElementById("window"+selectedwindow).style.width = (startWidth + deltaX) + 'px';
      document.getElementById("window"+selectedwindow).style.height = (startHeight + deltaY) + 'px';
      height = parseInt(document.getElementById("window"+selectedwindow).style.height.slice(0,-2))
      width = parseInt(document.getElementById("window"+selectedwindow).style.width.slice(0,-2))
      if (height < 200) {
        document.getElementById("window"+selectedwindow).style.height = 200+"px"
      }
      if (width < 200) {
        document.getElementById("window"+selectedwindow).style.width = 200+"px"
      }
    }
  });
  
  document.addEventListener('mouseup', function(event) {
    resizing = false;
  });

function dragElement(elmntname) {
  elmnt = document.getElementById(elmntname)
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmntname + "header")) {
    document.getElementById(elmntname + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    applications[selectedwindow].forcemaximizeoff()
    document.getElementById("dragontop").style.display = "none"
    document.getElementById("dragonleft").style.display = "none"
    document.getElementById("dragonright").style.display = "none"
    if (mouseY <= 0 && mouseX <= 0) {
        document.getElementById("dragonupleft").style.display = "block"
    } else if (mouseY <= 0 && mouseX >= document.body.clientWidth) {
        document.getElementById("dragonupright").style.display = "block"
    
    } else if (mouseY >= window.innerHeight-500 && mouseX <= 0) {
        document.getElementById("dragondownleft").style.display = "block"
    } else if (mouseY >= window.innerHeight-500 && mouseX >= document.body.clientWidth) {
        document.getElementById("dragondownright").style.display = "block"
    } else {
        document.getElementById("dragonupright").style.display = "none"
        document.getElementById("dragonupleft").style.display = "none"
        document.getElementById("dragondownright").style.display = "none"
        document.getElementById("dragondownleft").style.display = "none"
        if (mouseY <= 0) {
            document.getElementById("dragontop").style.display = "block"
        } else if (mouseX <= 0) {
            document.getElementById("dragonleft").style.display = "block"
        } else if (mouseX >= document.body.clientWidth) {
            document.getElementById("dragonright").style.display = "block"
        }
    }









  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.getElementById("dragonleft").style.display = "none"
    document.getElementById("dragontop").style.display = "none"
    document.getElementById("dragonright").style.display = "none"
    document.getElementById("dragonupleft").style.display = "none"
    document.getElementById("dragonupright").style.display = "none"
    document.getElementById("dragondownleft").style.display = "none"
    document.getElementById("dragondownright").style.display = "none"
    if (mouseY <= 0 && mouseX <= 0) {
        applications[selectedwindow].maximizeupleft()
    } else if (mouseY <= 0 && mouseX >= document.body.clientWidth) {
        applications[selectedwindow].maximizeupright()
        
    } else if (mouseY >= window.innerHeight-500 && mouseX <= 0) {
        applications[selectedwindow].maximizedownleft()
    } else if (mouseY >= window.innerHeight-500 && mouseX >= document.body.clientWidth) {
        applications[selectedwindow].maximizedownright()
    } else {

        if (mouseY <= 0) {
            applications[selectedwindow].togglemaximize()
        } else if (mouseX <= 0) {
            applications[selectedwindow].maximizeleft()
        } else if (mouseX >= document.body.clientWidth) {
            applications[selectedwindow].maximizeright()
        }
    }



  }
}


