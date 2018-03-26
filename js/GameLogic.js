        var ctx = document.getElementById("ctx").getContext("2d");
        var dataBase=firebase.database().ref().child('Rooms');
		ctx.font = '30px Arial';
		var HEIGHT= 700;
		var WIDTH = 700;

		var TurnRate = 5;

		var GameLogic = function (Players,playersCount,goal) 
        {

		    var self = {
                PlayersCount:playersCount,
                NumberOfActivePlayers:playersCount,
                Goal:goal,
		        
                StepsCount: 0,
		        StepOverCount: 0,
		    }
            
            self.PlayersList={};
            self.PlayersList=Players;
            
		    self.refreshIntervalId;
		    self.CounDownIntervalRef;
            

		    self.DecreesNumberOfActivePlayers = function () 
            {
		        self.NumberOfActivePlayers--;
		        if (self.NumberOfActivePlayers == 1) {
		            //clearInterval(refreshIntervalId);
		            self.StartNewRound();
		        }
		    }

		    self.StartNewRound = function () 
            {
		        ctx.clearRect(0, 0, WIDTH, HEIGHT);

		        for (var key in self.PlayersList) {
		            self.PlayersList[key].IsActive = true;
		            self.PlayersList[key].PosX = getRandomStartX();
		            self.PlayersList[key].PosY = getRandomStartY();
		            self.PlayersList[key].Angle = getRandomStartAngle();
		        }
		        self.NumberOfActivePlayers = self.PlayersCount;

		        for (var i = 0; i < 10; i++) {
		            self.update();
		        }
		        clearInterval(self.refreshIntervalId);
		        self.CounDownIntervalRef = setInterval(self.CountDown, 1000)
		    }
            
            self.countDown = 3;
            self.CountDown = function () 
            {
                ctx.clearRect((WIDTH / 2) - 30, (HEIGHT / 2) - 30, (WIDTH / 2) + 30, (HEIGHT / 2) + 30);
                ctx.fillStyle = 'white';
                ctx.fillText(self.countDown, (HEIGHT / 2) - 1, (WIDTH / 2) - 1, 20);
                ctx.fillStyle = 'black';
                self.countDown--;
                if (self.countDown == -1) 
                {
                    self.countDown = 3;
                    ctx.clearRect((WIDTH / 2) - 30, (HEIGHT / 2) - 30, (WIDTH / 2) + 30, (HEIGHT / 2) + 30);
                    clearInterval(self.CounDownIntervalRef);
                    clearInterval(self.refreshIntervalId);
                    self.refreshIntervalId = setInterval(self.update, 20)
                }
            } 
            
            
             document.onkeydown = function (event) {
                 
                 for (var key in self.PlayersList) 
                 {
                     if (event.keyCode == self.PlayersList[key].KeyLeft)
                     {
                         self.PlayersList[key].Angle -= TurnRate;
                     } 
                     else if (event.keyCode == self.PlayersList[key].KeyRight) 
                     {
                         self.PlayersList[key].Angle += TurnRate;
                     }
                 }
             }
             
            
            self.update = function () {
                self.StepsCount++;
                for (var key in self.PlayersList) 
                {
                    self.PlayersList[key].update();

                    if (self.StepOverCount == 0 && Math.floor(Math.random() * 300 + 1) == 1) self.StepOverCount = Math.floor(Math.random() * 10 + 5);
                    if (self.StepOverCount > 0) 
                    {
                        self.StepOverCount--;
                        self.stepOver();
                    } 
                    else self.PlayersList[key].draw();
                }
            }
            
            self.stepOver = function () 
            {
		        ctx.fillStyle = 'white';
		        ctx.beginPath();
		        ctx.arc(self.PosX, self.PosY, self.Radios, 0, 2 * Math.PI);
		        ctx.fill();
		    }
            
            self.EndGame = function () {
                clearInterval(self.refreshIntervalId);
                clearInterval(self.CounDownIntervalRef);
            }
            
            self.Start=function()
            {
                 InitScoreList();
                 self.refreshIntervalId = setInterval(self.update, 20);
            }
            
            return self;
		}
        
        OnlineGameLogic=function(Players,playersCount,goal,roomRef,localplayer)
        {
            var self=GameLogic(Players,playersCount,goal);
            self.RoomRef=roomRef;
            
            self.RoomRef.child('Counter').on('value',function(snapshot)
            {
                ctx.clearRect((WIDTH / 2) - 30, (HEIGHT / 2) - 30, (WIDTH / 2) + 30, (HEIGHT / 2) + 30);
                ctx.fillStyle = 'white';
                ctx.fillText(snapshot.val(), (HEIGHT / 2) - 1, (WIDTH / 2) - 1, 20);
                ctx.fillStyle = 'black';
                if (snapshot.val() == 0) 
                {
                    ctx.clearRect((WIDTH / 2) - 30, (HEIGHT / 2) - 30, (WIDTH / 2) + 30, (HEIGHT / 2) + 30);
                }
            });
            
            self.update=function()
            {
                for(var key in self.PlayersList)
                {
                    self.PlayersList[key].update();
                }
            }
            
            
            self.RoomRef.child('FramesCounter').on('value',function(snapshot)
            {
               self.update(); 
            });
            
            self.Start=function()
            {
                
            }
            
            return self;
        }
        
        GetData=function(key)
        {
            var Data=localStorage.getItem(key);
            Data=atob(Data);
            Data=JSON.parse(Data);
            return Data;
        }
        
        loadData = function () 
        {
            var IsOnline=GetData('_IsOnline');
            if(IsOnline==true) return StartOnlineGame();
            else return StartRegularGame();
        }
        
        StartOnlineGame=function()
        {
            var Room=GetData('_Room');
            var Player=GetData('_Player');
            Player.RoomRef=dataBase.child(Room.Id);
            var PlayersList={};
            var PlayersCount = 0;
            
            var localPlayer;
            for(var key in Room.ConnectedPlayers)
            {
                if(key=='undefined')continue;
                var tempPlayer=Room.ConnectedPlayers[key];
                if(tempPlayer.Id==Player.Id)
                {
                    //if is the local player
                    
                   localPlayer=LocalPlayer(tempPlayer.Id,tempPlayer.Name,tempPlayer.Color,tempPlayer.Left,tempPlayer.Right,tempPlayer.IsHost,Player.RoomRef); 
                    PlayersList[tempPlayer.Id]=localPlayer;
                    PlayersCount++;
                }
                else
                {
                    //if in remote player
                    PlayersList[tempPlayer.Id]=UnlocalPlayer(tempPlayer.Id,tempPlayer.Name,tempPlayer.Color,tempPlayer.Left,tempPlayer.Right,tempPlayer.IsHost,Player.RoomRef);
                    PlayersCount++;
                }
            }
            
            //localStorage.clear();
            return OnlineGameLogic(PlayersList,PlayersCount,(PlayersCount-1)*10,Player.RoomRef);
        }
        
        StartRegularGame=function()
        {
            var playersList = {};
            var PlayersCount = 0;
            
            var Players = GetData('_PlayersList');
            var goal = GetData('_goal');
            
            for (var key in Players) 
            {
                playersList[PlayersCount]= Player(PlayersCount,Players[key].Name, Players[key].Color, Players[key].RightKey, Players[key].LeftKey);
                PlayersCount++;
            }
            localStorage.clear();
            return GameLogic(playersList,PlayersCount,goal);
        }
        var Game=loadData();
        Game.Start();

        
        
