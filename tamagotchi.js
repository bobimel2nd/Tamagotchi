var pet = process.argv[2];
var act = process.argv[3];
var myPal = initPal(pet);

if (act === "init") myPal.writePal();
myPal.readPal();
myPal.execute(act);
myPal.writePal();

function initPal(name) {
  switch (name) {
    case "dog":
      var pal = new stdTamagotchi("dog");
      pal.outside = false;
      pal.bark = function() {
        console.log("Woof! Woof!");
      }
      pal.goOutside = function() {
        if (this.outside) {
          console.log("We're already outside though...");
        } else {
          console.log("Yay! I love the outdoors!");
          this.outside = true;
          this.bark();
        }
      }
      pal.goInside = function() {
        if (this.outside) {
          console.log("Do we have to? Fine...");
          this.outside = false;
        } else {
          console.log("I'm already inside...");
        }
      }
      return pal;
    case "cat":
      var pal = new stdTamagotchi("cat");
      pal.houseCondition = 100;
      pal.meow = function() {
        console.log("Meow! Meow!");
      }
      pal.destroyFurniture = function() {
        while (this.houseCondition > 0) {
          this.houseCondition -= 10;
          console.log("MUAHAHAHAHA! Take that Furniture!");
          this.bored = false;
          this.sleepy = true;
        }
      }
      pal.buyNewFurniture = function() {
        this.houseCondition += 50;
        console.log("Are you sure about that?");
      }
      return pal;
    default:
      displayHelp("Bad/No Pet Specified");
  }
}

function stdTamagotchi(name) {
  this.name = name;
  this.file = name + ".dat";
  this.hungry = false;
  this.sleepy = false;
  this.bored = true;
  this.age = 0;
  this.feed = function() {
    if (this.hungry) {
      console.log("That was yummy!");
      this.hungry = false;
      this.sleepy = true;
    } else {
      console.log("No thanks! I'm full.");
    }
  }
  this.sleep = function() {
    if (this.sleepy) {
      console.log("Zzzzzzzz");
      this.sleepy = false;
      this.bored = true;
      this.increaseAge();
    } else {
      console.log("No way! I'm not tired.")
    }
  }
  this.play = function() {
    if (this.bored) {
      console.log("Yay! Let's play!");
      this.bored = false;
      this.hungry = true;
    } else {
      console.log("Not right now. Later?");
    }
  }
  this.increaseAge = function() {
    this.age++;
    console.log("Happy Birthday to me! I am " + this.age + " old!");
  }
  this.execute = function(command) {
    if (this.hasOwnProperty(command)) {
      this[command]();
    } else {
      displayHelp("Bad/No Action Specified", this);
    }
  }
  this.readPal = function() {
    var fs = require("fs");
    if (fs.existsSync(this.file)) {
      var data = JSON.parse(fs.readFileSync(this.file));
      getAllProperties(this).forEach((element) => this[element] = data[element]);
    }
  }
  this.writePal = function() {
    var fs = require("fs");
    fs.writeFileSync(this.file, JSON.stringify(this));
    process.exit();
  }
}

function displayHelp(message, pal) {
  console.log(message);
  console.log("Valid command format: 'node tamagotchi <pet> <action>'");
  if (pal) {
    console.log("  where  <pet> = " + pal.name);
    console.log("  and <actions for " + pal.name + "> = " + getAllMethods(pal))
  } else {
    var pal = initPal("dog");
    console.log("  where  <pet> = " + pal.name);
    console.log("  and <actions for " + pal.name + "> = " + getAllMethods(pal))
    var pal = initPal("cat");
    console.log("  where  <pet> = " + pal.name);
    console.log("  and <actions for " + pal.name + "> = " + getAllMethods(pal))
  }
  console.log("To reset pet, use: 'node tamagotchi <pet> init'");
  process.exit();
}

function getAllMethods(object) {
  return Object.getOwnPropertyNames(object).filter(function(property) {
      const skip = ["execute", "readPal", "writePal"];
      var typ = typeof object[property];
      return ((typ === "function") && (skip.indexOf(property) === -1));
  });
}

function getAllProperties(object) {
  return Object.getOwnPropertyNames(object).filter(function(property) {
      const only = ["string", "boolean", "number"];
      var typ = typeof object[property];
      return (only.indexOf(typ) !== -1);
  });
}