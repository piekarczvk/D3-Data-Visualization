/**
 * Line chart class
 */
export default class LineChart {

    

    // Attributes
    width; height; // Dimensions of the chart
    svg; chart; linePath; // Selections
    data; // Internal data storage

    // Scale and axis properties
    scaleX; scaleY;
    axisX; axisY;
    labelX; labelY;

    // Constructor
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        // Create the SVG container
        this.svg = d3.select(container).append('svg')
            .classed('linechart', true)
            .attr('width', width)
            .attr('height', height);

        // Create chart group with proper margins
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${margin[3]}, ${margin[0]})`);

        // Initialize line path selection
        this.linePath = this.chart.append('path')
            .classed('line', true);

        // Initialize axis groups
        this.axisX = this.svg.append('g')
            .attr('transform', `translate(${margin[3]}, ${height - margin[1]})`);

        this.axisY = this.svg.append('g')
            .attr('transform', `translate(${margin[3]}, ${margin[0]})`);

        // Initialize axis labels
        

         // Initialize axis labels
         this.labelX = this.svg.append('text')
         .attr('transform', `translate(${width / 2}, ${height - 5})`)
         .style('text-anchor', 'middle')
         .text('Year'); // Default X-axis label

     this.labelY = this.svg.append('text')
         .attr('transform', `rotate(-90)`)
         .attr('x', -(height / 2))
         .attr('y', 15)
         .style('text-anchor', 'middle')
         .text('Population'); // Default Y-axis label
    }

    // Private methods

    #updateScales() {
        const chartWidth = this.width - this.margin[1] - this.margin[3];
        const chartHeight = this.height - this.margin[0] - this.margin[2];

        this.scaleX = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[0])) // Domain is based on years
            .range([0, chartWidth]);

        this.scaleY = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d[1])]) // Domain is based on population
            .range([chartHeight, 0]);
    }

    #updateAxes() {
        const axisGenX = d3.axisBottom(this.scaleX).tickFormat(d3.format('d'));
        const axisGenY = d3.axisLeft(this.scaleY);

        this.axisX.call(axisGenX);
        this.axisY.call(axisGenY);
    }

    #updateLine() {
        const lineGen = d3.line()
            .x(d => this.scaleX(d[0])) // Map year to x-axis
            .y(d => this.scaleY(d[1])) // Map population to y-axis
            .curve(d3.curveMonotoneX); // Smooth line

        this.linePath
            .datum(this.data) // Bind data
            .attr('d', lineGen) // Generate line path
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2);
    }

    // Public methods

    render(dataset) {
        this.data = dataset;

        // Update scales, axes, and line path
        this.#updateScales();
        this.#updateAxes();
        this.#updateLine();

        return this; // Allow chaining
    }

    setLabels(labelX = 'Year', labelY = 'Population') {
        this.labelX.text(labelX);
        this.labelY.text(labelY);
    }

    
}