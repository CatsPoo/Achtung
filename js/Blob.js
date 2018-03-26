Blob = function (id,radios, color) {
	var self = {
		ID : id,
		PosX : getRandomStartX(),
		PosY : getRandomStartY(),
		Radios : radios,
		Color : color,
	};
	self.draw = function () {
		ctx.fillStyle = self.Color;
		ctx.beginPath();
		ctx.arc(self.PosX, self.PosY, self.Radios, 0, 2 * Math.PI);
		ctx.fill();
	}
	return self;
}