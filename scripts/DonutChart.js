/**
 * Donut chart class
 */
export default class DonutChart{ 

    // PART 5 - complete this module

    // Use the code from BarChart to get started

    // Refer to the Pie and Arc Generator sample code too!

    width; height;
    svg;chart;slices;
    data;

    colorScale;

    constructor(container, width, height,margin){ 
        this.width = width; 
        this.height = height;
        this.margin=margin;
 
        this.svg = d3.select(container).append('svg')
            .classed('donutchart', true) 
            .attr('width', width)
            .attr('height', height); 
        
         // Create the chart group, centered in the SVG
         const centerX = (width - margin[1] - margin[3]) / 2 + margin[3];
         const centerY = (height - margin[0] - margin[2]) / 2 + margin[0];
 
         this.chart = this.svg.append('g')
             .attr('transform', `translate(${centerX}, ${centerY})`);

        this.slices = this.chart.selectAll('path.slice'); 
        this.colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

    } 
    #updateScales() {
        // PART 5 - update color scale based on data keys
        const domain = this.data.map(d => d[0]); // Keys of data
        this.colorScale.domain(domain);
    }

    #updateSlices() {
        // PART 5 - use pie and arc generators

        // Create pie generator
        const pie = d3.pie()
            .padAngle(0.02)

            .value(d => d[1]) // Value is the second element of each [key, value] pair
            .sort(null); // Disable sorting

        // Create arc generator
        const radius = Math.min(this.width, this.height) / 2 - Math.max(...this.margin);
        const arc = d3.arc()
            .innerRadius(radius / 2) // Inner radius for the donut hole
            .outerRadius(radius);    // Outer radius for the chart

        // Bind data and join elements
        this.slices = this.slices
            .data(pie(this.data), d => d.data[0]) // Bind data to slices
            .join('path')
            .classed('slice', true)
            .attr('d', arc) // Generate the path for each slice
            .attr('fill', d => this.colorScale(d.data[0])); // Fill based on color scale
    }

    #updateLabels() {
        // PART 5 - Add labels for each slice
        const pie = d3.pie()
            .value(d => d[1])
            .sort(null);

        const radius = Math.min(this.width, this.height) / 2 - Math.max(...this.margin);
        const arc = d3.arc()
            .innerRadius(radius / 2) // Inner radius
            .outerRadius(radius);    // Outer radius

        // Bind data and create labels
        this.chart.selectAll('text.label')
            .data(pie(this.data), d => d.data[0])
            .join('text')
            .classed('label', true)
            .attr('transform', d => `translate(${arc.centroid(d)})`) // Position at slice centroid
            .style('text-anchor', 'middle')
            
            .text(d => d.data[0]); // Use the key as the label
    }

    // Public API

    render(dataset) {
        this.data = dataset;

        // Update scales, slices, and labels
        this.#updateScales();
        this.#updateSlices();
        this.#updateLabels();

        return this; // Allow chaining
    }

    setColors(colors) {
        // Update the range of the color scale
        this.colorScale.range(colors);
    }

}