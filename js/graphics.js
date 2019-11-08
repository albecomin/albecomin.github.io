
class Graphics {
    constructor(w, h) {
        this.w = w*window.innerWidth;
        this.h = h*window.innerHeight;
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.canvas.style.display = "flex";
        this.canvas.style.margin = "auto";
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.background = "none";
        // canvas.addEventListener("click", function() {Play();})
        this.xCenter = this.w/2;
        this.yCenter = this.h/2;
    
        this.context = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    
    plot(field, x, y) {
        for(let i = 0; i < x; i++) {            
            let dx = this.canvas.width/x;
            for(let j=0; j <y; j++) {
                let dy = this.canvas.height/y;
                let z = field.value(i*dx+dx/2, j*dy+dy/2);
                //console.log(z)
                this.context.strokeStyle = "none";
                this.context.fillStyle = this.RGBA(255*z, 0, 255*(1-z), z);
                this.context.fillRect(i*dx, j*dy, dx, dy)
            }
        }       
    }

    RGBA(r, g, b, a) {
        return "rgba("+r+","+g+","+b+","+a+")";
    }
}
