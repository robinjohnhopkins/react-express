import axios from 'axios';
import React, { Component } from "react";
import { VictoryPie,VictoryChart,VictoryScatter,VictoryBar,VictoryLegend,
    VictoryLine,VictoryTheme, VictoryAxis} from "victory";
import CustomTheme from './CustomTheme';

const url = process.env.NODE_ENV == `production` ? `` : "http://localhost:7777";

// see https://formidable.com/open-source/victory/docs/victory-line/

var data = [
    {quarter: 1, earnings: 13000},
    {quarter: 2, earnings: 16500},
    {quarter: 3, earnings: 14250},
    {quarter: 4, earnings: 19000}
  ];

export default class StatList extends React.Component {
  constructor(){
      super();
      this.state = {
        stats: []
      }
  }

  statsToLegend(stats){
    var fillTypes=[ { fill: "tomato", type: "star" },
        { fill: "orange" },
        { fill: "gold" } 
        ];
    const fills = stats.map(stat => {
        return {
            name: stat.name,
            symbol: (fillTypes.pop() || {fill: "orange"} )
        }
    });
    console.log(fills);
    return fills;
  }
  componentDidMount() {
    axios.get(url + `/stats`)
      .then(res => {
        const stats = res.data;
        const keys = stats.map(stat => {return stat.name});
        var legendData=this.statsToLegend(stats);
            // [
            // { name: "One", symbol: { fill: "tomato", type: "star" } },
            // { name: "Two", symbol: { fill: "orange" } },
            // { name: "Three", symbol: { fill: "gold" } }
            // ];

        console.log("keys", keys);
        this.setState({ stats });
        this.setState({ keys });
        this.setState({legendData});
        console.log("got stats", stats);
      })
  }

  render() {
    return (
        <div >
            <div style={{ display: "flex", flexWrap: "wrap", height:"50%" }}>
                <VictoryChart style={{ parent: { maxWidth: "50%" } }}>
                    <VictoryScatter
                        y={(data) => Math.sin(2 * Math.PI * data.x)}
                        samples={25}
                        size={5}
                        style={{ data: { fill: "tomato" }}}
                    />
                    <VictoryLine
                        style={{ data: { stroke: "orange" }}}
                        y={(data) => Math.sin(2 * Math.PI * data.x)}
                    />
                    <VictoryAxis/>
                    <VictoryAxis dependentAxis/>
                </VictoryChart>

                <VictoryChart style={{ parent: { maxWidth: "50%" } }}>
                    <VictoryAxis/>
                    <VictoryAxis dependentAxis/>
                    <VictoryLine
                        style={{ data: { stroke: "orange" }}}
                        y={(data) => Math.sin(2 * Math.PI * data.x)}
                    />
                    <VictoryScatter
                        y={(data) => Math.sin(2 * Math.PI * data.x)}
                        samples={25}
                        size={5}
                        style={{ data: { fill: "tomato" }}}
                    />
                </VictoryChart>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", height:"50%" }}>
                <VictoryChart domain={{x: [0, 3], y: [0, 40]}} 
                    style={{ parent: { maxWidth: "50%" } }} responsive={false}
                    // adding the material theme provided with Victory
                    theme={VictoryTheme.material}
                    domainPadding={20}
                >
                    <VictoryLegend x={160} y={50} 
                        style={{ parent: { maxWidth: "50%" } }} responsive={false}
                        title="My Legend"
                        centerTitle
                        orientation="horizontal"
                        gutter={10}
                        style={{ border: { stroke: "black" }, title: {fontSize: 9 } }}
                        data={this.state.legendData}
                    
                    />
                    <VictoryAxis
                    tickValues={[1, 2, 3, 4]}
                    // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
                    tickFormat={this.state.keys}
                    />
                    <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`${x}`)}
                    />
                    {/* <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
                    /> */}
                    <VictoryBar
                    data={this.state.stats}
                    x="name"
                    y="score"
                    />
                </VictoryChart>               
                <VictoryChart
                theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} responsive={false}
                >
                    <VictoryLine
                        style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc"}
                        }}
                        data={[
                        { x: 1, y: 2 },
                        { x: 2, y: 3 },
                        { x: 3, y: 5 },
                        { x: 4, y: 4 },
                        { x: 5, y: 7 }
                        ]}
                    />
                </VictoryChart>
            </div>           
            <div style={{ display: "flex", flexWrap: "wrap" , height:"50%"}}>
                <VictoryPie style={{ parent: { maxWidth: "50%" } }} responsive={false}
                colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                data={[
                    { x: "Cats", y: 35 },
                    { x: "Dogs", y: 40 },
                    { x: "Birds", y: 55 }
                  ]}
                />
                <CustomTheme/>
            </div>
            {/* <ul>
                 { this.state.stats.map(stat => <li key={stat.name}>{stat.name} {stat.score}</li>)}
            </ul>       */}
        </div>
    )
  }
}