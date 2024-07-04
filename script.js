// Get the button and audio elements from the HTML
const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

// Function to disable/enable the button
function toggleButton() {
    button.disabled = !button.disabled; // Toggle the disabled property of the button
}

// Function to pass the joke to the VoiceRSS API for text-to-speech
function tellMe(joke) {
    const jokeString = joke.trim().replace(/ /g, '%20'); // Prepare the joke string for the API
    VoiceRSS.speech({
        key: '83cad11a89d34667a4e3e59968eb945b', // API key for VoiceRSS
        src: jokeString, // The joke to be spoken
        hl: 'en-us', // Language of the speech
        v: 'Linda', // Voice selection
        r: 0, // Speech rate
        c: 'mp3', // Audio codec
        f: '44khz_16bit_stereo', // Audio format
        ssml: false // SSML support
    });
}

// Asynchronous function to fetch jokes from the Joke API
async function getJokes() {
    let joke = ''; // Variable to store the joke
    const apiUrl = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'; // URL of the Joke API
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        const data = await response.json(); // Convert response to JSON
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`; // Combine setup and delivery if the joke has both
        } else {
            joke = data.joke; // Use single part joke
        }
        tellMe(joke); // Pass the joke to the text-to-speech function
        toggleButton(); // Disable the button
    } catch (error) {
        console.log(error); // Log any errors to the console
    }
}

// Event listener for the button to fetch a new joke when clicked
button.addEventListener('click', getJokes);
// Event listener for the audio element to re-enable the button when the audio ends
audioElement.addEventListener('ended', toggleButton);