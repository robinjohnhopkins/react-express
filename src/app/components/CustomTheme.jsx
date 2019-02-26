import React, { Component } from "react";
import { render } from "react-dom";
import { VictoryPie,VictoryChart,VictoryScatter,VictoryBar,
    VictoryZoomContainer,VictoryTheme, VictoryAxis, VictoryLegend} from "victory";

function random (num, end){
    typeof end == "undefined" && (end = num) && (num = 0);
    return Math.floor((end - num) * Math.random() + num);
} 
var range = function(start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }
    return range;
}

export default class CustomTheme extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        data: this.getScatterData()
      }
    }
  
    getScatterData() {
      return range(1,50).map((index) => {
        return {
          x: random(1, 50),
          y: random(10, 90),
          size: random(8) + 3
        };
      });
    }
  
    render() {
      return (

        <VictoryChart
          domain={{y: [0, 100]}} style={{ parent: { maxWidth: "50%" } }}responsive={false}
          containerComponent={<VictoryZoomContainer zoomDomain={{x: [5, 35], y: [0, 100]}}/>}
        >
          <VictoryScatter
            data={this.state.data}
            style={{
              data: {
                opacity: (d) =>  d.y % 5 === 0 ? 1 : 0.7,
                fill: (d) => d.y % 5 === 0 ? "tomato" : "black"
              }
            }}
          />
          <VictoryLegend x={125} y={50}
                title="Zoom in/out scatter graph"
                centerTitle
                orientation="horizontal"
                gutter={20}
                style={{ border: { stroke: "black" }, title: {fontSize: 8 } }}
                data={[
                { name: "One", symbol: { fill: "tomato", type: "star" } },
                { name: "Two", symbol: { fill: "orange" } },
                { name: "Three", symbol: { fill: "gold" } }
                ]}
            />
          </VictoryChart>
      );
    }
  }