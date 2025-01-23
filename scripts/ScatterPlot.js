export default class ScatterPlot {

    // Attributes
    width; height; // size
    svg; chart; dots; // selections
    data; // internal data

    // PART 3 - scale properties
    scaleX; scaleY;

    // PART 4 - axis properties
    axisX; axisY; labelX; labelY;

    // Constructor
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        // Create SVG container
        this.svg = d3.select(container).append('svg')
            .classed('scatter', true)
            .attr('width', width)
            .attr('height', height);

        // Create chart group
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        this.dots = this.chart.selectAll('circle.dot');

        // Create axis groups
        this.axisX = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.height - this.margin[1]})`);
        this.axisY = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        // Add labels for axes
        this.labelX = this.svg.append('text')
            .attr('transform', `translate(${this.width / 2}, ${this.height - 5})`)
            .style('text-anchor', 'middle');

        this.labelY = this.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -(this.height / 2))
            .attr('y', 15)
            .style('text-anchor', 'middle');
    }

    // Private methods

    #updateDots() {
        this.dots = this.dots
            .data(this.data, d => d[0]) // Bind data
            .join('circle')
            .classed('dot', true)
            .attr('cx', d => this.scaleX(d[0])) // Use scaleX for positioning
            .attr('cy', d => this.scaleY(d[1])) // Use scaleY for positioning
            .attr('r', 5); // Fixed radius for dots
    }

    #updateScales() {
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

        let rangeX = [0, chartWidth];
        let rangeY = [chartHeight, 0];

        let domainX = this.data.map(d => d[0]);
        let domainY = [0, d3.max(this.data, d => d[1])];

        this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2);
        this.scaleY = d3.scaleLinear(domainY, rangeY);
    }

    #updateAxes() {
        let axisGenX = d3.axisBottom(this.scaleX);
        let axisGenY = d3.axisLeft(this.scaleY);

        this.axisX.call(axisGenX);
        this.axisY.call(axisGenY);
    }

    // Public API

    render(dataset) {
        this.data = dataset;
        this.#updateScales();
        this.#updateDots();
        this.#updateAxes();
        return this; // Allow chaining
    }

    setLabels(labelX = 'X-axis', labelY = 'Y-axis') {
        this.labelX.text(labelX);
        this.labelY.text(labelY);
    }
}
