class Item {
    constructor(name, iconAdresse, description, id, rarity) {
        this.getIndexRarity = this.getIndexRarity.bind(this)
        this.rarityArray = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']

        this.infos = {
            id: id,
            cost: this.randomInt(100),
            specialAttribute: null,
            name: name,
            description: description,
            iconAdresse: iconAdresse,
            location: null,
            rarity: rarity
        }
        this.getIndexRarity = this.getIndexRarity.bind(this)
    }

    getRarityArray() {
        return this.rarityArray
    }
    getIndexRarity() {
        return this.getRarityArray().indexOf(this.stats.rarity)
    }

    setName(name) {
        this.infos.name = name
    }

    setId(id) {
        this.infos.id = id
    }

    setImage(image) {
        this.infos.iconAdresse = image
    }

    setRarity(rarity) {
        this.infos.rarity = rarity
    }

    setDescription(description) {
        this.infos.description = description
    }

    randomInt(Max) {
        return Math.floor(Math.random() * Max)

    }
}

export default Item