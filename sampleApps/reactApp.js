import Kan from '../src/Kan.js';
import '../src/components/';
import './app.scss';
import { ReactBuilder } from '../src/builders/reactBuilder.js'
import React from 'react';
import ReactDOM from 'react-dom'

Kan.setBuilder(ReactBuilder);
const PanelClass = Kan.getClass("KanPanel"),
    ButtonClass = Kan.getClass("KanButton");

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            times: 0,
            text: "hola btn2"
        };
    }

    handleClick(e){
        let { times, text } = this.state;
        times++;
        text = "clicked " + times + " times";
        this.setState({ times, text});
    }

    render(){
        return <PanelClass>
            <ButtonClass>
                hola btn
            </ButtonClass>
            <ButtonClass click={(e) => { this.handleClick(e) }}>
                {this.state.text}
            </ButtonClass>
        </PanelClass>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("application")
);
