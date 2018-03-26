var LinesCount = 1;
var SavedPlayers = 0;
var cleanTextFlag = true;


function Start() {
    var PlayersList = {};
    AddPlayer = function (name, left, right, color) {
        var player = {
            Name: name,
            LeftKey: left,
            RightKey: right,
            Color: color,
        }
        PlayersList[SavedPlayers] = player;
        SavedPlayers++;
    }


    var PlayersList = document.getElementById('PlayersList');
    var items = PlayersList.getElementsByTagName('li');
    for (var i = 0; i < items.length; i++) //each item is anothe player
    {
        if (items[i].childElementCount == 0) break;
        var name = items[i].childNodes[1].value;
        var left = items[i].childNodes[3].value
        var right = items[i].childNodes[5].value


        var color;
        switch (i + 1) {
            case 1:
                color = 'blue';
                break;
            case 2:
                color = 'red';
                break;
            case 3:
                color = 'green';
                break;
            case 4:
                color = 'yellow';
                break;
            case 5:
                color = 'orange';
                break;
            case 6:
                color = 'purple';
                break;
        }

        if (name == "" || left == "" || right == "") {
            alert("there is eampty felds");
            PlayersList = {};
            return;
        } else AddPlayer(name, left, right, color);
    }

    function saveData() {
        var IsOnline=JSON.stringify(false);
        //converts to JSON string the Object
        PlayersList = JSON.stringify(PlayersList);
        var goal = 10 * (LinesCount - 1);;
        goal = JSON.stringify(goal);
        //creates a base-64 encoded ASCII string
        PlayersList = btoa(PlayersList);
        goal = btoa(goal);
        IsOnline=btoa(IsOnline);
        //save the encoded accout to web storage
        localStorage.setItem('_IsOnline',IsOnline);
        localStorage.setItem('_PlayersList', PlayersList);
        localStorage.setItem('_goal', goal);
    }
    saveData();
    location.href = 'game.html';
}

AddLine = function () {
    LinesCount++;
    var list = document.getElementById('PlayersList');
    var item = document.createElement('li');
    item.id = 'Player' + LinesCount;
    item.className = "player" + LinesCount;
    item.innerHTML += "Player Name:  <input type=\"text\" id=\"name\" class=\"player" + LinesCount + "box\"/> Left key: <input type = \"text\" id =\"left\" class=\"player" + LinesCount + "box\" onfocusout=\"onFocusOut(this)\" onfocus=\"onFocus(this)\"/ > Right key: <input type = \"text\" id =\"right\" class=\"player" + LinesCount + "box\" onfocusout=\"onFocusOut(this)\" onfocus=\"onFocus(this)\" />"
    list.appendChild(item);
    if (LinesCount == 6) document.getElementById('addLine').disabled = true;
}

MoveToOnline=function()
{
    location.href = 'online.html';
}

onFocus = function (textBox) {
    textBox.value = 'press desired ' + textBox.id + ' key';
    window.onkeydown = function (key) {
        textBox.value = key.keyCode;
        textBox.blur();
    }

}

onFocusOut = function (textbox) {
    window.onkeydown = {};
    if (textbox.value == 'press desired ' + textbox.id + ' key') {
        alert('Click ket to set');
        textbox.focus();
    }
}