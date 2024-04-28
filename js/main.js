// Canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Setup recorder
const stream = canvas.captureStream();
const recorder = new MediaRecorder(stream);
let isGenerating = false;

// Export video
function exportText(color, interval, bg) {

    // Reset frames for storing
    const frames = [];

    // Get frame when canvas updates
    recorder.ondataavailable = e => {
        frames.push(e.data)
    }

    // Start recording, and build video when it stops
    recorder.onstop = e => exportVid(new Blob(frames, { type: 'video/webm' }));
    recorder.start();

    // Start drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0)
    animation(color, interval, bg)

    // Export
    function exportVid(blob) {

        // Inputs to be used as file name
        let topText = document.getElementById('inputTop').value
        let bottomText = document.getElementById('inputBottom').value

        // Define default texts if undefined
        if (topText.length === 0) topText = 'MANKIND IS DEAD'
        if (bottomText.length === 0) bottomText = 'BLOOD IS FUEL'

        download(blob, `${topText}, ${bottomText}.webm`)
    }

}

// Draw
function animation(color, interval, background) {

    if (isGenerating == true) return alert('Calm your ass down, you\'already generating something')
    isGenerating = true;

    // Inputs
    let topInput = document.getElementById('inputTop').value
    let bottomInput = document.getElementById('inputBottom').value

    // Booleans
    let isTopEmpty = false
    let isBottomEmpty = false
    let canDrawBottom = false

    // Define default texts and interval if undefined
    if (topInput.length === 0 && bottomInput.length === 0) {
        topInput = 'MANKIND IS DEAD'
        bottomInput = 'BLOOD IS FUEL'
    } else {
        if (topInput.length === 0) isTopEmpty = true
        if (bottomInput.length === 0) isBottomEmpty = true
        if (interval.length === 0 || isNaN(interval)) interval = 15;
    }

    // Get arrays of letters from input strings
    const topText = []
    const bottomText = []
    function getLetters(input, output) {
        for (let i = 0; i < input.length; i++)
            output.push(input.substring(0, i + 1));
    }

    getLetters(topInput, topText)
    getLetters(bottomInput, bottomText)

    const temp = [] // Store top text in here to not lose it when drawing bottom
    let currentTopLetter = 0;
    let currentBottomLetter = 0;

    // Sizes and heights
    let topSize = 65
    const topHeight = 3

    let bottomSize = 80
    let bottomHeight = 2

    // Draw letters procedurally
    function drawLetters(position) {

        // Draw
        if (position === 'top') {

            temp.push(topText[currentTopLetter])
            let topTextWidth = ctx.measureText(topText[currentTopLetter]).width;

            // Clear canvas and draw background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0)

            // Text style
            ctx.fillStyle = `${color}`
            ctx.textAlign = 'center'
            
            // Decrease size if text gets drawn off screen
            if (topTextWidth > canvas.width) {
                topSize -= 5 
            }
            ctx.font = `bold ${topSize}px ULTRAKILL`;

            // The hedgehog
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowColor = "rgba(0,0,0,0.3)";

            // Draw text
            ctx.fillText(topText[currentTopLetter], canvas.width / 2, canvas.height / topHeight)

        } else {

            let bottomTextWidth = ctx.measureText(bottomText[currentBottomLetter]).width;

            // Clear canvas and draw background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, -0, -0)

            // Draw final stage of old top text
            if (isTopEmpty == false) {
                ctx.font = `bold ${topSize}px ULTRAKILL`;
                ctx.fillText(temp[temp.length - 1], canvas.width / 2, canvas.height / topHeight)
            }

            // Text style
            ctx.fillStyle = `${color}`
            ctx.textAlign = 'center'

            // Decrease size if text gets drawn off screen
            if (bottomTextWidth > canvas.width) {
                bottomSize -= 10
                bottomHeight += 0.1
            }
            ctx.font = `bold ${bottomSize}px ULTRAKILL`;

            // The hedgehog
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowColor = "rgba(0,0,0,0.3)";

            // Draw text
            ctx.fillText(bottomText[currentBottomLetter], canvas.width / 2, canvas.height / bottomHeight)

        }
    }

    // Draw text
    const top = setInterval(() => {

        // Draw top text
        if (currentTopLetter < topText.length && isTopEmpty == false) {
            drawLetters('top')
            currentTopLetter++;
        } else {
            canDrawBottom = true
            clearInterval(top)

            // Draw bottom text
            setTimeout(() => {
                const bot = setInterval(() => {

                    if (currentBottomLetter < bottomText.length && canDrawBottom == true && isBottomEmpty == false) {
                        drawLetters('bottom')
                        currentBottomLetter++;
                    } else {
                        recorder.stop()
                        isGenerating = false
                        clearInterval(bot)
                    }

                }, interval);
            }, 500);

        }

    }, interval);

}
