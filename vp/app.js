/* global $, d3 */

$(document).ready(function () {

    let diagram = window.svgpublish;

    function getBoroughColor(population)  {
        if (population >= 300000) return "#7F7F7F";
        if (population >= 200000) return "#A9A9A9";
        if (population >= 100000) return "#D4D4D4";
        return "#FFFFFF";
    }

    function getLondonColor(population) {
        if (population >= 8200000) return "#7F7F7F";
        if (population >= 7800000) return "#A9A9A9";
        if (population >= 7300000) return "#D4D4D4";
        return "#FFFFFF";
    }

    // format number as ###,###
    function formatPopulation(population) {
        return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // top-level placeholder
    function updateYearShape() {
        d3.select("#BIGYEAR").select("text").text(diagram.selectedYear);
    }

    // "London" shape
    function updateLondonShape() {
        let props = diagram.shapes["SUMMARY"].Props;
        let londonPopulation = props[diagram.selectedYear];

        let $londonShape = d3.select("#SUMMARY");
        let fields = $londonShape.selectAll("tspan").nodes();
        $londonShape.select("path").style('fill', getLondonColor(londonPopulation));

        d3.select(fields[0]).text(diagram.selectedYear);
        d3.select(fields[1]).text(formatPopulation(londonPopulation));
    }

    // Borough shape colors
    function updateBoroughShapes() {

        d3.selectAll(".BOROUGH").each(function(d, i, nodes) {
            let $boroughShape = d3.select(nodes[i]);
            let boroughProps = diagram.shapes[$boroughShape.attr("id")].Props;
            let boroughPopulation = boroughProps[diagram.selectedYear];
            $boroughShape.style('cursor', 'pointer');
            $boroughShape.select("path").style('fill', getBoroughColor(boroughPopulation));

        	$($boroughShape.node()).data('bs.tooltip', false).tooltip({
    	        container: "body",
	            html: true,
            	position: "auto top",
        	    title: `<strong>${boroughProps.Name}</strong><h3>${formatPopulation(boroughPopulation)}</h3>`
    	    });

	        $boroughShape.on('mouseover', function () {
        	    $boroughShape.select("path").style('fill', '#FFFFEE');
    	    });

	        $boroughShape.on('mouseout', function () {
            	$boroughShape.select("path").style('fill', getBoroughColor(boroughPopulation));
        	});
        });
    }

    function updateYearLine() {
        d3.selectAll(".YEAR").each(function (d, i, nodes) {
            let $yearShape = d3.select(nodes[i]);
            let year = $yearShape.select("text").text();
            $yearShape.select("rect").style("fill", function() {
                return year == diagram.selectedYear ? '#111' : null;
            })
        })
    }

    function selectYear(year) {
        diagram.selectedYear = year;
        updateYearLine();
        updateYearShape();
        updateLondonShape();
        updateBoroughShapes();
    }

    // hide elements marked to hide
    d3.selectAll(".HIDE").style('display', 'none');

    // year line control
    d3.selectAll(".YEAR").each(function (d, i, nodes) {
        let $yearShape = d3.select(nodes[i]);

        let year = $yearShape.select("text").text();

        $yearShape.style("cursor", 'pointer');

        $yearShape.on('click', function () {
            selectYear(year);
            d3.event.stopPropagation();
        });

        $yearShape.on('mouseover', function () {
            $yearShape.select("rect").style('fill', '#777');
        });

        $yearShape.on('mouseout', function () {
            $yearShape.select("rect").style('fill', function() {
                return year == diagram.selectedYear ? '#111' : null;
            });
        });
    });

    selectYear("1981");
});
