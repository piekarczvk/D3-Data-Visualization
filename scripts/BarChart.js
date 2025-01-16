// PART 3 & 4 - complete empty methods

/**
 * Bar chart class
 */
export default class BarChart{ 

    // Attributes (you can make those private too) 
    width; height; // size 
    svg; chart; bars; // selections 
    data; // internal data 

    // PART 3 - add scale properties

    // PART 4 - add axis properties

    // Constructor
    constructor(container, width, height,margin){ 
        // PART 3 - add margin parameter
        this.width = width; 
        this.height = height;
        this.margin=margin;
 
        this.svg = d3.select(container).append('svg')
            .classed('barchart', true) 
            .attr('width', width)
            .attr('height', height); 
        
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);
        // PART 3 - use margins to translate group

        this.bars = this.chart.selectAll('rect.bar'); 

        // PART 4 - add axes selections

        this.axisX=this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.height-this.margin[1]})`);
        this.axisY=this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`)

    } 

 

    // Private methods 

    // data is in the format [[key,value],...] 
    #updateBars(){ 
        // PART 3 - modify to use scales
        this.bars = this.bars 
            .data(this.data, d=>d[0]) 
            .join('rect') 
            .classed('bar', true) 
            .attr('x', (d,i) => i*40+5) 
            .attr('y', d => this.height - d[1]*10) 
            .attr('width', 40) 
            .attr('height', d => d[1]*10);
            
    } 

    #updateScales(){
        // PART 3 - complete method
        let charWidth=this.width-this.margin[2]-this.margin[3];
        let charHeight=this.height-this.margin[0]-this.margin[1];

        let rangeX=[0, charWidth];
        let rangeY=[chartHeight,0];

        let domainX=this.data.map(d=>d[0]);
        let domainY=[0,d3.max(this.data, d=>d[1])];
        
        this.scaleX=d3.scaleBand(domainX,rangeX).padding(0.2);
        this.scaleY=d3.scaleLinear(domainY,rangeY);

    }

    #updateAxes(){
        // PART 4 - complete method
    }
    

    // Public API 

    // The dataset parameter needs to be in a generic format, 
    // so that it works for all future data 
    // here we assume a [[k,v], ...] format for efficiency 
    render(dataset){ 
        this.data = dataset; 
        // PART 3 & 4 - add calls to other private methods
        this.#updateBars(); 
        this.#updateScales();
        return this; // to allow chaining 
    } 

} 