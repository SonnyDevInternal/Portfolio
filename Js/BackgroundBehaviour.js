class Color
{
    constructor(r,g,b,a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static hexToColor(value) 
    {
        let colorOut = new Color(
            (value >> 16) & 0xff,
            (value >> 8) & 0xff,
            value & 0xff,
            255                   
        );
        return colorOut;
    }
    

    getHex()
    {
        if (this.a === 255) 
            {
            return (this.r << 16) | (this.g << 8) | this.b;
        }
        return (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
    }

    sub(color)
    {
        let colourOut = new Color(this.r - color.r, 
            this.g - color.g, this.b - color.b, this.a - color.a
        );

        return colourOut;
    }

    clamp() 
    {
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        this.a = Math.max(0, Math.min(255, this.a));

        return this;
    }


    add(color)
    {
        let colourOut = new Color(this.r + color.r, 
            this.g + color.g, this.b + color.b, this.a + color.a
        );

        return colourOut;
    }

    div(value)
    {
        let colourOut = new Color(this.r / value, 
            this.g / value, this.b / value, this.a / value
        );

        return colourOut;
    }

    mul(value)
    {
        let colourOut = new Color(this.r * value, 
            this.g * value, this.b * value, this.a * value
        );

        return colourOut; 
    }

    copy()
    {
        return new Color(this.r, 
            this.g, this.b, this.a
        ); 
    }

    getMagnitude()
    {
        return Math.sqrt(this.r * this.r + this.g * 
            this.g + this.b * this.b + this.a * this.a);
    }

    normalizeColor()
    {
        const magnitude = this.getMagnitude();

        this.r = this.r / magnitude;
        this.g = this.g / magnitude;
        this.b = this.b / magnitude;
        this.a = this.a / magnitude;
    }

    normalizeColorCopy()
    {
        const magnitude = this.getMagnitude();

        let colorOut = new Color(this.r / magnitude, this.g / magnitude,
            this.b / magnitude, this.a / magnitude
        );

        return colorOut;
    }
}

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

var rangePerDimension = 100;

function DrawBackground() 
{
    backgroundContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const colorToAdd = colorToDrawBottom.sub(colorToDrawTop).div(rangePerDimension);
    
    let colorCopy = colorToDrawTop.copy();

    const width = window.innerWidth;
    const height = Math.ceil(window.innerHeight / rangePerDimension); 

    for (let i = 0; i < rangePerDimension; i++) 
    {
        const y = height * i;
        colorCopy = colorCopy.add(colorToAdd).clamp();

        const color = `rgb(${Math.round(colorCopy.r)}, ${Math.round(colorCopy.g)}, ${Math.round(colorCopy.b)})`;

        backgroundContext.fillStyle = color;
        backgroundContext.fillRect(0, y, width, height + 1);
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

    const maxScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    sunScrollPercantage = Math.min(scrollY / maxScrollHeight, 1) * 100;

    if (sunScrollPercantage >= 100.0) 
    {
        if (!hasHiddenSun) 
        {
            hasHiddenSun = true;
            sunContainer.style.display = "none";
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