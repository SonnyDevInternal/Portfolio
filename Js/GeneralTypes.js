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
    
    static stringToColor(string)
    {
        let vals = string.replace(/rgba?\(|\)/g, '').split(',')
        .map(callback => callback.trim());

        switch(vals.length)
        {
            case 3:
                return new Color(parseInt(vals[0]), parseInt(vals[1]),
                    parseInt(vals[2]), 255
                );
            break;

            case 4:
                return new Color(parseInt(vals[0]), parseInt(vals[1]),
                    parseInt(vals[2]), parseInt(vals[3])
                );
            break;

            default:
                throw new Error("Invalid Color string");
                break;
        }
    }

    getHex()
    {
        if (this.a === 255) 
            {
            return (this.r << 16) | (this.g << 8) | this.b;
        }
        return (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
    }

    getString()
    {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
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

class ThreadWorker
{
    constructor(fn, useWorker)
    {
        this.useWorker = useWorker;
        this.dataOut = null;

        this.hasEndEvent = false;
        this.onExecuted = null;

        this.hasThreadFinished = true; 

        if(useWorker) //real thread
        {
            this.worker = null;

            this.blob = new Blob([`
                onmessage = function(event) {
                    try {
                        const callback = ${fn.toString()};
                        const result = callback(...event.data);
                        postMessage(result);
                    } catch (error) {
                        postMessage({ error: error.message });
                    }
                }
            `], { type: 'application/javascript' });

            this.CreateThread();
        }
        else //fake thread
        {
            this.threadID = -1;
            this.callback = fn;
        }
    }

    SetCallback(callbackFn)
    {
        if(typeof callbackFn === "function")
        {
            this.hasEndEvent = true;
            this.onExecuted = callbackFn;
        }
        else
            this.hasEndEvent = false;
    }

    DestroyThread() //Call after done with Thread!
    {
        if(this.useWorker)
        {
            this.worker.terminate();
            URL.revokeObjectURL(this.url);

            this.worker = null;
        }
        else
        {
            if(this.threadID !== -1)
            {
                clearTimeout(this.threadID);
                this.threadID = -1;
            }
        }
    }

    ExecuteThread(...parameters) //Call to call Function
    {
        if(this.worker == null)
            this.CreateThread();

        this.hasThreadFinished = false;

        if(this.useWorker)
        {
           this.worker.postMessage(parameters);
        }
        else
        {
            this.threadID = setTimeout(() => this.OnFakeThreadRun(parameters), 0);
        }
    }

    CreateThread() //Call only if you deleted the last Thread
    {
        if (this.worker !== null) 
            return;

        if(this.useWorker) //real thread
        {
            this.url = URL.createObjectURL(this.blob);
            this.worker = new Worker(this.url);
    
            this.worker.onerror = (error) => {
                this.OnThreadError(error);
            }

            this.worker.onmessage = (event) => {
                this.OnThreadFinish(event);
            }
        }
    }

    OnThreadError(error)
    {
        console.error(`Thread Error: ${error.message} at ${error.filename}:${error.lineno}`);
        this.DestroyThread();
    }

    OnThreadFinish(event)
    {
        this.hasThreadFinished = true; 
        this.dataOut = event?.data ?? null;

        if(this.hasEndEvent)
            this.onExecuted();
    }

    OnFakeThreadRun(params)
    {
        if (this.threadID === -1) 
            return;

        try 
        {
            const result = this.callback(...params);

            this.OnThreadFinish({ data: result });

            this.threadID = -1;
        } 
        catch (error) 
        {
            this.OnThreadError(error);
        }
    }
}

class HtmlColorSwitcher
{
    constructor(self, callback)
    {
        this.htmlSelf = self;
        this.selfWorker = new ThreadWorker(this.OnInvokeFThread, false);

        this.callback = callback;

        this.finished = false;
    }

    IsReady()
    {
        return (this.finished === true);
    }

    OnInvokeFThread(self, originalColor, color, time) 
    {
        const start = new Date().getTime();
        const end = start + time;

        const interpolate = (start, end, percentage) =>
            start + (end - start) * (percentage / 100);
      
        const animate = () => {
          const tickNow = new Date().getTime();
          const tickElapsed = tickNow - start;
          
          const percentage = (tickElapsed / (end - start)) * 100;

          let c = originalColor;
          let selfHtml = self.htmlSelf;
      
          if (percentage >= 100) 
          {
            selfHtml.style.backgroundColor = color.getString();
            self.finished = true;

            if(typeof self.callback === "function")
                self.callback();

            return;
          }

          selfHtml.style.backgroundColor = new Color(
            interpolate(c.r, color.r, percentage),
            interpolate(c.g, color.g, percentage),
            interpolate(c.b, color.b, percentage),
            interpolate(c.a, color.a, percentage)
          ).getString();
      
          requestAnimationFrame(animate);
        };
      
        animate();
    }

    DoAnimation(color, time)
    {
        this.finished = false;

        let currentColor = Color.stringToColor(window.getComputedStyle(this.htmlSelf).backgroundColor);
        
        this.selfWorker.ExecuteThread(this, currentColor, color, time);
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

function removeFromListSearch(list, item)
{
    let index = list.indexOf(item);

    if(index > -1)
        list.splice(index, 1);
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}