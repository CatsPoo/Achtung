Player = function (id,name, color, keyR, keyL) {
	var self = Blob(id,5, color);
    
    self.Name=name;

	self.Angle = getRandomStartAngle();
	self.Speed = 3;

	self.KeyRight = keyR; //68
	self.KeyLeft = keyL; //65
    
    self.IsActive=true;
    self.Score=0;

	self.SpeedX = function () {
		return Math.cos(self.Angle / 180 * Math.PI * 1.2);
	}

	self.SpeedY = function () {
		return Math.sin(self.Angle / 180 * Math.PI * 1.2);
	}

	function rgbToHex(rgb) {
		return '#' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
	};

	self.CheckForCollosion = function () {
		if (self.PosX > WIDTH || self.PosX < 0 || self.PosY < 0 || self.PosY > HEIGHT)
			return true;
		if (rgbToHex(ctx.getImageData(self.calcNextX(), self.calcNextY(), 1, 1).data) != '#0')
			return true;

		return false;
	}

	self.calcNextX = function () {
		return self.PosX + (2 * self.SpeedX() * self.Speed);
	}

	self.calcNextY = function () {
		return self.PosY + (2 * self.SpeedY() * self.Speed);
	}

	self.update = function () {
        if(self.IsActive==true)
        {
            self.PosX += self.SpeedX() * self.Speed;
            self.PosY += self.SpeedY() * self.Speed;
		
            if (self.CheckForCollosion()==true)//(self.CheckForCollosion())
		    {
                console.log("boom");
                self.IsActive=false;
                UpdateScore();
                Game.DecreesNumberOfActivePlayers();
            }
        }
	}
	return self;
}

OnlinePlayer=function(id,name,color,left,right,isHost,roomRef)
{
    var self=Player(id,name,color,left,right);
    self.IsHost=isHost;
    self.Color=color;
    self.RoomRef=roomRef;
    
    self.RoomRef.child('ConnectedPlayers').child(self.ID).child('PosX').set(self.PosX);
    self.RoomRef.child('ConnectedPlayers').child(self.ID).child('PosY').set(self.PosY);
    self.RoomRef.child('ConnectedPlayers').child(self.ID).child('Angel').set(self.Angle);
    self.RoomRef.child('ConnectedPlayers').child(self.ID).child('IsActive').set(self.IsActive);
    
    return self;
}

LocalPlayer=function(id,name,color,left,right,isHost,roomRef)
{
    var self=OnlinePlayer(id,name,color,left,right,isHost,roomRef);
    
    self.InterRef;
    
    self.StartNewRound=function()
    {
        var counter=3;
        var ref=setInterval(function()
        {
            clearInterval(self.InterRef);
            self.RoomRef.child('Counter').set(counter);
            counter--;
            if(counter==-1) 
            {
                clearInterval(ref);
                
                self.InterRef=setInterval(function()
                {
                    FramesCount++;
                    self.RoomRef.child('FramesCounter').set(FramesCount);
                }
                ,30);
            }
            
        },1000);
    }
    
    self.update=function()
    {
       // SuperUpdate();
        self.Speed=1.5;
        if(self.IsActive==true)
        {
            self.PosX += self.SpeedX() * self.Speed;
            self.PosY += self.SpeedY() * self.Speed;
            self.RoomRef.child('ConnectedPlayers').child(self.ID).child('PosX').set(self.PosX);
            self.RoomRef.child('ConnectedPlayers').child(self.ID).child('PosY').set(self.PosY);
            self.RoomRef.child('ConnectedPlayers').child(self.ID).child('Angel').set(self.Angle);
            self.draw();
            
            if (self.CheckForCollosion()==true)//(self.CheckForCollosion())
		    {
                console.log("boom");
                //self.IsActive=false;
               // self.RoomRef.child('ConnectedPlayers').child(self.ID).child('IsActive').set(self.IsActive);
                //UpdateScore();
               // Game.DecreesNumberOfActivePlayers();
            }
        }
    }
    
    if(self.IsHost==true)
    {
        var FramesCount=0;
        self.RoomRef.child('FramesCounter').set(0);
        
        self.StartNewRound();
    }
   // var SuperUpdate=self.update;
    
    return self;
}

UnlocalPlayer=function(id,name, color, left, right,isHost,roomRef)
{
    var self=OnlinePlayer(id,name,color,left,right,isHost,roomRef);
    
    
    self.RoomRef.child('ConnectedPlayers').child(self.ID).once('value',function(snapshot)
    {
       self.PosX=snapshot.val().PosX;
       self.PosY=snapshot.val().PosY;
        self.Angle=snapshot.val().Angle;
        ctx.clearRect(0,0,WIDTH,HEIGHT);
    });
    
    self.update=function()
    {
        if(self.IsActive==true)
        {
            roomRef.child('ConnectedPlayers').child(self.ID).once('value',function(snapshot)
            {
                self.PosX=snapshot.val().PosX;
                self.PosY=snapshot.val().PosY;
                self.Angle=snapshot.val().Angle;
                self.IsActive=snapshot.val().IsActive;
                self.draw();
            });
        }
    }
    
    return self;
}

PlayerData=function(name,r,l)
{
    var self={
        Name:name,
        Right:r,
        Left:l,
    }
    self.Id;
    self.Color;
    self.IsReady=false;
    
    self.RoomRef;
    
    self.SetColor=function(index)
    {
        switch(index+1)
        {
            case 1:self.Color='blue'; break;
            case 2:self.Color='red'; break;
            case 3:self.Color='green'; break;
            case 4:self.Color='yellow'; break;
            case 5:self.Color='orange'; break;
            case 6:self.Color='purple'; break;
        }
        self.RoomRef.child('ConnectedPlayers').child(self.Id).child('Color').set(self.Color);
    }
    
    self.ChangeIsReadyState=function()
    {
        self.IsReady= !self.IsReady;
        self.RoomRef.child('ConnectedPlayers').child(self.Id).child('IsReady').set(self.IsReady);
    }
    
    return self;
}