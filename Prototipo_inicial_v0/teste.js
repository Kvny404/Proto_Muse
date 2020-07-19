let vue = new Vue({
    el:'#music-container',
    data: {
        clef:'treble',
        timeSignature:'4/4',
        staves: [  
                {notes:[{string:'C#5/h', duration:2},{string:'B4/h/r',duration:2}]},
                {notes:[{string:'C#5/h', duration:2},{string:'B4/h/r',duration:2}]}, 
        ],
        staveWidth: 280,
        measuresPerLine: 5
    },

    watch: {
        staves: () => drawSheet()
    }

})

const VF = Vex.Flow;
var vf, score, system

function setupVexFlow() {
    x = 0
    y = 80
    document.querySelector('body').innerHTML = ''
    let div = document.createElement('div')
    div.id = 'vf'
    document.querySelector('body').appendChild(div)
    vf = new VF.Factory({renderer: {elementId: 'vf', height: 900, width:1600}});
    score = vf.EasyScore();
    
}

function drawSheet() {
    setupVexFlow()
    
    let noteString = ''
    let timeCalculator = 0
    vue.staves.forEach((stave,i) => {
        if(i%vue.measuresPerLine === 0) { 

            x = 0; y = 80*Math.ceil((i+1)/5)
            
           
        }
        system = makeSystem(vue.staveWidth)
        stave.notes.forEach(note => {
            timeCalculator+=note.duration
            noteString+= note.string + ','
        })
        let notes = score.notes(noteString)  
        let voice = score.voice(notes)
        let voiceList = [voice]
        let RenderedStave = {voices: voiceList}
        

        if(i%vue.measuresPerLine === 0) {
            system.addStave(RenderedStave).addClef(vue.clef).addTimeSignature(vue.timeSignature);
        }
        else {system.addStave(RenderedStave)}
        
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





