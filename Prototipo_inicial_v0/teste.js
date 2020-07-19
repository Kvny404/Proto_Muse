var getDuration = {
    '/w': 4,
    '/h': 2,
    '/q': 1,
    '/8': 0.5,
}

let vue = new Vue({
    el: '#music-container',
    data: {
        clef: 'treble',
        timeSignature: '4/4',
        defaultOctave: '/4',
        defaultMeasures: 0,
        currentFigure: '/q',
        restActive: false,
        noteList: ['D4/8'],
        staveWidth: 280,
        measuresPerLine: 5,  
    },
    computed: {
        beats(){return  parseInt(this.timeSignature.slice(this.timeSignature.length - 1)) },
        staves() {
            let stavesArr = []
            let currentArr = []
            let timeSum = 0
            this.noteList.forEach((note,i) => {
                let noteDuration = getDuration[note.slice(-2)]
                if(timeSum + noteDuration < this.beats) {
                    currentArr.push({string:note})
                    timeSum += noteDuration
                }
                else if(timeSum + noteDuration === this.beats) {
                    currentArr.push({string:note})
                    stavesArr.push({notes: currentArr})   
                    currentArr = []    
                    timeSum = 0
                }
                else {
                    console.log('s')
                    
                    fillRest(currentArr, this.beats - timeSum)
                    stavesArr.push({notes: currentArr})
                    currentArr = []
                    currentArr.push({string:note})   
                    timeSum = noteDuration
                }
            })

            if(timeSum!== 0) {
                fillRest(currentArr, this.beats - timeSum)
                stavesArr.push({notes: currentArr})
                currentArr = []
            }

            return stavesArr
        }
    },

    watch: {
        staves: () => drawSheet()
    }

})

const VF = Vex.Flow;
var vf, score, system

function fillRest(stave, remaining) {

    
    let order = Object.keys(getDuration)
    let values = Object.values(getDuration)
 
    while(remaining > 0) {
        if(remaining - values[0] >= 0) {
            remaining -= values[0]
            stave.push({string:restString(order[0])})
        }
        else {
            order.shift()
            values.shift()
        }
    }
    
}

function restString(time) {
    return `B4${time}/r`
}

function setupVexFlow() {
    x = 0
    y = 80
    document.querySelector('body').innerHTML = ''
    let div = document.createElement('div')
    div.id = 'vf'
    document.querySelector('body').appendChild(div)
    vf = new VF.Factory({ renderer: { elementId: 'vf', height: 900, width: 1600 } });
    score = vf.EasyScore();

}

function drawSheet() {
    setupVexFlow()

    let noteString = ''
    vue.staves.forEach((stave, i) => {
        if (i % vue.measuresPerLine === 0) {
            x = 0; y = 80 * Math.ceil((i + 1) / 5)
        }
        system = makeSystem(vue.staveWidth)
        stave.notes.forEach(note => {
            noteString += note.string + ','
        })
        let notes = score.notes(noteString)
        let voice = score.voice(notes)
        let voiceList = [voice]
        let RenderedStave = { voices: voiceList }


        if (i % vue.measuresPerLine === 0) {
            system.addStave(RenderedStave).addClef(vue.clef).addTimeSignature(vue.timeSignature);
        }
        else { system.addStave(RenderedStave) }

        vf.draw();
        noteString = ''
        timeCalculator = 0

    })

}

var x = 0;
var y = 80;
function makeSystem(width) {
    var system = vf.System({ x: x, y: y, width: width, spaceBetweenStaves: 10 });
    x += width;
    return system;
}







