const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//  16x9 ratio
const width = 1024
const height = 576

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

//  Creazione personaggi OOP

const gravity = 0.3

class Sprite {
    constructor({ position, velocity, color, offset }) {//passo un oggetto per non avere obblighi
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            } ,
            width: 100 ,
            height: 50,
            
            offset
        },

        this.color = color
        this.isAttacking

        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack

        if(this.isAttacking) {
            c.fillStyle = 'white'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }


    }

    update() {

        this.draw()

        //POSIZIONE ATTACKBOX

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        //MUOVO I PERSONAGGI VIA VELOCITY
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //SE E' IN ARIA APPLICA GRAVITA
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    checkEnd() {
        if(this.health <= 0) return true
        else return false
    }
}

const player = new Sprite({
    position:{
        x: 0,
        y: 0
    },

    velocity: {
        x: 0,
        y: 10
    },

    color: "#cd1900",

    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position:{
    x: 800,
    y: 400
    },

    velocity: {
        x: 0,
        y: 0
    },

    color: '#f09e00',

    offset: {
        x: -50,
        y: 0
    }

})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },


    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }

}

let timer = 5
function decreaseTimer() {
    setTimeout(decreaseTimer, 1000)
    if(timer > -1 ) {
        document.querySelector('.timer').innerHTML = timer    
        timer--
    };
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //PLAYER

    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //ENEMY

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //COLLISIONI PLAYER PER X E Y

    if( checkCollisions({
        player: player,
        enemy: enemy
    }) && player.isAttacking ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('.enemy-health').style.width = enemy.health + '%'
    }

    if( checkCollisions({
        player: enemy,
        enemy: player
    }) && enemy.isAttacking ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('.my-health').style.width = player.health + '%'
    }

}

function checkCollisions({ player, enemy }) {
    return (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
        && player.attackBox.position.x <= enemy.position.x + enemy.width 
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y 
        && player.attackBox.position.y <= enemy.position.y + enemy.height
        && player.isAttacking
    )
}

animate()

//movimenti 

window.addEventListener('keydown', (event) => {

    switch(event.key) {

        //MOVIMENTO PLAYER

        case 'd':
            //player.velocity.x = 5
            keys.d.pressed= true
            player.lastKey = 'd'
            break

        case 'a':
            //player.velocity.x = -5
            keys.a.pressed = true
            player.lastKey = 'a'
            break

        case 'w':
            player.velocity.y = -10
            break

        case ' ':
            player.attack()
            break

        //MOVIMENTO NEMICO
        
        case 'ArrowRight':
            //player.velocity.x = 5
            keys.ArrowRight.pressed= true
            enemy.lastKey = 'ArrowRight'
            break

        case 'ArrowLeft':
            //player.velocity.x = -5
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break

        case 'ArrowUp':
            enemy.velocity.y = -10
            break

        case 'ArrowDown':
            enemy.attack()
            break

    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {

        //MOVIMENTO PLAYER

        case 'd':
            //player.velocity.x = 0
            keys.d.pressed = false
            break

        case 'a':
            //player.velocity.x = 0
            keys.a.pressed = false
            break

        //MOVIMENTO NEMICO

        case 'ArrowRight':
            //player.velocity.x = 0
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            //player.velocity.x = 0
            keys.ArrowLeft.pressed = false
            break
    }
})