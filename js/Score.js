//this file includ all the methods that connected to ScoreList
InitScoreList=function()
{
    var goal=document.getElementById('goal');
    goal.innerHTML='Goal '+Game.Goal;
    var List=document.getElementById('ScoreList');
    var count=1;
    for(var key in Game.PlayersList)
    {
        var item=document.createElement('li');
        item.id='Player'+count+'Score';
        item.className="player"+count+' ScoreListIte';
        item.innerHTML+=Game.PlayersList[key].Name+' '+Game.PlayersList[key].Score;
        List.appendChild(item);
        count++;
    }    
}
        
UpdateScoreList=function()
{
    var items=document.getElementById('ScoreList');
    var count=1;
    for(var key=0;key<items.childNodes.length;key++)
    {
        if(key==0) continue;
        items.childNodes[key].innerHTML=Game.PlayersList[key-1].Name+' '+Game.PlayersList[key-1].Score;
        count++;    
    }
}

HaveWin=function()
{
    for(var key in Game.PlayersList)
	{
        if(Game.PlayersList[key].Score>=Game.Goal) 
        {
            return true;
        }
    }
    return false;
}

UpdateScore=function()
{
    for(var key in Game.PlayersList)
    {
        if(Game.PlayersList[key].IsActive==true)
        {
            Game.PlayersList[key].Score++;
        }
    }
    UpdateScoreList();
    if(HaveWin()==true) Game.EndGame();
}
