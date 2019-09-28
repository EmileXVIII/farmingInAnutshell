import React, { Component } from 'react';
import './App.css';
import MainPage from './components/MainPage';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GamePage from './components/GamePage';
import { Redirect } from 'react-router-dom'
import { resolve } from 'path';
import Saver from './components/gameplay/inventory.dir/Saver'
import ShopSaver from "./components/gameplay/Shop/ShopSaver"
import test from './components/gameplay/inventory.dir/test';
import Merger from './components/items/expendable.dir/merger';
import Store from './components/gameplay/Room/Store'
import Axios from 'axios';

let lenInvExpendable = 8,
  lenInvEquipement = 3 * 8,
  inventoryEquipementSaver = new Saver('conteneur_inventaire', lenInvEquipement),
  inventoryExpendableSaver = new Saver('conteneur_activables', lenInvExpendable),
  shopSaver = new ShopSaver(),
  gestionnaireMergePotion = new Merger();
test(inventoryEquipementSaver, inventoryExpendableSaver);

const serveur = `localhost:8080`
let idPerso = []
let userPseudo = []
let arrayItems = []

class App extends Component {

  getItems() {
    Axios
      .get(`http://${serveur}/getItems`)
      .then(response => {
        // create an array of contacts only with relevant data
        const result = response.data.data;
        arrayItems = result
      })
  }

  render() {
    this.getItems()
    return (
      <div className="main-div">
        <Store>
          <Router>
            {/* Routing */}
            <Route exact path="/" component={MainPage} />
            <Route path="/game" render={(props) => <GamePage {...props} />} />
          </Router>
        </Store>
      </div>
    );
  }
}

export default App;
export { lenInvEquipement, lenInvExpendable, inventoryEquipementSaver, inventoryExpendableSaver, shopSaver, idPerso, serveur, gestionnaireMergePotion, userPseudo, arrayItems };
