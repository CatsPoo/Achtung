//all methods than only return calc anser
getRandomStartY=function()
{
	return Math.floor(Math.random() * HEIGHT);
}
getRandomStartX=function()
{
	return Math.floor(Math.random() * WIDTH);
}
getRandomStartAngle=function(x,y)
{
	return Math.floor(Math.random() * 360);
}