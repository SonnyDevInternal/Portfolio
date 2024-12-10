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

function getAbsolutePosition(element)
{
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset; 
    const scrollY = window.scrollY || window.pageYOffset;

    return {
        top: rect.top + scrollY, 
        left: rect.left + scrollX,
        width: rect.width, 
        height: rect.height
    };
}

function removeFromList(list, index)
{
    list.splice(index, 1);
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}