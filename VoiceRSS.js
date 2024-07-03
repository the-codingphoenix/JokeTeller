const VoiceRSS = {
    // Main function to initiate speech synthesis
    speech: function(e) {
        this._validate(e); // Validate the settings
        this._request(e);  // Send the request to the VoiceRSS API
    },
    
    // Function to validate the provided settings
    _validate: function(e) {
        if (!e) throw "The settings are undefined"; // Check if settings are provided
        if (!e.key) throw "The API key is undefined"; // Check if API key is provided
        if (!e.src) throw "The text is undefined"; // Check if text to synthesize is provided
        if (!e.hl) throw "The language is undefined"; // Check if language is provided

        // If a codec is specified and it's not "auto", check browser support for the codec
        if (e.c && "auto" != e.c.toLowerCase()) {
            var supported = false;
            switch (e.c.toLowerCase()) {
                case "mp3":
                    supported = (new Audio).canPlayType("audio/mpeg").replace("no", ""); // Check if mp3 is supported
                    break;
                case "wav":
                    supported = (new Audio).canPlayType("audio/wav").replace("no", ""); // Check if wav is supported
                    break;
                case "aac":
                    supported = (new Audio).canPlayType("audio/aac").replace("no", ""); // Check if aac is supported
                    break;
                case "ogg":
                    supported = (new Audio).canPlayType("audio/ogg").replace("no", ""); // Check if ogg is supported
                    break;
                case "caf":
                    supported = (new Audio).canPlayType("audio/x-caf").replace("no", ""); // Check if caf is supported
            }
            if (!supported) throw "The browser does not support the audio codec " + e.c; // Throw error if codec is not supported
        }
    },
    
    // Function to send the request to the VoiceRSS API
    _request: function(e) {
        var requestParams = this._buildRequest(e); // Build the request parameters
        var xhr = this._getXHR(); // Get the XMLHttpRequest object
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) { // Check if the request is complete and successful
                if (xhr.responseText.indexOf("ERROR") == 0) throw xhr.responseText; // Throw error if response indicates an error
                audioElement.src = xhr.responseText; // Set the audio source to the response
                audioElement.play(); // Play the audio
            }
        };
        
        xhr.open("POST", "https://api.voicerss.org/", true); // Open a POST request to the VoiceRSS API
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); // Set the request header
        xhr.send(requestParams); // Send the request with parameters
    },
    
    // Function to build the request parameters
    _buildRequest: function(e) {
        var codec = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec(); // Determine the codec to use
        return "key=" + (e.key || "") + // Add API key to request parameters
               "&src=" + (e.src || "") + // Add text to synthesize to request parameters
               "&hl=" + (e.hl || "") + // Add language to request parameters
               "&r=" + (e.r || "") + // Add speech rate to request parameters
               "&c=" + (codec || "") + // Add codec to request parameters
               "&f=" + (e.f || "") + // Add audio format to request parameters
               "&ssml=" + (e.ssml || "") + // Add SSML to request parameters
               "&b64=true"; // Add flag to indicate response should be base64 encoded
    },
    
    // Function to detect the best supported audio codec
    _detectCodec: function() {
        var audio = new Audio();
        return audio.canPlayType("audio/mpeg").replace("no", "") ? "mp3" :
               audio.canPlayType("audio/wav").replace("no", "") ? "wav" :
               audio.canPlayType("audio/aac").replace("no", "") ? "aac" :
               audio.canPlayType("audio/ogg").replace("no", "") ? "ogg" :
               audio.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "";
    },
    
    // Function to get an XMLHttpRequest object
    _getXHR: function() {
        try { return new XMLHttpRequest(); } catch (e) {} // Try to create a standard XMLHttpRequest
        try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e) {} // Fallback for older IE versions
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {} // Fallback for older IE versions
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {} // Fallback for older IE versions
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {} // Fallback for older IE versions
        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {} // Fallback for older IE versions
        throw "The browser does not support HTTP request"; // Throw error if no XMLHttpRequest object can be created
    }
};