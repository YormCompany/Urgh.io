var compression = require('compression');
var express = require('express');
var app = express();

//var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
var server = require('http').Server(app);
var io = require('socket.io')(server);

//app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/game'));
app.use(compression());

var clients = [];
var Items = [];
var enemys = [];
app.get('/', function (req, res) {
    res.send('hey you got back get "/"');
});

io.on("connection", function (socket) {

console.log(socket.id);
    var currentUser;
	var Item;
	var itemId;
	var enemy;
    var alreadyname = false;
	var sortingField = "maxexp";

    socket.on("USER_CONNECT", function () {
        for (var i = 0; i < clients.length; i++) {
            socket.emit("USER_CONNECTED", clients[i]);
        }
    });
	socket.on("CreateObject", function(){
		if(Items.length != 0)
		{
			for (var i = 0; i < Items.length; i++){
				socket.emit("ItemRespawn", Items[i]);
			}
		
			for (var i = 0; i < enemys.length; i++){
				socket.emit("EnemySpawn", enemys[i]);
			}
		}
	});
	
	socket.on("ItemCreate", function()
	{
	if(Items.length == 0)
	{
			for(var i = 0; i < 50; i++)
		{
				var ItemPer = Math.floor(Math.random() * 101);
				if(ItemPer <= 95)
				{
					itemId = Math.floor(Math.random() * 7);
				}
				else if(ItemPer <= 99)
				{
					itemId = Math.floor(Math.random() * 9);
				}
				else { itemId = 9; }
			
			Item = {
					id : i,
					Itemid : itemId,
					empty : false
				}
			Items.push(Item);
			socket.emit("ItemRespawn", Item);
			socket.broadcast.emit("ItemRespawn", Item);	
		}
	}
	});
	
	socket.on("ItemRemove", function(data){
		Items.splice(data.id, 1);
		socket.emit("ItemRemove", Items[data.id]);
		socket.broadcast.emit("ItemRemove", Items[data.id]);
	});

	socket.on("ItemRespawn", function(data){
		var ItemPer = Math.floor(Math.random() * 101);
			if(ItemPer <= 95)
			{
				itemId = Math.floor(Math.random() * 7);
			}
			else if(ItemPer <= 99)
			{
				itemId = Math.floor(Math.random() * 9);
			}
			else { itemId = 9; }
			
			Item = {
					id : data.id,
					Itemid : itemId,
					empty : false
				}
			Items[Item.id] = Item;
			socket.emit("ItemRespawn", Items[Item.id]);
			socket.broadcast.emit("ItemRespawn", Items[Item.id]);
	});

	socket.on("EnemyCreate", function(){
		if(enemys.length == 0)
		{
			for(var i = 0; i < 51; i++)
			{
			var x = Math.floor(Math.random() * 27201)-13600;
			var y = Math.floor(Math.random() * 8340)-40;
			var num = Math.floor(Math.random() * 2)+1;
			enemy = {
					type : num,
					posx : x,
					posy : y
				}
			enemys.push(enemy);
			socket.emit("EnemySpawn", enemy);
			socket.broadcast.emit("EnemySpawn", enemy);
			}
		}
	});

	socket.on("EnemySpawn", function()
	{
		var x = Math.floor(Math.random() * 27201)-13600;
			var y = Math.floor(Math.random() * 8340)-40;
			var num = Math.floor(Math.random() * 2);
			enemy = {
					type : num,
					posx : x,
					posy : y
				}
			enemys.splice(1,1);
			socket.emit("EnemySpawn", enemy);
			socket.broadcast.emit("EnemySpawn", enemy);
	});

    socket.on("PLAY", function (data) {
        currentUser = {
			ID : socket.id,
            Headcolor: data.Headcolor,
            Bodycolor: data.Bodycolor,
            name: data.name,
            position: data.position,
            scale: data.scale,
            anim: data.anim,
            Attackmotion : data.Attackmotion,
            aim : data.aim,
            hp: data.hp,
            maxhp: data.maxhp,
            sp:data.sp,
            bullet: data.bullet,
            bulletammo: data.bulletammo,
			maxbulletammo: data.maxbulletammo,
			level : data.level,
            maxexp: data.maxexp,
            weaponswitch: data.weaponswitch,
            meleepower: data.meleepower,
            meleeLength: data.meleeLength,
            bulletpower: data.bulletpower,
			throwid: data.throwid,
            poolitemname: data.poolitemname,
            throwammo : data.throwammo,
            throwpower: data.throwpower,
            itemId: data.itemId,
            itemStat: data.itemStat,
            occupation: data.occupation,
        }
        if (clients.length != 0) {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].name == currentUser.name) {
                    socket.emit("AlreadyName",currentUser);
                    alreadyname = true;
                }
                else {
                    alreadyname = false;
                }
            }
        }
        if (alreadyname == false) {
			clients.push(currentUser);
            socket.emit("PLAY", currentUser);
            socket.broadcast.emit("USER_CONNECTED",currentUser);
			 console.log(currentUser.name + "님이 입장하셨습니다.");
        }
    });

    socket.on("MOVE", function (data) {
        currentUser.position = data.position;
        //socket.emit("MOVE", currentUser);
        socket.broadcast.emit("MOVE", currentUser);
    });

    socket.on("TURN", function (data) {
        currentUser.scale = data.scale;
        //socket.emit("TURN", currentUser);
        socket.broadcast.emit("TURN",currentUser );
    });

    socket.on("ANIM", function (data) {
        currentUser.anim = data.anim;
        //socket.emit("ANIM", currentUser);
        socket.broadcast.emit("ANIM", currentUser);
    });

    socket.on("AIM", function (data) {
        currentUser.aim = data.aim;
        //socket.emit("AIM", currentUser);
        socket.broadcast.emit("AIM", currentUser);
    });

    socket.on("WeaponSwitch", function (data) {
        currentUser.weaponswitch = data.weaponswitch;
        currentUser.bullet = data.bullet;
        socket.broadcast.emit("WeaponSwitch", currentUser);
    });

    socket.on("MaxHP", function (data) {
        currentUser.maxhp = data.maxhp;
        socket.broadcast.emit("MaxHP", currentUser);

    });

    socket.on("Health", function (data) {
		if(data.name == currentUser.name)
		{
			currentUser.hp = data.hp;
			socket.broadcast.emit("Health", currentUser);
		}

    });

    socket.on("SP", function (data) {
        currentUser.sp = data.sp;
        socket.broadcast.emit("SP", currentUser);
    });

    socket.on("Shot", function () {
        socket.broadcast.emit("Shot", currentUser);
    });

    socket.on("Attackmotion", function (data) {
        currentUser.Attackmotion = data.Attackmotion;
        socket.broadcast.emit("Attackmotion", currentUser);
    });

    socket.on("Reaload", function (data) {
        currentUser.bulletammo = data.bulletammo;
        socket.broadcast.emit("Reaload", currentUser);
    });

	    socket.on("Maxbullet", function (data) {
        currentUser.maxbulletammo = data.maxbulletammo;
        socket.broadcast.emit("Maxbullet", currentUser);
    });

    socket.on("Throw", function (data) {
        currentUser.throwpower = data.throwpower;
        socket.broadcast.emit("Throw", currentUser);
    });

    socket.on("ThrowAmmo", function (data) {
		currentUser.throwid = data.throwid;
		currentUser.throwammo = data.throwammo;
		currentUser.poolitemname = data.poolitemname;
		socket.broadcast.emit("ThrowAmmo", currentUser);
    });

    socket.on("MaxEXP", function (data) {
		currentUser.level = data.level;
        currentUser.maxexp = data.maxexp;
		clients.sort(function(a,b){
			return b.maxexp - a.maxexp;
		});
        socket.broadcast.emit("MaxEXP", currentUser);
    });

    socket.on("BulletPower", function (data) {
        currentUser.bulletpower = data.bulletpower;
		socket.emit("BulletPower", currentUser);
        socket.broadcast.emit("BulletPower", currentUser);
    });

    socket.on("SwordPower", function (data) {
        currentUser.meleepower = data.meleepower;
		socket.emit("SwordPower", currentUser);
        socket.broadcast.emit("SwordPower", currentUser);
    });

    socket.on("SwordReach", function (data) {
        currentUser.meleeLength = data.meleeLength;
		socket.emit("SwordReach", currentUser);
        socket.broadcast.emit("SwordReach", currentUser);
    });

    socket.on("Occupation", function (data) {
        currentUser.occupation = data.occupation;
		socket.emit("Occupation", currentUser);
        socket.broadcast.emit("Occupation", currentUser);
    });

    socket.on("GetItem", function (data) {
        currentUser.itemId = data.itemId;
        currentUser.itemStat = data.itemStat;
        socket.broadcast.emit("GetItem", currentUser);
    });

	    socket.on("disconnect", function () {
        for (var i = 0; i < clients.length; i++) {
		if(currentUser != null)
		{
		 if (clients[i].name == currentUser.name) {
                console.log(clients[i].name + "님이 퇴장하셨습니다.");
                clients.splice(i, 1);
            }
            socket.broadcast.emit("USER_DISCONNECTED", currentUser);
		}           
        };
    });

	socket.on("Ranking", function(){
	  for(var i = 0; i < clients.length; i++)
	  {
		if(i < 11)
		{
			var rank = {
				ran: i,
				name: clients[i].name,
				score: clients[i].maxexp
			}
		}
		else{break;}
		socket.emit("Ranking", rank);
	  }
	})

	socket.on("USER_DISCONNECTED", function () {
        for (var i = 0; i < clients.length; i++) {
		if(currentUser != null)
		{
		 if (clients[i].name == currentUser.name) {
                console.log(clients[i].name + "님이 퇴장하셨습니다.");
                clients.splice(i, 1);
            }
			socket.emit("USER_DISCONNECTED", currentUser);
            socket.broadcast.emit("USER_DISCONNECTED", currentUser);
		}           
        };
    });
});

server.listen(process.env.PORT || 80, function () {
    console.log('------ 서버가 시작되었습니다. -------')
});