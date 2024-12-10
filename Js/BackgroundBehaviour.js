let TickCountBG = new Date().getTime();


let backgroundCanvas = document.getElementById("BackgroundCanvas");
let backgroundContext = backgroundCanvas.getContext("2d");

var sunScrollPercantage = 0;
var sunBorder = document.getElementById("sunBorder");
var sunContainer = document.getElementById("sContainer");

const sunnyTop = Color.hexToColor(0xFFE300);
const sunnyBottom = Color.hexToColor(0xA7FFFF);

const nightTop = Color.hexToColor(0x0a0e43);
const nightBottom = Color.hexToColor(0x050722);

var colorToDrawTop = sunnyTop;
var colorToDrawBottom = sunnyBottom;

let timeSpawnStars = 0.5;
let starList = [];

var rangePerDimension = 100;

let starRandomStarposList = 
[
    {"x": 87, "y": 22},
    {"x": 14, "y": 68},
    {"x": 62, "y": 5},
    {"x": 35, "y": 79},
    {"x": 77, "y": 42},
    {"x": 9, "y": 14},
    {"x": 56, "y": 33},
    {"x": 95, "y": 50},
    {"x": 28, "y": 93},
    {"x": 45, "y": 60},
    {"x": 70, "y": 10},
    {"x": 81, "y": 74},
    {"x": 19, "y": 48},
    {"x": 5, "y": 25},
    {"x": 91, "y": 7},
    {"x": 33, "y": 88},
    {"x": 49, "y": 37},
    {"x": 12, "y": 55},
    {"x": 63, "y": 20},
    {"x": 24, "y": 81},
    {"x": 84, "y": 46},
    {"x": 40, "y": 96},
    {"x": 66, "y": 28},
    {"x": 99, "y": 15},
    {"x": 51, "y": 64},
    {"x": 7, "y": 90},
    {"x": 17, "y": 36},
    {"x": 44, "y": 8},
    {"x": 80, "y": 29},
    {"x": 26, "y": 70},
    {"x": 92, "y": 41},
    {"x": 73, "y": 84},
    {"x": 3, "y": 53},
    {"x": 38, "y": 19},
    {"x": 59, "y": 76},
    {"x": 86, "y": 12},
    {"x": 22, "y": 45},
    {"x": 65, "y": 94},
    {"x": 97, "y": 27},
    {"x": 48, "y": 83},
    {"x": 20, "y": 39},
    {"x": 75, "y": 6},
    {"x": 11, "y": 58},
    {"x": 60, "y": 72},
    {"x": 34, "y": 16},
    {"x": 83, "y": 44},
    {"x": 93, "y": 87},
    {"x": 16, "y": 9},
    {"x": 46, "y": 67},
    {"x": 6, "y": 31}
];  

let curRndListIndex = 0;
let isStarLeft = false;


function DrawBackground() 
{
    const timeToSpawnStars = 0.5;

    backgroundContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const colorToAdd = colorToDrawBottom.sub(colorToDrawTop).div(rangePerDimension);
    
    let colorCopy = colorToDrawTop.copy();

    const width = window.innerWidth;
    const height = Math.ceil(window.innerHeight / rangePerDimension); 

    let currentTick = new Date().getTime();

    const deltaTime = (currentTick - TickCountBG) / 1000;

    TickCountBG = currentTick;

    for (let i = 0; i < rangePerDimension; i++) 
    {
        const y = height * i;
        colorCopy = colorCopy.add(colorToAdd).clamp();

        const color = `rgb(${Math.round(colorCopy.r)}, ${Math.round(colorCopy.g)}, ${Math.round(colorCopy.b)})`;

        backgroundContext.fillStyle = color;
        backgroundContext.fillRect(0, y, width, height + 1);
    }

    const maxStarCount = 25;
    const maxLivetimeStars = 1;

    if(sunScrollPercantage >= 70)
    {
        if(timeSpawnStars >= timeToSpawnStars && starList.length < maxStarCount)
        {
            let starPosObj = starRandomStarposList[curRndListIndex];
    
            starList.push({pos: {x: starPosObj.x, y: starPosObj.y}, timeAlive: 0});
    
            if(curRndListIndex + 1 >= starRandomStarposList.length)
                curRndListIndex = 0;
            else 
                curRndListIndex++;

            
            isStarLeft = true;
        }
        else
        {
            timeSpawnStars += deltaTime;
        }
    }

    if(isStarLeft)
    {
        for(let p = 0; p < starList.length; p++)
        {
            let cachedStar = starList[p];
    
            if(cachedStar.timeAlive >= maxLivetimeStars)
            {
                removeFromList(starList, p);

                if(starList.length > 0)
                    isStarLeft = true;
                else
                    isStarLeft = false;
            }
            else
            {
                const innerRadius = 2.5;
                const radius = 5;
                const points = 5;

                const x = (window.innerWidth  / 100) * cachedStar.pos.x;
                const y = (window.innerHeight / 100) * cachedStar.pos.y;

                const alphaValStar = 1.0 - (1.0 * (cachedStar.timeAlive / maxLivetimeStars));

                backgroundContext.globalAlpha = alphaValStar;
                backgroundContext.fillStyle = `rgb(255, 242, 0)`;
    
                backgroundContext.beginPath();
                const angle = Math.PI / points;
    
                for (let i = 0; i < 2 * points; i++)
                {
                  const r = (i % 2 === 0) ? radius : innerRadius;
                  const xPos = x + r * Math.cos(i * angle);
                  const yPos = y + r * Math.sin(i * angle);
                  backgroundContext.lineTo(xPos, yPos);
                }
    
                backgroundContext.closePath();
                backgroundContext.fill();
    
                cachedStar.timeAlive += deltaTime;
            }
            backgroundContext.globalAlpha = 1;
        }
    }
}

function updateCanvasDimension()
{
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}

function updateScroll() {
    const maxSunHeight = 35;
    const scrollY = window.scrollY;

    const sunBoarderAbsPos = getAbsolutePosition(sunBorder).top;

    const maxScrollHeight = sunBoarderAbsPos;
    sunScrollPercantage = Math.min(scrollY / maxScrollHeight, 1) * 100;

    if (sunScrollPercantage >= 100.0) 
    {
        if (!hasHiddenSun) 
        {
            hasHiddenSun = true;
            sunContainer.style.display = "none";

            timeSpawnStars = 0;
        }
        return;
    } else 
    {
        if (hasHiddenSun) 
        {
            hasHiddenSun = false;
            sunContainer.style.display = "";
        }

        const interpolate = (start, end, percentage) =>
            start + (end - start) * (percentage / 100);

        colorToDrawTop = new Color(
            interpolate(sunnyTop.r, nightTop.r, sunScrollPercantage),
            interpolate(sunnyTop.g, nightTop.g, sunScrollPercantage),
            interpolate(sunnyTop.b, nightTop.b, sunScrollPercantage),
            255
        );

        colorToDrawBottom = new Color(
            interpolate(sunnyBottom.r, nightBottom.r, sunScrollPercantage),
            interpolate(sunnyBottom.g, nightBottom.g, sunScrollPercantage),
            interpolate(sunnyBottom.b, nightBottom.b, sunScrollPercantage),
            255
        );
    
        if (sunScrollPercantage < maxSunHeight) 
        {
            sunScrollPercantage = maxSunHeight;
        }

        sunContainer.style.top = sunScrollPercantage + "%";
    }

    console.log("Offset is now: ", sunScrollPercantage);
}

setInterval(DrawBackground, 1000 / 80);

window.addEventListener("resize", updateCanvasDimension);
window.addEventListener("scroll", updateScroll);

updateCanvasDimension();
updateScroll();