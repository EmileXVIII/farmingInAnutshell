import React, { Component } from "react";

class CharacterStuff extends Component {
    constructor() {
        super()
    }

    affichage(type) {
        let div = document.getElementById("list-inventaire")
        div.innerHTML = ""
        let titre = document.createElement('h4')
        let text = document.createTextNode(`${type}`)
        titre.className = `text-center`
        titre.appendChild(text)
        div.appendChild(titre)
        for (let i = 0; i < 9; i++) {
            const objet = document.createElement('div')
            objet.className = `objet ${type}`
            div.appendChild(objet)
        }
    }

    handleClickHelmet = () => {
        const type = "Helmet"
        this.affichage(type)
    }

    handleClickChest = () => {
        const type = "Chest"
        this.affichage(type)
    }
    handleClickMainHand = () => {
        const type = "Main Hand"
        this.affichage(type)
    }
    handleClickLegs = () => {
        const type = "Legs"
        this.affichage(type)
    }
    handleClickBoots = () => {
        const type = "Boots"
        this.affichage(type)
    }
    handleClickOffHand = () => {
        const type = "Off Hand"
        this.affichage(type)
    }

    render() {
        return (
            <div id="Character">
                <h3 className="text-center">Character</h3>
                <div class="character">
                    <div className="list-equip">
                        <div onClick={this.handleClickHelmet} className="objet Helmet"></div>
                        <div onClick={this.handleClickChest} className="objet Chest"></div>
                        <div onClick={this.handleClickMainHand} className="objet Main Hand"></div>
                    </div>
                    <div class="element-character"></div>
                    <div className="list-equip">
                        <div onClick={this.handleClickLegs} className="objet Legs"></div>
                        <div onClick={this.handleClickBoots} className="objet Boots"></div>
                        <div onClick={this.handleClickOffHand} className="objet Off Hand"></div>
                    </div>
                </div>
                <div id="list-inventaire">
                </div>
            </div>
        )
    }
}

export default CharacterStuff