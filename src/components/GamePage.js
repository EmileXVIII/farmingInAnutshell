import React, { Component } from "react";
import { Grid, Cell } from 'react-mdl'
import { Col, Button } from 'reactstrap';
import CharacterStuff from "./gameplay/CharacterStuff/CharacterStuff.js";
import Wrought from "./gameplay/Wrought";
import Shop from "./gameplay/Shop/Shop";
import Room from "./gameplay/Room/Room.js"
import Player from "./characters/Player"
import Monster from "./characters/Monster"
import Boss from "./characters/Boss"
import InventoryModule from "./gameplay/InventoryModule";
import soundfile from "../music/blackeyedpeas.mp3"
import Sound from "react-sound"
import Equipement from "./items/Equipement"
import Leggings from "./items/equipement.dir/Leggings.js";
import Helmet from "./items/equipement.dir/Helmet.js";
import Breastplate from "./items/equipement.dir/Breastplate.js";
import Shield from "./items/equipement.dir/Shield.js";
import Shoes from "./items/equipement.dir/Shoes.js";
import Weapon from "./items/equipement.dir/Weapon.js";
import SaverItemEquip from "./gameplay/CharacterStuff/SaverItemsEquip.js";
import { gestionnaireEvents } from "./gameplay/inventory.dir/inventoryEvents.js";
import {inventoryEquipementSaver} from '../App.js'

let itemsEquips = new SaverItemEquip(new Leggings('Leggings'), new Helmet('Helmet'), new Breastplate('Breastplate'), new Shield('Shield'), new Shoes('Shoes'), new Weapon('Weapon'))

class GamePage extends Component {
    constructor() {
        super()
        this.state = {
            gameplayElement: 'inventary',
            combatInfo: 'Waiting...',
            playerTest: new Player('Player'),
            monsterTest: new Monster('Monster'),
            bossTest: new Boss('Boss'),
            playerHP: null,
            monsterHP: null,
            counter: 0,
            gold: 500,
            levelPlayer: 0,
            xpPlayer: 0,
            arrayItem: itemsEquips.listObj,
            displayMonster: "/img/eventmonster.png",
            displaySkill: ''
        }
        this.lostGold = this.lostGold.bind(this)
        this.putMessage=this.putMessage.bind(this)
        this.changeImgSKill = this.changeImgSKill.bind(this)
        this.updateStats(this.state.playerTest)
    }
    componentDidMount (){
        gestionnaireEvents.on('displaySkill', this.changeImgSKill)
        gestionnaireEvents.on('sellItem',this.lostGold);
        gestionnaireEvents.on('newCombatInfo',this.putMessage)
    }
    componentWillUnmount (){
        gestionnaireEvents.off('sellItem',this.lostGold)
        gestionnaireEvents.off('newCombatInfo',this.putMessage)
        gestionnaireEvents.off('displaySkill', this.changeImgSKill)
    }

    changeImgSKill(img) {
        this.setState({displaySkill: img})
    }

    toggleElements() {
        switch (this.state.gameplayElement) {
            default: case 'inventary':
                return (
                    <div>
                        <InventoryModule />
                    </div>
                )
            case 'characterStuff':
                return (
                    <div>
                        <CharacterStuff items={this.state.arrayItem} player={this.state.playerTest}/>
                    </div>
                )
            case 'wrought':
                return (
                    <div>
                        <Wrought checkIfBuyable={(cost) => this.checkIfBuyable(cost)} lostGold={(cost) => this.lostGold(cost)} upgradeItem={(name) => this.setState({combatInfo: 'You upgraded ' + name })} items={this.state.arrayItem} updateStats={() => this.updateStats(this.state.playerTest)}/>
                    </div>
                )
            case 'shop':
                return (
                    <div>
                        <Shop checkIfBuyable={(cost) => {return this.checkIfBuyable(cost)}} lostGold={(cost) => {this.lostGold(cost)}} displayBuying={(name) => this.setState({ combatInfo: 'You just bought ' + name })} />
                    </div>
                )
            case 'room':
                return (
                    <div>
                        <Room startGame={() => this.checkPlayerAlive(this.state.playerTest, this.state.monsterTest)} startBoss={() => this.checkPlayerAliveBoss(this.state.playerTest, this.state.bossTest)} selfHealing={() => this.healMySelf(this.state.playerTest)} />
                    </div>
                )
        }
    }
    putMessage(message){
        this.setState({combatInfo:message})
    }
    updateStats = (player) => {
        this.getAtk(player)
        this.getDef(player)
        this.getDodge(player)
        this.getCritical(player)
        this.getLife(player)
    }

    getAtk(player) {
        var resultAtk = Math.round(player.stats.BaseAtk)
        for (let i = 0; i < this.state.arrayItem.length; i++) {
         resultAtk += this.state.arrayItem[i].atk
        }
        player.stats.Atk = resultAtk
    }
 
    getDef(player) {
     var resultDef = Math.round(player.stats.BaseDef)
     for (let i = 0; i < this.state.arrayItem.length; i++) {
      resultDef += this.state.arrayItem[i].def
         }
         player.stats.Def = resultDef
     }

     getDodge(player) {
        var resultDodge = player.stats.BaseDodge
        for (let i = 0; i < this.state.arrayItem.length; i++) {
         resultDodge += this.state.arrayItem[i].dodge
            }
            player.stats.Dodge = resultDodge
    }

    getLife(player) {
        var resultLife = Math.round(player.stats.BaseLife)
        for (let i = 0; i < this.state.arrayItem.length; i++) {
         resultLife += this.state.arrayItem[i].life
        }
            player.stats.Maxlife = resultLife
    }

    getCritical(player) {
            var resultCritical = player.stats.BaseCritical
            for (let i = 0; i < this.state.arrayItem.length; i++) {
             resultCritical += this.state.arrayItem[i].critical
            }
            player.stats.Critical = resultCritical
    }

    checkIfBuyable = (cost) => {
        if (cost > this.state.gold) {
            this.setState({ combatInfo: 'Too broke...' })
            return false;    
        }
        return true; 
    }
     

    lostGold = (gold) => {
        this.setState ((prevState)=>({ gold: prevState.gold - gold }))     
    }

     float2int = (value) => {
        return value | 0;
    }


    healMySelf = (character) => {
        character.stats.Life += 100
        if (character.stats.Life > character.stats.Maxlife) {
            character.stats.Life = character.stats.Maxlife
        }
        this.setState({ playerHP: character.stats.Life, combatInfo: 'You healed yourself'})
    }

    createCombat = (player, monster, callback) => {
        this.setState({ playerHP: player.stats.Life })
        this.setState({ monsterHP: monster.stats.Life })

        if (player.stats.Alive) {
            if (monster.stats.Alive) {
                setTimeout(() => callback('The battle begin'), 500)
            } else {
                setTimeout(() => callback('...but the farming is never ending !'), 500)
            }
        } else {
            const goldLost = Math.round(player.stats.Gold / 10)
            player.stats.Gold -= goldLost
            this.setState({ gold: player.stats.Gold, })
            this.setState({ combatInfo: 'You are dead. Heal yourself before going back. You killed ' + this.state.counter + ' monster. You lost ' + goldLost + ' gold.' })
        }
    }

    playerAlive = (player, monster, callback) => {
        setTimeout(() => callback(player.stats.Username + ' is going to attack !'), 500)
    }

    bothAlive = (player, monster, callback) => {
        if (monster.stats.Alive) {
            setTimeout(() => callback(player.Attack(monster)), 1000)
        }
        else {
            this.setState({displayMonster: "/img/eventmonster.png"})
            monster.stats.Life = 80 * player.stats.Level
            this.setState({ monsterHP: monster.stats.Life, combatInfo: 'Another monster is coming !' })
            setTimeout(() => callback(player.Attack(monster)), 1000)
        }
    }

    monsterAlive = (player, monster, callback) => {
        this.setState({ monsterHP: monster.stats.Life })

        if (monster.stats.Alive) {
            setTimeout(() => callback(monster.Attack(player)), 1000)
        } else {
            const goldEarned = monster.randomInt(100)
            const xpEarned = 50
            this.setState({ counter: this.state.counter + 1, gold: this.state.gold + goldEarned, xpPlayer: this.state.xpPlayer + xpEarned })
            player.stats.Gold = this.state.gold
            player.stats.Xp = this.state.xpPlayer
            if (player.stats.Xp >= 300 * player.stats.Level) {
                player.stats.Level += 1
                this.setState({xpPlayer: 0})
                player.stats.Xp = this.state.xpPlayer
                player.stats.BaseAtk *= 1.1
                player.stats.BaseDef *= 1.1
                player.stats.BaseLife *= 1.05
                this.updateStats(player)
                this.setState({displayMonster: '/img/monsterdead.png'})
                setTimeout(() => callback('You killed a monster. You earned ' + goldEarned + ' gold. Level up !'), 500)
            }
            else {
                this.setState({displayMonster: '/img/monsterdead.png'})
                setTimeout(() => callback('You killed a monster. You earned ' + goldEarned + ' gold and ' + xpEarned + ' XP.'), 500)
            }   
        }
    }

    checkPlayerAlive = (player, monster) => {
        if (player.stats.Alive) {
            this.setState({displayMonster: "/img/eventmonster.png"})
            setTimeout(() => this.testCombat2(player, monster, messageInfo => { this.setState({ combatInfo: messageInfo }) }), 500)
        }
        else {
            this.setState({ combatInfo: 'You should rest...' })
        }
    }

    checkPlayerAliveBoss = (player, boss) => {
        if (player.stats.Alive) {
            this.setState({combatInfo: 'The ultimate battle begin !', displayMonster: '/img/boss.png'})
            setTimeout(() => this.testCombatBoss(player, boss, messageInfo => { this.setState({ combatInfo: messageInfo }) }), 1000)
        }
        else {
            this.setState({ combatInfo: 'You should rest...' })
        }
    }

    createCombatBoss = (player, boss, callback) => {
        this.setState({ playerHP: player.stats.Life })
        this.setState({ monsterHP: boss.stats.Life })
        if (player.stats.Alive) {
                setTimeout(() => callback('Your hands are shaking but you can\'t go back'), 1000)       
        } else {
            const goldLost = Math.round(player.stats.Gold / 10)
            player.stats.Gold -= goldLost
            this.setState({ gold: player.stats.Gold, })
            setTimeout(() => this.setState({ combatInfo: 'You got destroyed. ' + boss.stats.Username + ' stole you ' + goldLost + ' gold.' }), 1000) 
        }
    }

    bossAlive = (player, boss, callback) => {
        if (boss.stats.Alive) {
            setTimeout(() => callback(player.Attack(boss)), 1000)
        }
    }

    playerAliveBoss = (player, boss, callback) => {
        this.setState({monsterHP: boss.stats.Life})

        if (boss.stats.Alive) {
            setTimeout(() => callback(boss.Attack(player)), 1000)
        } 
        else {
            const reward = new Weapon('Dragon sword')
            reward.setRarity('Legendary')
            reward.setDescription('Sword made with dragon tooth')
            reward.atk = 50
            inventoryEquipementSaver.addOnFreePlace(reward)
            this.setState({combatInfo: 'You did it. Congratulation ! You got the Legendary Dragon sword'})
        }
    }

    testCombatBoss = (player, boss, callback) => {
        this.createCombatBoss(player, boss, message => {
            this.setState({combatInfo: message})

            this.bossAlive(player, boss, message2 => {
                this.setState({combatInfo: message2})

                this.playerAliveBoss(player, boss, message3 => {
                    this.setState({combatInfo: message3})

                    this.testCombatBoss(player, boss)
                })
            })
        })
    }

    testCombat2 = (player, monster, callback) => {

        this.createCombat(player, monster, message => {
            this.setState({ combatInfo: message })

            this.playerAlive(player, monster, message2 => {
                this.setState({ combatInfo: message2 })

                this.bothAlive(player, monster, message3 => {
                    this.setState({ combatInfo: message3 })

                    this.monsterAlive(player, monster, message4 => {
                        this.setState({ combatInfo: message4 })

                        this.testCombat2(player, monster)
                    })
                })
            })
        })
    }



    render() {
        this.updateStats(this.state.playerTest)
        return (
            <div>
                {/* <Sound
                    url={soundfile}
                    playStatus={Sound.status.PLAYING}
                    onLoading={this.handleSongLoading}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                /> */}
                <div className="d-flex justify-content-around">
                    <h1 className="my-3 text-white text-center">Farming in a Nutshell</h1>
                    <a className="btn btn-logout btn-warning mt-3" href="/">Logout</a>
                </div>

                <div className="mt-5 border py-3  mx-3">
                    <Grid className="d-flex text-white">
                        {/*Game scene*/}
                        <div className="border col-6">
                            <div className=" row h-30">
                                <div className="col w-100 text-center">
                                    <img className="displaySkill" src={this.state.displaySkill}/> 
                                </div>
                                <div className="col w-100">
                                    <img src={this.state.displayMonster}/>
                                </div>         
                            </div>
                            <img width="700" src="/img/player.png" />
                            <div className="gameplay-infos border py-3 px-3">
                                <a>{this.state.combatInfo}</a>
                            </div>
                            <br />
                            <div className="d-flex justify-content-around"> 
                                <div className="gameplay-infos border py-3 px-3 col">
                                    <a>Player HP : {this.state.playerHP}</a>
                                </div>
                                <br />
                                <div className="gameplay-infos border py-3 px-3 col">
                                    <a>Monster HP : {this.state.monsterHP}</a>
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-around">
                                <div className="gameplay-infos border py-3 px-3 col">
                                    <a>Gold : {Math.round(this.state.gold)}</a>
                                </div>
                                <div className="gameplay-infos border py-3 px-3 col">
                                    <a>Monster killed : {this.state.counter}</a>
                                </div>
                            </div>      
                        </div>
                        <div className="col-6">
                            <div className="d-flex justify-content-around mb-5">
                                <Button onClick={() => this.setState({ gameplayElement: 'inventary' })}>Inventory</Button>
                                <Button onClick={() => this.setState({ gameplayElement: 'characterStuff' })}>Character</Button>
                                <Button onClick={() => this.setState({ gameplayElement: 'wrought' })}>Wrought</Button>
                                <Button onClick={() => this.setState({ gameplayElement: 'shop' })}>Shop</Button>
                                <Button onClick={() => this.setState({ gameplayElement: 'room' })}>Room</Button>
                            </div>
                            <Cell className="dynamic-content">
                                {this.toggleElements()}
                            </Cell>
                        </div>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default GamePage;
export {itemsEquips}